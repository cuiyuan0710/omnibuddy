import { mkdir, readFile, realpath, rename, stat, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { basename, dirname, isAbsolute } from "node:path";

import type { WorkspaceProject } from "@omnibuddy/contracts";

/** Desktop-owned directory bookmarks used to organize local workspaces. */
export class ProjectDirectories {
  private queued: Promise<unknown> = Promise.resolve();

  public constructor(private readonly filePath: string) {}

  public list(): Promise<WorkspaceProject[]> {
    return this.run(() => this.read());
  }

  public add(directory: string): Promise<WorkspaceProject> {
    return this.run(async () => {
      const path = await realpath(directory);
      if (!(await stat(path)).isDirectory()) throw new Error("请选择项目文件夹");
      const projects = await this.read();
      const existing = projects.find((project) => this.samePath(project.path, path));
      if (existing) return existing;
      const project = { id: randomUUID(), name: basename(path) || path, path };
      await this.write([...projects, project]);
      return project;
    });
  }

  public rename(projectId: string, name: string): Promise<void> {
    return this.run(async () => {
      const projects = await this.read();
      if (!name.trim()) throw new Error("项目名称不能为空");
      if (!projects.some((project) => project.id === projectId)) throw new Error("项目不存在");
      await this.write(projects.map((project) => project.id === projectId ? { ...project, name: name.trim() } : project));
    });
  }

  public remove(projectId: string): Promise<void> {
    return this.run(async () => {
      const projects = await this.read();
      await this.write(projects.filter((project) => project.id !== projectId));
    });
  }

  private samePath(left: string, right: string): boolean {
    return process.platform === "win32" ? left.toLowerCase() === right.toLowerCase() : left === right;
  }

  private async read(): Promise<WorkspaceProject[]> {
    let source: string;
    try {
      source = await readFile(this.filePath, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    const value: unknown = JSON.parse(source);
    if (!Array.isArray(value) || !value.every((item) =>
      item && typeof item === "object" && typeof item.id === "string" &&
      typeof item.name === "string" && typeof item.path === "string" && isAbsolute(item.path),
    )) throw new Error("项目目录配置格式无效");
    return value;
  }

  private async write(projects: WorkspaceProject[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(projects, null, 2), "utf8");
    await rename(temporaryPath, this.filePath);
  }

  private run<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queued.then(operation);
    this.queued = result.catch(() => undefined);
    return result;
  }
}
