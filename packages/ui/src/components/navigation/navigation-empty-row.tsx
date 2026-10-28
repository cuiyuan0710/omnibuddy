import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

/** 群组空态行：项目与对话在数据接入前共用同一种占位。 */
export function NavigationEmptyRow({ children }: { children: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <span className="block px-2 py-1 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
          {children}
        </span>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
