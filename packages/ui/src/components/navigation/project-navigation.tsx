import { NavigationEmptyRow } from "./navigation-empty-row";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

/** 项目群组：项目能力尚未接入，只保留分组与空态，不读宿主数据。 */
export function ProjectNavigation() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:px-1">
      <SidebarGroupLabel>项目</SidebarGroupLabel>
      <SidebarGroupContent>
        <NavigationEmptyRow>暂无项目</NavigationEmptyRow>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
