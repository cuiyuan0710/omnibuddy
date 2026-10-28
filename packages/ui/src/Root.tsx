import { useState } from "react";
import type { CSSProperties } from "react";

import { AppInfoPanel } from "@/features/about/app-info-panel";
import { AppSidebar, type WorkspaceSection } from "@/components/app/app-sidebar";
import { AppTitleBar } from "@/components/app/app-title-bar";
import { AgentWorkspacePanel } from "@/features/agent/agent-workspace-panel";
import { CapabilityCenterPanel } from "@/features/capabilities/capability-center-panel";
import { UiShowcasePanel } from "@/features/showcase/ui-showcase-panel";
import {
  SidebarInset,
  SidebarProvider,
} from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";
import type { UiRuntime } from "@/runtime/contracts";
import { useShellStore } from "@/stores/shell-store";

interface RootProps {
  runtime: UiRuntime;
}

/** 展开宽度 = 一级图标轨道 + 二级面板；收起后只剩轨道（--sidebar-width-icon）。 */
const SIDEBAR_WIDTH_STYLE = {
  "--sidebar-width": "calc(var(--sidebar-width-icon) + 16rem)",
  "--sidebar-width-icon": "3.125rem",
} as CSSProperties;

/** Compose the desktop workspace shell and its independent views. */
export function Root({ runtime }: RootProps) {
  const { theme } = useTheme();
  const sidebarExpanded = useShellStore((state) => state.sidebarExpanded);
  const setSidebarExpanded = useShellStore((state) => state.setSidebarExpanded);
  const [activeSection, setActiveSection] = useState<WorkspaceSection>("agent");
  // 宿主不提供窗口能力（浏览器构建）时整条标题栏不渲染。
  const windowControls = runtime.windowControls;

  return (
    <div className="flex h-svh w-full flex-col overflow-hidden">
      <TooltipProvider delay={250}>
        <SidebarProvider
          open={sidebarExpanded}
          onOpenChange={setSidebarExpanded}
          className="min-h-0 flex-1 flex-col"
          style={SIDEBAR_WIDTH_STYLE}
        >
          {windowControls
            ? <AppTitleBar controls={windowControls} platform={runtime.platform} />
            : null}
          <div className="flex min-h-0 flex-1 bg-sidebar">
            <AppSidebar
              runtime={runtime}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <SidebarInset className="min-w-0 overflow-hidden rounded-tl-none border-t border-sidebar-header-border">
              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-4xl">
                  {activeSection === "agent" && <AgentWorkspacePanel />}
                  {activeSection === "capabilities" && <CapabilityCenterPanel />}
                  {activeSection === "ui-showcase" && <UiShowcasePanel theme={theme} />}
                  {activeSection === "about" && <AppInfoPanel runtime={runtime} />}
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
