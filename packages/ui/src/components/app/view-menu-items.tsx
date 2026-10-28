import type { WindowControls } from "@job-buddy/client";

import { ThemeMenuItems } from "./theme-menu-items";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

type ViewMenuActions = Pick<WindowControls, "reload" | "toggleDevTools" | "zoomIn" | "zoomOut" | "resetZoom">;

interface ViewMenuItemsProps {
  actions?: ViewMenuActions;
  devToolsAvailable?: boolean;
}

const windowItems = [
  { action: "reload", label: "重新加载", shortcut: "Ctrl+R", ariaShortcut: "Control+r" },
  { action: "toggleDevTools", label: "开发者工具", shortcut: "Ctrl+Shift+I", ariaShortcut: "Control+Shift+i" },
] as const;

const zoomItems = [
  { action: "zoomIn", label: "放大", shortcut: "Ctrl+=", ariaShortcut: "Control+=" },
  { action: "zoomOut", label: "缩小", shortcut: "Ctrl+-", ariaShortcut: "Control+-" },
  { action: "resetZoom", label: "重置缩放", shortcut: "Ctrl+0", ariaShortcut: "Control+0" },
] as const;

/** 标题栏和样式展示共用菜单；窗口操作及缩放状态由 Desktop 的 Electron 窗口持有。 */
export function ViewMenuItems({ actions, devToolsAvailable = false }: ViewMenuItemsProps) {
  return (
    <>
      <ThemeMenuItems />
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {windowItems.map(({ action, label, shortcut, ariaShortcut }) => (
          <DropdownMenuItem
            key={action}
            size="sm"
            disabled={!actions || (action === "toggleDevTools" && !devToolsAvailable)}
            onClick={actions?.[action]}
            aria-keyshortcuts={ariaShortcut}
            className="gap-6 text-xs"
          >
            {label}
            <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {zoomItems.map(({ action, label, shortcut, ariaShortcut }) => (
          <DropdownMenuItem
            key={action}
            size="sm"
            disabled={!actions}
            onClick={actions?.[action]}
            aria-keyshortcuts={ariaShortcut}
            className="gap-6 text-xs"
          >
            {label}
            <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    </>
  );
}
