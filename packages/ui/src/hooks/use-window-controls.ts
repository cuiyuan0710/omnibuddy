import { useEffect, useState } from "react";
import {
  resolveWindowChrome,
  type HostPlatform,
  type WindowControls,
  type WindowState,
} from "@job-buddy/client";

/** Subscribe to Desktop's window state without making UI its owner. */
export function useWindowControls(controls: WindowControls, platform?: HostPlatform) {
  // 首帧先按平台配置推算留白，避免等待 IPC 期间标题栏横向跳动。
  const [state, setState] = useState<WindowState>(() => ({
    maximized: false,
    chrome: resolveWindowChrome({ platform }),
  }));
  const [devToolsAvailable, setDevToolsAvailable] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    let receivedUpdate = false;
    const unsubscribe = controls.subscribe((next) => {
      receivedUpdate = true;
      if (active) setState(next);
    });
    void controls.getState().then((initial) => {
      if (active && !receivedUpdate) setState(initial);
    }).catch(() => {
      if (active) setError("无法读取窗口状态");
    });
    void controls.canOpenDevTools().then((available) => {
      if (active) setDevToolsAvailable(available);
    }).catch(() => {
      if (active) setDevToolsAvailable(false);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [controls]);

  async function run(action: () => Promise<void>): Promise<void> {
    setError(undefined);
    try {
      await action();
    } catch {
      setError("窗口操作失败，请重试");
    }
  }

  return {
    maximized: state.maximized,
    windowChrome: state.chrome,
    devToolsAvailable,
    error,
    minimize: () => run(() => controls.minimize()),
    toggleMaximize: () => run(() => controls.toggleMaximize()),
    toggleDevTools: () => run(() => controls.toggleDevTools()),
    reload: () => run(() => controls.reload()),
    zoomIn: () => run(() => controls.zoomIn()),
    zoomOut: () => run(() => controls.zoomOut()),
    resetZoom: () => run(() => controls.resetZoom()),
    close: () => run(() => controls.close()),
  };
}
