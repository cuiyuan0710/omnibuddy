import { NavigationEmptyRow } from "./navigation-empty-row";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

/** 对话群组：会话契约接入前保持空态。 */
export function ConversationNavigation() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:px-1">
      <SidebarGroupLabel>对话</SidebarGroupLabel>
      <SidebarGroupContent>
        <NavigationEmptyRow>暂无对话</NavigationEmptyRow>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
