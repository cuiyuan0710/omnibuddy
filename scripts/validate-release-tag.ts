import { appConfig } from "../app.config.js";

const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;
const expected = `v${appConfig.version}`;

if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(appConfig.version)) {
  throw new Error(`Stable releases require app.config.ts version to be plain X.Y.Z; received ${appConfig.version}.`);
}

if (!tag || tag !== expected) {
  throw new Error(`Release tag must exactly match app.config.ts: expected ${expected}, received ${tag ?? "<missing>"}.`);
}

console.log(`Validated release tag ${tag}.`);
