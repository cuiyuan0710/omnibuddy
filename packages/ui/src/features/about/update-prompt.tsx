import { useEffect, useState } from "react";
import type { AppUpdateState, AppUpdater } from "@omnibuddy/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function UpdatePrompt({ updater, appName }: { updater?: AppUpdater; appName: string }) {
  const [state, setState] = useState<AppUpdateState | null>(null);
  const [dismissedPrompt, setDismissedPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (!updater) return;
    let active = true;
    void updater.getState().then((next) => { if (active) setState(next); });
    const unsubscribe = updater.subscribe((next) => { if (active) setState(next); });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [updater]);

  if (!updater || !state) return null;
  const promptKey = `${state.phase}-${state.availableVersion ?? ""}`;
  const shouldPrompt = state.phase === "available" || state.phase === "downloaded";
  const open = shouldPrompt && promptKey !== dismissedPrompt;
  const downloaded = state.phase === "downloaded";

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>发现新版本</AlertDialogTitle>
          <AlertDialogDescription>
            {downloaded
              ? `${appName} ${state.availableVersion} 已下载完成，是否现在重启并安装？`
              : `${appName} ${state.availableVersion} 已发布。现在下载更新吗？`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDismissedPrompt(promptKey)}>
            稍后
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => void (downloaded ? updater.installUpdate() : updater.downloadUpdate())}>
            {downloaded ? "重启并安装" : "下载更新"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
