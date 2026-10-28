import type { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import {
  resolveTrafficLightPosition,
  resolveWindowChrome,
  type HostPlatform,
  type WindowChrome,
} from "@job-buddy/client";

const hostPlatform = process.platform as HostPlatform;

/** macOS 保留系统红绿灯并隐藏标题栏；其余平台整体自绘窗口按钮。 */
export function resolveWindowChromeOptions(): BrowserWindowConstructorOptions {
  const trafficLightPosition = resolveTrafficLightPosition(hostPlatform);
  return trafficLightPosition
    ? { titleBarStyle: "hidden", trafficLightPosition }
    : { frame: false };
}

/** 读取当前窗口的 chrome 度量；缩放与全屏都会改变左侧留白。 */
export function readWindowChrome(window: BrowserWindow): WindowChrome {
  return resolveWindowChrome({
    platform: hostPlatform,
    zoomFactor: window.webContents.getZoomFactor(),
    fullScreen: window.isFullScreen(),
  });
}

/** 全屏切换会隐藏/恢复红绿灯，需要重新向渲染进程发布窗口状态。 */
export function subscribeWindowChrome(
  window: BrowserWindow,
  listener: () => void,
): () => void {
  window.on("enter-full-screen", listener);
  window.on("leave-full-screen", listener);
  return () => {
    window.removeListener("enter-full-screen", listener);
    window.removeListener("leave-full-screen", listener);
  };
}
