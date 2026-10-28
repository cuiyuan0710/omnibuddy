import { create } from "zustand";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

interface ShellState {
  theme: ThemePreference;
  sidebarExpanded: boolean;
  setTheme: (theme: ThemePreference) => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

/** 只保存本地界面偏好，不保存宿主会话或连接状态。 */
export const useShellStore = create<ShellState>((set) => ({
  theme: "system",
  sidebarExpanded: true,
  /** 选择跟随系统或固定的本地界面主题。 */
  setTheme: (theme) => set({ theme }),
  /** 更新桌面侧栏展开状态。 */
  setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
}));
