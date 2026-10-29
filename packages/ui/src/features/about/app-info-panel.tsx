import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import type { AppInfo, UiRuntime } from "@omnibuddy/contracts";
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
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <TableRow>
      <TableCell className="w-24 text-muted-foreground">{label}</TableCell>
      <TableCell className="whitespace-normal break-words">{value}</TableCell>
    </TableRow>
  );
}
