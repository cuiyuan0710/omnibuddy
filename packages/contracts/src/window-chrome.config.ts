/**
 * 窗口 chrome 的平台几何配置。
 *
 * 数值同时被主进程（摆放 macOS 红绿灯、决定窗口装饰）与渲染进程
 * （给标题栏预留安全区）使用，集中在此避免两处各写一份。
 */
export const windowChromeConfig = {
  /** 标题栏高度，必须与 ui 的 `h-7.5`（1.875rem / 30px）保持一致。 */
  titleBarHeightPx: 30,
  /** macOS 红绿灯由系统绘制：圆点直径、圆点间距、距窗口左边缘的距离。 */
  trafficLight: {
    diameterPx: 12,
    gapPx: 8,
    leftPx: 12,
  },
  /** 红绿灯区域与标题栏第一个控件之间的间隙。 */
  trafficLightControlGapPx: 12,
} as const;
