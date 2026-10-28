import { Copy, Minus, Square, X } from "lucide-react";
import type { HostPlatform, WindowControls } from "@job-buddy/client";

import { useWindowControls } from "@/hooks/use-window-controls";
import { cn } from "@/lib/utils";
import { AppIcon } from "./app-icon";
import { ViewMenuItems } from "./view-menu-items";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppTitleBarProps {
  controls: WindowControls;
  platform?: HostPlatform;
}

export function AppTitleBar({ controls, platform }: AppTitleBarProps) {
  const {
    maximized,
    windowChrome,
    devToolsAvailable,
    error,
    minimize,
    toggleMaximize,
    toggleDevTools,
    reload,
    zoomIn,
    zoomOut,
    resetZoom,
    close,
  } = useWindowControls(controls, platform);
  // macOS 的红绿灯由系统绘制，标题栏只让出安全区，不再重复画一组按钮。
  const usesHostWindowControls = platform === "darwin";

  return (
    <header
      className="relative z-20 flex h-7.5 shrink-0 select-none items-center justify-between bg-sidebar-rail text-sidebar-foreground/50 [app-region:drag]"
      style={windowChrome.leftInsetPx > 0 ? { paddingLeft: `${windowChrome.leftInsetPx}px` } : undefined}
      onDoubleClick={
        usesHostWindowControls
          ? (event) => {
              if (event.target === event.currentTarget) toggleMaximize();
            }
          : undefined
      }
    >
      <nav
        aria-label="应用菜单"
        className={cn(
          "flex shrink-0 items-center px-2 [app-region:no-drag]",
          usesHostWindowControls && "pl-0",
        )}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <SidebarTrigger
                size="icon-sm"
                aria-label="切换侧栏"
                className="size-7 rounded-lg text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:text-foreground"
              />
            }
          />
          <TooltipContent side="bottom">切换侧栏</TooltipContent>
        </Tooltip>
        <Button type="button" variant="ghost" className="h-6 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:text-foreground">
          关于
        </Button>
        <Button type="button" variant="ghost" className="h-6 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:text-foreground">
          编辑
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="ghost" className="h-6 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:text-foreground" />
            }
          >
            视图
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" animated={false} className="min-w-48 text-xs">
            <ViewMenuItems
              actions={{ reload, toggleDevTools, zoomIn, zoomOut, resetZoom }}
              devToolsAvailable={devToolsAvailable}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      {error && <span role="alert" className="truncate px-2 text-xs text-destructive">{error}</span>}
      {usesHostWindowControls ? null : (
        <div role="group" aria-label="窗口控制" className="flex h-full shrink-0 items-center [app-region:no-drag]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7.5 w-[46px] rounded-none text-muted-foreground transition-colors duration-150 hover:bg-muted/35 hover:text-foreground active:bg-muted/50 focus-visible:text-foreground dark:hover:bg-muted/35"
            aria-label="最小化"
            title="最小化"
            onClick={minimize}
          >
            <AppIcon icon={Minus} aria-hidden="true" className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7.5 w-[46px] rounded-none text-muted-foreground transition-colors duration-150 hover:bg-muted/35 hover:text-foreground active:bg-muted/50 focus-visible:text-foreground dark:hover:bg-muted/35"
            aria-label={maximized ? "还原" : "最大化"}
            title={maximized ? "还原" : "最大化"}
            onClick={toggleMaximize}
          >
            {maximized
              ? <AppIcon icon={Copy} aria-hidden="true" className="size-3.5 -scale-x-100" />
              : <AppIcon icon={Square} aria-hidden="true" className="size-3.5" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7.5 w-[46px] rounded-none text-muted-foreground transition-colors duration-150 hover:bg-red-600 hover:text-white active:bg-red-700 focus-visible:text-foreground dark:hover:bg-red-600 dark:hover:text-white dark:active:bg-red-700"
            aria-label="关闭"
            title="关闭"
            onClick={close}
          >
            <AppIcon icon={X} aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      )}
    </header>
  );
}
