import type { WorkspaceSection } from "./navigation-model";
import { SECTION_NAV_ITEMS } from "./navigation-model";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SecondaryNavigationProps {
  activeSection: WorkspaceSection;
  onSectionChange: (section: WorkspaceSection) => void;
}

/** 二级菜单：新对话与能力中心两个固定入口，位置与侧栏列表分离。 */
export function SecondaryNavigation({
  activeSection,
  onSectionChange,
}: SecondaryNavigationProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:px-1">
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {SECTION_NAV_ITEMS.map(({ id, title, icon: Icon, section }) => {
            const isActive = activeSection === section;

            return (
              <SidebarMenuItem key={id}>
                <SidebarMenuButton
                  type="button"
                  className="rounded-lg data-active:bg-sidebar-active data-active:hover:bg-sidebar-active"
                  tooltip={title}
                  isActive={isActive}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSectionChange(section)}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  <span>{title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
