import type { LucideIcon } from "lucide-react";

import { HOME_NAV_ITEM } from "./navigation-model";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/** 一级菜单：悬浮/选中都用表面色（accent / active），与二级菜单同一套。 */
const RAIL_ITEM_CLASS =
  "mx-auto size-9.5! justify-center rounded-[0.625rem] p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-active data-active:text-sidebar-accent-foreground data-active:hover:bg-sidebar-active data-active:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-9.5!";

interface RailNavItemProps {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
}

/** 轨道条目：顶部主导航与底部设置共用同一尺寸和交互态。 */
export function RailNavItem({ label, icon: Icon, isActive, onClick }: RailNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        className={RAIL_ITEM_CLASS}
        aria-label={label}
        // 轨道常驻展开态，tooltip 需要跳过 sidebar 的 collapsed 判定。
        tooltip={{ children: label, hidden: false }}
        isActive={isActive}
        aria-current={isActive ? "page" : undefined}
        onClick={onClick}
      >
        <Icon aria-hidden="true" className="size-4.5" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/** 一级导航：只有首页时保持常选中；后续多入口按 activeSection 切换。 */
export function PrimaryNavigation() {
  const { title, icon } = HOME_NAV_ITEM;

  return (
    <SidebarContent className="gap-0 py-2" role="navigation" aria-label="主导航">
      <SidebarGroup className="p-1">
        <SidebarGroupContent>
          <SidebarMenu>
            <RailNavItem label={title} icon={icon} isActive />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
