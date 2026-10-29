/**
 * Product identity and release version shared by the Web and Electron apps.
 * The technical identifier (`omnibuddy`) remains fixed in package names, IPC
 * channels, and the local data directory.
 */
export const appConfig = {
  displayName: "OmniBuddy",
  version: "0.1.3",
  appId: "com.omnibuddy.desktop",
  homepage: "https://github.com/cuiyuan0710/omnibuddy",
  maintainer: {
    name: "OmniBuddy contributors",
    email: "cuiyuan0710@163.com",
  },
  github: {
    owner: "cuiyuan0710",
    repo: "omnibuddy",
  },
} as const;
