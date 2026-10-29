import { windowChromeConfig } from "./window-chrome.config.js";

export type HostPlatform = "darwin" | "win32" | "linux";

/** 标题栏左侧需要为宿主绘制控件让出的空间。 */
export interface WindowChrome {
  leftInsetPx: number;
}

const TRAFFIC_LIGHT_COUNT = 3;

/** macOS 红绿灯的位置：水平按配置，垂直在标题栏内居中。 */
export function resolveTrafficLightPosition(
  platform?: HostPlatform,
): { x: number; y: number } | undefined {
  if (platform !== "darwin") return undefined;
  const { titleBarHeightPx, trafficLight } = windowChromeConfig;
  return {
    x: trafficLight.leftPx,
    y: Math.round((titleBarHeightPx - trafficLight.diameterPx) / 2),
  };
}

/** 三个圆点加两个间距占用的宽度。 */
function trafficLightWidthPx(): number {
  const { diameterPx, gapPx } = windowChromeConfig.trafficLight;
  return TRAFFIC_LIGHT_COUNT * diameterPx + (TRAFFIC_LIGHT_COUNT - 1) * gapPx;
}

/**
 * 计算标题栏左侧留白。
 *
 * 页面缩放会整体放大 CSS 像素，而系统绘制的红绿灯不会跟着变，所以按
 * zoomFactor 反算；全屏时 macOS 隐藏红绿灯，留白收到 0。
 * 非 macOS 平台的窗口按钮由渲染进程绘制，占据布局空间，无需留白。
 */
export function resolveWindowChrome({
  platform,
  zoomFactor = 1,
  fullScreen = false,
}: {
  platform?: HostPlatform;
  zoomFactor?: number;
  fullScreen?: boolean;
}): WindowChrome {
  if (platform !== "darwin" || fullScreen) return { leftInsetPx: 0 };
  const base =
    windowChromeConfig.trafficLight.leftPx +
    trafficLightWidthPx() +
    windowChromeConfig.trafficLightControlGapPx;
  return { leftInsetPx: Math.round(base / Math.max(zoomFactor, 0.1)) };
}
