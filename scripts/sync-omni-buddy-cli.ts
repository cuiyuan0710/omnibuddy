import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { createReadStream, createWriteStream, existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { appConfig } from "../app.config.ts";

interface NpmPackageMetadata {
  version: string;
  dist: {
    tarball: string;
    integrity: string;
  };
  os?: string[];
  cpu?: string[];
}

interface CodexPackageManifest {
  version: string;
  target: string;
  entrypoint: string;
}

const repositoryRoot = resolve(import.meta.dir, "..");
const runtimeParent = join(repositoryRoot, "packages", "desktop", "runtime", "omni-buddy-cli");
const contractDestination = join(repositoryRoot, "packages", "contracts", "src", "generated", "omni-buddy-cli");
const downloadCache = join(repositoryRoot, ".tmp", "omni-buddy-cli-downloads");
const appConfigPath = join(repositoryRoot, "app.config.ts");
const registryBase = "https://registry.npmjs.org";

function parseArgs(args: string[]): { useLatest: boolean; help: boolean } {
  const options = { useLatest: false, help: false };
  for (const arg of args) {
    if (arg === "--latest") options.useLatest = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function printHelp(): void {
  console.log(`Usage: bun run scripts/sync-omni-buddy-cli.ts [--latest]

Downloads the pinned OmniBuddy CLI runtime for this OS and CPU architecture,
preserves its upstream entry point, and generates the matching app-server TypeScript
protocol under packages/contracts/src/generated/omni-buddy-cli.

Options:
  --latest  Resolve the latest @openai/codex npm release and update
            app.config.ts after the runtime and protocol were prepared.
  -h, --help  Show this help.`);
}

function getPlatformTarget(): { platform: string; arch: string } {
  const platform = process.platform;
  const arch = process.arch;
  const supported = new Set(["win32-x64", "win32-arm64", "darwin-x64", "darwin-arm64", "linux-x64", "linux-arm64"]);
  const target = `${platform}-${arch}`;
  if (!supported.has(target)) {
    throw new Error(`Unsupported runtime target ${target}. Supported targets: ${[...supported].join(", ")}`);
  }
  return { platform, arch };
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Request failed (${response.status} ${response.statusText}): ${url}`);
  return await response.json() as T;
}

async function resolveNpmPackage(version: string, platform: string, arch: string): Promise<NpmPackageMetadata> {
  const packageVersion = `${version}-${platform}-${arch}`;
  const metadata = await getJson<NpmPackageMetadata>(`${registryBase}/@openai%2Fcodex/${packageVersion}`);
  if (metadata.version !== packageVersion) {
    throw new Error(`npm returned ${metadata.version}; expected ${packageVersion}`);
  }
  if (!metadata.dist?.tarball || !metadata.dist.integrity) {
    throw new Error(`npm metadata for ${packageVersion} is missing its tarball or integrity hash`);
  }
  if (metadata.os && !metadata.os.includes(platform)) {
    throw new Error(`The ${packageVersion} package does not support ${platform}`);
  }
  if (metadata.cpu && !metadata.cpu.includes(arch)) {
    throw new Error(`The ${packageVersion} package does not support ${arch}`);
  }
  return metadata;
}

async function verifyIntegrity(destination: string, integrity: string): Promise<void> {
  const [algorithm, expectedDigest] = integrity.split("-", 2);
  if (!algorithm || !expectedDigest || !["sha512", "sha384", "sha256"].includes(algorithm)) {
    throw new Error(`Unsupported npm integrity value: ${integrity}`);
  }
  const hash = createHash(algorithm);
  for await (const chunk of createReadStream(destination)) hash.update(chunk);
  const actualDigest = hash.digest("base64");
  if (actualDigest !== expectedDigest) {
    throw new Error(`Runtime integrity mismatch. Expected ${expectedDigest}, received ${actualDigest}`);
  }
}

async function downloadAndVerify(url: string, integrity: string, destination: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Runtime download failed (${response.status} ${response.statusText}): ${url}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
  await verifyIntegrity(destination, integrity);
}

function run(command: string, args: string[], cwd?: string): Promise<void> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { cwd, stdio: "inherit", windowsHide: true });
    child.once("error", rejectPromise);
    child.once("close", (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}`));
    });
  });
}

async function findCodexManifest(vendorDirectory: string): Promise<string> {
  const targets = await readdir(vendorDirectory, { withFileTypes: true });
  for (const target of targets) {
    if (!target.isDirectory()) continue;
    const manifestPath = join(vendorDirectory, target.name, "codex-package.json");
    try {
      await stat(manifestPath);
      return manifestPath;
    } catch {
      // Keep searching; platform packages contain one target directory.
    }
  }
  throw new Error(`Could not find codex-package.json under ${vendorDirectory}`);
}

