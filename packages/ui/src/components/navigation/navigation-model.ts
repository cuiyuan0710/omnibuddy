import { House, Layers, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type WorkspaceSection = "agent" | "capabilities" | "ui-showcase" | "about";

export interface RailNavItem {
  id: string;
  title: string;
  icon: LucideIcon;
}

export interface SectionNavItem extends RailNavItem {
  /** 选中后驱动内容区的页面。 */
  section: WorkspaceSection;
}

/** 一级菜单：暂时只有首页，图标轨道保留后续多入口的位置。 */
export const HOME_NAV_ITEM: RailNavItem = {
  id: "home",
  title: "首页",
  icon: House,
};

/** 二级菜单入口；项目与对话是列表群组，各自单独渲染。 */
export const SECTION_NAV_ITEMS: readonly SectionNavItem[] = [
  { id: "new-chat", title: "新对话", icon: MessageSquare, section: "agent" },
  { id: "capabilities", title: "能力中心", icon: Layers, section: "capabilities" },
];
