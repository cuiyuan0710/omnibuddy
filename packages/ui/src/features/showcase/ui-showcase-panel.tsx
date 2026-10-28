import { useEffect, useState } from "react";

import { themeColorGroups, type ThemeColor } from "@/lib/theme-colors";
import { cn } from "@/lib/utils";
import type { Theme } from "@/stores/shell-store";
import { FontSizeShowcase } from "./font-size-showcase";
import { IconShowcase } from "./icon-showcase";
import { RadiusShowcase } from "./radius-showcase";
import { SelectShowcase } from "./select-showcase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const colorCount = themeColorGroups.reduce((count, group) => count + group.colors.length, 0);

/** 展示标准主题的字号、图标、选择菜单、圆角与颜色；实际样式由当前 CSS 提供。 */
export function UiShowcasePanel({ theme }: { theme: Theme }) {
  const [colorValues, setColorValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // useTheme 在 layout effect 中应用主题，此处读取已生效的变量值。
    const styles = getComputedStyle(document.documentElement);
    const values = themeColorGroups.flatMap((group) => group.colors.map((color) => [
      color.name,
      styles.getPropertyValue(`--${color.name}`).trim(),
    ]));
    setColorValues(Object.fromEntries(values));
  }, [theme]);

  return (
    <section aria-labelledby="ui-showcase-title" className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="ui-showcase-title" className="text-base font-medium">UI 展示</h2>
          <Badge variant="outline">{theme === "dark" ? "深色主题" : "浅色主题"}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          常用文字大小、两类图标样式、选择菜单、圆角规范与 styles.css 中的 {colorCount} 个颜色 token。预览跟随主题切换。
        </p>
      </div>

      <FontSizeShowcase />

      <IconShowcase />

      <SelectShowcase />

      <RadiusShowcase theme={theme} />

      {themeColorGroups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle id={`color-group-${group.id}`} role="heading" aria-level={3}>
              {group.title}
            </CardTitle>
            <CardDescription>{group.colors.length} 个颜色 token</CardDescription>
          </CardHeader>
          <CardContent>
            <Table aria-labelledby={`color-group-${group.id}`}>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">颜色预览</TableHead>
                  <TableHead scope="col">Token 与当前值</TableHead>
                  <TableHead scope="col">使用方式</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.colors.map((color) => (
                  <TableRow key={color.name}>
                    <TableCell className="w-40">
                      <ColorPreview color={color} />
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="space-y-1">
                        <code className="block break-all text-xs">--color-{color.name}</code>
                        <code className="block break-all text-xs text-muted-foreground">
                          var(--{color.name})
                        </code>
                        <code className="block break-all text-xs text-muted-foreground">
                          {colorValues[color.name] || "读取中…"}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="space-y-2">
                        <code className="block break-all text-xs">{color.usage}</code>
                        <p className="text-xs text-muted-foreground">{color.purpose}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}


function ColorPreview({ color }: { color: ThemeColor }) {
  const labels = {
    background: "背景色",
    text: "文字色",
    border: "边框色",
    ring: "轮廓色",
    swatch: "色块",
  } as const;

  return (
    <div className="min-w-28 space-y-1 p-1">
      <div
        role="img"
        aria-label={`${color.name} ${labels[color.preview]}预览`}
        className={cn(
          "flex h-16 items-center justify-center rounded-md border px-2 text-sm",
          color.previewClasses,
        )}
      >
        {color.preview === "border" || color.preview === "ring"
          ? "边界示例"
          : color.preview !== "swatch" && "Aa 文字示例"}
      </div>
      <p className="text-xs text-muted-foreground">{labels[color.preview]}</p>
    </div>
  );
}
