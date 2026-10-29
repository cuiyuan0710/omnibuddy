import { rmSync } from "node:fs";
import { join } from "node:path";

// Clear only generated build output so stale files cannot enter release packages.
rmSync(join(import.meta.dir, "..", "dist"), { recursive: true, force: true });
