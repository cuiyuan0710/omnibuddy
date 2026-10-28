import { useEffect, useRef, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fontSizes = [
  { className: "text-xs", purpose: "辅助说明、时间、元数据" },
  { className: "text-sm", purpose: "菜单、表格、紧凑正文" },
  { className: "text-base", purpose: "常规正文、卡片标题" },
  { className: "text-lg", purpose: "小节标题、突出正文" },
  { className: "text-xl", purpose: "区域标题" },
  { className: "text-2xl", purpose: "页面标题" },
  { className: "text-3xl", purpose: "大标题、重点数值" },
] as const;

interface FontSizeMeasurement {
  fontSize: string;
  lineHeight: string;
}

/** 使用标准字号类预览，尺寸从实际渲染文字读取。 */
export function FontSizeShowcase() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState<Record<string, FontSizeMeasurement>>({});

  useEffect(() => {
    const previews = contentRef.current?.querySelectorAll<HTMLElement>("[data-font-size]");
    if (!previews) return;

    const values: Record<string, FontSizeMeasurement> = {};
    for (const preview of previews) {
      const className = preview.dataset.fontSize;
      if (!className) continue;
      const styles = getComputedStyle(preview);
      values[className] = { fontSize: styles.fontSize, lineHeight: styles.lineHeight };
    }
    setMeasurements(values);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle id="font-size-showcase-title" role="heading" aria-level={3}>
          常用文字大小
        </CardTitle>
        <CardDescription>
          使用 Tailwind 标准字号与默认行高。示例保持相同字体、字重和颜色，尺寸读取当前页面的实际值。
        </CardDescription>
      </CardHeader>
      <CardContent ref={contentRef}>
        <Table aria-labelledby="font-size-showcase-title">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">字号类名</TableHead>
              <TableHead scope="col">文字预览</TableHead>
              <TableHead scope="col">实际字号 / 行高</TableHead>
              <TableHead scope="col">参考用途</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fontSizes.map((size) => (
              <TableRow key={size.className}>
                <TableCell><code className="text-xs">{size.className}</code></TableCell>
                <TableCell className="min-w-48 whitespace-normal">
                  <p className={size.className} data-font-size={size.className}>
                    文字示例 Aa 123
                  </p>
                </TableCell>
                <TableCell>
                  {measurements[size.className]
                    ? `${measurements[size.className].fontSize} / ${measurements[size.className].lineHeight}`
                    : "读取中…"}
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {size.purpose}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
