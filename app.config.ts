/**
 * Product identity and release version shared by the Web and Electron apps.
 * The technical identifier (`omnibuddy`) remains fixed in package names, IPC
 * channels, and the local data directory.
 */
export const appConfig = {
  displayName: "OmniBuddy",
  version: "0.1.0",
  appId: "com.omnibuddy.desktop",
  github: {
    owner: "cuiyuan0710",
    repo: "omnibuddy",
  },
} as const;
