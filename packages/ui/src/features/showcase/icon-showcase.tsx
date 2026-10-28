import { PanelLeft } from "lucide-react";

import { AppIcon } from "@/components/app/app-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Each icon style has one example with matching icon and text colors. */
export function IconShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle id="muted-icon-title" role="heading" aria-level={3}>
            普通图标
          </CardTitle>
          <CardDescription>
            图标与辅助文字同色，视觉更柔和，适合标题栏、窗口控制和次要操作。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AppIcon icon={PanelLeft} variant="monochrome" aria-hidden="true" />
            <span>切换侧栏</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle id="emphasis-icon-title" role="heading" aria-level={3}>
            强调图标
          </CardTitle>
          <CardDescription>
            图标与正文同色，对比更明显，适合需要突出显示的入口和操作。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-foreground">
            <AppIcon icon={PanelLeft} variant="emphasis" aria-hidden="true" />
            <span>切换侧栏</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
