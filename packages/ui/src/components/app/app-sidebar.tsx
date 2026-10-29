import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { windowChromeConfig } from "@omnibuddy/contracts";

import { cn } from "@/lib/utils";
import type { UiRuntime } from "@omnibuddy/contracts";
import type { WorkspaceSection } from "@/components/navigation/navigation-model";
import { ConversationNavigation } from "@/components/navigation/conversation-navigation";
import { PrimaryNavigation, RailNavItem } from "@/components/navigation/primary-navigation";
import { ProjectNavigation } from "@/components/navigation/project-navigation";
import { SecondaryNavigation } from "@/components/navigation/secondary-navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export type { WorkspaceSection } from "@/components/navigation/navigation-model";

interface AppSidebarProps {
  runtime: UiRuntime;
  activeSection: WorkspaceSection;
  onSectionChange: (section: WorkspaceSection) => void;
}

/**
 * 两级侧栏：外层只负责定位与收起，
 * 内层拆成常驻图标轨道（一级）和条目面板（二级）。
 */
export function AppSidebar({
  runtime,
  activeSection,
  onSectionChange,
}: AppSidebarProps) {
  const { isMobile, setOpenMobile, state, setOpen } = useSidebar();
  const [appVersion, setAppVersion] = useState("");
  // 标题栏由宿主提供时侧栏让出它的高度；浏览器构建没有标题栏，整屏起算。
  const hasTitleBar = Boolean(runtime.windowControls);
  const titleBarHeightPx = hasTitleBar ? windowChromeConfig.titleBarHeightPx : 0;

  useEffect(() => {
    let active = true;
    void runtime.getAppInfo().then(
      (value) => {
        if (active) setAppVersion(value.version);
      },
      () => undefined,
    );
    return () => {
      active = false;
    };
  }, [runtime]);

  function selectSection(next: WorkspaceSection): void {
    onSectionChange(next);
    if (isMobile) {
      setOpenMobile(false);
      return;
    }
    // 收起态下点了条目要能看到对应内容，顺带展开二级面板。
    setOpen(true);
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      containerClassName="group-data-[side=left]:border-r-0"
      style={{ top: titleBarHeightPx, height: `calc(100svh - ${titleBarHeightPx}px)` }}
    >
      {/* 一级：图标轨道，收起侧栏时依然常驻。 */}
      <Sidebar
        collapsible="none"
        className="hidden w-(--sidebar-width-icon)! shrink-0 border-r border-sidebar-rail-border bg-sidebar-rail md:flex"
      >
        <PrimaryNavigation />
        <SidebarFooter className="shrink-0 items-center gap-1 p-1">
          {hasTitleBar ? null : (
            <SidebarTrigger
              aria-label={state === "collapsed" ? "展开侧栏" : "收起侧栏"}
              className="text-muted-foreground hover:text-foreground"
            />
          )}
          <SidebarMenu className="items-center">
            <RailNavItem label="设置" icon={Settings} />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      {/* 二级：当前区域的条目面板，收起侧栏时整块让位给轨道。 */}
      <Sidebar
        collapsible="none"
        className={cn(
          "min-w-0 flex-1 overflow-hidden border-r border-t border-r-sidebar-border border-t-sidebar-header-border pt-2",
          state === "collapsed" && !isMobile && "hidden",
        )}
      >
        <SidebarHeader className="shrink-0 gap-1 pt-3">
          <div className="flex items-center gap-2 px-2 pb-1" aria-label="应用信息">
            <span className="truncate text-base font-semibold">{runtime.appName}</span>
            {appVersion ? (
              <span className="truncate text-xs text-muted-foreground">v{appVersion}</span>
            ) : null}
          </div>
        </SidebarHeader>
        <SecondaryNavigation
          activeSection={activeSection}
          onSectionChange={selectSection}
        />
        <SidebarContent className="gap-3">
          <ProjectNavigation />
          <ConversationNavigation />
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