async function isRuntimeReady(runtimeDirectory: string, version: string): Promise<boolean> {
  const markerPath = join(runtimeDirectory, "omni-buddy-cli.json");
  const manifestPath = await findCodexManifestIfPresent(join(runtimeDirectory, "vendor"));
  if (!existsSync(markerPath) || !manifestPath) return false;
  const [markerText, manifestText] = await Promise.all([
    readFile(markerPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  if (!markerText.includes(`"version": "${version}"`)) return false;
  const manifest = JSON.parse(manifestText) as CodexPackageManifest;
  if (manifest.version !== version || manifest.entrypoint !== "bin/codex.exe") return false;
  return existsSync(join(dirname(manifestPath), manifest.entrypoint));
}

async function findCodexManifestIfPresent(vendorDirectory: string): Promise<string | null> {
  if (!existsSync(vendorDirectory)) return null;
  const targets = await readdir(vendorDirectory, { withFileTypes: true });
  for (const target of targets) {
    if (!target.isDirectory()) continue;
    const manifestPath = join(vendorDirectory, target.name, "codex-package.json");
    if (existsSync(manifestPath)) return manifestPath;
  }
  return null;
}

async function replaceDirectory(stagedDirectory: string, destination: string): Promise<void> {
  const backupDirectory = `${destination}.previous-${crypto.randomUUID()}`;
  let movedCurrent = false;
  try {
    try {
      await rename(destination, backupDirectory);
      movedCurrent = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    await rename(stagedDirectory, destination);
    if (movedCurrent) await rm(backupDirectory, { recursive: true, force: true });
  } catch (error) {
    if (movedCurrent) {
      await rm(destination, { recursive: true, force: true });
      await rename(backupDirectory, destination);
    }
    throw error;
  }
}

async function updatePinnedVersion(version: string): Promise<void> {
  const source = await readFile(appConfigPath, "utf8");
  const matches = source.match(/omniBuddyCliVersion:\s*"[^"]+"/g) ?? [];
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one omniBuddyCliVersion in ${appConfigPath}`);
  }
  const updated = source.replace(matches[0], `omniBuddyCliVersion: "${version}"`);
  await writeFile(appConfigPath, updated, "utf8");
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();

  const { platform, arch } = getPlatformTarget();
  let version = appConfig.omniBuddyCliVersion;
  if (options.useLatest) {
    const latest = await getJson<{ version: string }>(`${registryBase}/@openai%2Fcodex/latest`);
    version = latest.version;
  }
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Invalid OmniBuddy CLI version: ${version}`);
  }

  const runtimeDestination = join(runtimeParent, `${platform}-${arch}`);
  const contractMarkerPath = join(contractDestination, "VERSION.md");
  if (existsSync(contractMarkerPath) && await isRuntimeReady(runtimeDestination, version)) {
    const contractMarker = await readFile(contractMarkerPath, "utf8");
    if (contractMarker.includes(`OmniBuddy CLI ${version}`)) {
      if (options.useLatest) await updatePinnedVersion(version);
      console.log(`OmniBuddy CLI ${version} is already ready for ${platform}/${arch}.`);
      return;
    }
  }

  const metadata = await resolveNpmPackage(version, platform, arch);
  await mkdir(runtimeParent, { recursive: true });
  await mkdir(downloadCache, { recursive: true });
  await mkdir(join(repositoryRoot, ".tmp"), { recursive: true });
  const workDirectory = await mkdtemp(join(repositoryRoot, ".tmp", "omni-buddy-cli-"));
  const archivePath = join(downloadCache, `${version}-${platform}-${arch}.tgz`);
  const partialArchivePath = `${archivePath}.${crypto.randomUUID()}.part`;
  const extractedDirectory = join(workDirectory, "extract");
  const stagedRuntime = join(workDirectory, "runtime");
  const stagedContracts = join(workDirectory, "contracts");
  const packageRoot = join(extractedDirectory, "package");

  try {
    if (existsSync(archivePath)) {
      console.log(`Using cached OmniBuddy CLI ${version} package for ${platform}/${arch}...`);
      try {
        await verifyIntegrity(archivePath, metadata.dist.integrity);
      } catch {
        await rm(archivePath, { force: true });
      }
    }
    if (!existsSync(archivePath)) {
      console.log(`Downloading OmniBuddy CLI ${version} for ${platform}/${arch}...`);
      await downloadAndVerify(metadata.dist.tarball, metadata.dist.integrity, partialArchivePath);
      await rename(partialArchivePath, archivePath);
    }
    await mkdir(extractedDirectory, { recursive: true });
    await run("tar", ["-xzf", archivePath, "-C", extractedDirectory]);
    await rename(packageRoot, stagedRuntime);

    const manifestPath = await findCodexManifest(join(stagedRuntime, "vendor"));
    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as CodexPackageManifest;
    if (manifest.version !== version) {
      throw new Error(`Runtime package reports version ${manifest.version}; expected ${version}`);
    }
    const entrypoint = join(dirname(manifestPath), manifest.entrypoint);
    await writeFile(join(stagedRuntime, "omni-buddy-cli.json"), `${JSON.stringify({
      name: "omni-buddy-cli",
      version,
      platform,
      arch,
      sourcePackage: "@openai/codex",
      npmIntegrity: metadata.dist.integrity,
    }, null, 2)}\n`);

    console.log("Generating the matching app-server protocol types...");
    await mkdir(stagedContracts, { recursive: true });
    await run(entrypoint, ["app-server", "generate-ts", "--out", stagedContracts]);
    const generatedIndex = join(stagedContracts, "index.ts");
    if ((await readFile(generatedIndex, "utf8")).length === 0) {
      throw new Error("The generated protocol index is empty");
    }
    await writeFile(join(stagedContracts, "VERSION.md"), `Generated from OmniBuddy CLI ${version} (${platform}/${arch}).\n`);

    await mkdir(dirname(contractDestination), { recursive: true });
    await replaceDirectory(stagedRuntime, runtimeDestination);
    await replaceDirectory(stagedContracts, contractDestination);
    if (options.useLatest) await updatePinnedVersion(version);

    console.log(`OmniBuddy CLI ${version} is ready at ${runtimeDestination}`);
    console.log(`Protocol types are ready at ${contractDestination}`);
    if (!options.useLatest && version !== appConfig.omniBuddyCliVersion) {
      throw new Error("The installed runtime and configured OmniBuddy CLI version differ");
    }
  } finally {
    await rm(partialArchivePath, { force: true });
    await rm(workDirectory, { recursive: true, force: true });
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
