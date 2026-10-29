import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import type { AppInfo, AppUpdateState, UiRuntime } from "@omnibuddy/contracts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type AppInfoState =
  | { status: "loading" }
  | { status: "ready"; value: AppInfo }
  | { status: "error" };

export function AppInfoPanel({ runtime }: { runtime: UiRuntime }) {
  const [state, setState] = useState<AppInfoState>({ status: "loading" });
  const [retryCount, setRetryCount] = useState(0);
  const [updateState, setUpdateState] = useState<AppUpdateState | null>(null);

  useEffect(() => {
    let active = true;
    void runtime.getAppInfo().then(
      (value) => {
        if (active) setState({ status: "ready", value });
      },
      () => {
        if (active) setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [retryCount, runtime]);

  useEffect(() => {
    const updater = runtime.updater;
    if (!updater) return;
    let active = true;
    void updater.getState().then((value) => { if (active) setUpdateState(value); });
    const unsubscribe = updater.subscribe((value) => { if (active) setUpdateState(value); });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [runtime.updater]);

  return (
    <section aria-labelledby="app-info-title" className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle id="app-info-title" role="heading" aria-level={2}>应用信息</CardTitle>
        </CardHeader>
        <CardContent>
          {state.status === "loading" && (
            <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner aria-label="读取应用信息" />
              读取中...
            </div>
          )}
          {state.status === "error" && (
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertDescription>应用信息暂不可用</AlertDescription>
              </Alert>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setState({ status: "loading" });
                  setRetryCount((count) => count + 1);
                }}
              >
                <RefreshCw aria-hidden="true" />
                重试
              </Button>
            </div>
          )}
          {state.status === "ready" && (
            <Table aria-label="应用信息">
              <TableBody>
                <InfoRow label="名称" value={state.value.name} />
                <InfoRow label="版本" value={state.value.version} />
                <InfoRow label="平台" value={state.value.platform} />
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {state.status === "ready" && state.value.updateSupported && runtime.updater && updateState && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle role="heading" aria-level={3}>应用更新</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p role="status" className="text-sm text-muted-foreground">
              {updateStatusText(updateState)}
            </p>
            {updateState.phase === "downloading" && (
              <progress
                className="h-2 w-full accent-primary"
                aria-label="更新下载进度"
                max={100}
                value={updateState.percent ?? 0}
              />
            )}
            <div className="flex gap-2">
              {!["checking", "downloading", "downloaded"].includes(updateState.phase) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void runtime.updater?.checkForUpdates()}
                >
                  <RefreshCw aria-hidden="true" />
                  检查更新
                </Button>
              )}
              {updateState.phase === "available" && (
                <Button type="button" size="sm" onClick={() => void runtime.updater?.downloadUpdate()}>
                  下载更新
                </Button>
              )}
              {updateState.phase === "downloaded" && (
                <Button type="button" size="sm" onClick={() => void runtime.updater?.installUpdate()}>
                  重启并安装
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function updateStatusText(state: AppUpdateState): string {
  switch (state.phase) {
    case "idle": return "启动时会自动检查更新。";
    case "checking": return "正在检查更新…";
    case "available": return `发现新版本 ${state.availableVersion ?? ""}。`;
    case "downloading": return `正在下载更新 ${state.percent ?? 0}%`;
    case "downloaded": return `版本 ${state.availableVersion ?? ""} 已下载，重启后安装。`;
    case "not-available": return "当前已是最新版本。";
    case "error": return "检查或下载更新失败，请稍后重试。";
    case "unsupported": return "此安装方式暂不支持应用内更新。";
  }
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <TableRow>
      <TableCell className="w-24 text-muted-foreground">{label}</TableCell>
      <TableCell className="whitespace-normal break-words">{value}</TableCell>
    </TableRow>
  );
}
