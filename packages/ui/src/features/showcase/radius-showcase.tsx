import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Theme } from "@/stores/shell-store";
import { AppIcon } from "@/components/app/app-icon";
import { Button } from "@/components/ui/button";

const radiusGroups = [
  {
    id: "component",
    title: "组件圆角",
    description: "由基础半径 --radius 派生，用于按钮、卡片、弹窗等常规组件。",
    radii: [
      { name: "sm", className: "rounded-tl-sm", definition: "基础半径 − 4px" },
      { name: "md", className: "rounded-tl-md", definition: "基础半径 − 2px" },
      { name: "lg", className: "rounded-tl-lg", definition: "基础半径" },
      { name: "xl", className: "rounded-tl-xl", definition: "1.4 × 基础半径" },
      { name: "2xl", className: "rounded-tl-2xl", definition: "1.8 × 基础半径" },
      { name: "3xl", className: "rounded-tl-3xl", definition: "2.2 × 基础半径" },
      { name: "4xl", className: "rounded-tl-4xl", definition: "2.6 × 基础半径" },
    ],
  },
  {
    id: "layout",
    title: "布局圆角",
    description: "独立的 rem 尺寸，用于主区域和窗口分区，不随基础半径变化。",
    radii: [
      { name: "1rem", className: "rounded-tl-1rem", definition: "1rem" },
      { name: "1_5rem", className: "rounded-tl-1_5rem", definition: "1.5rem" },
      { name: "2rem", className: "rounded-tl-2rem", definition: "2rem" },
    ],
  },
] as const;

/** 预览主题圆角；像素值读取实际元素，展示状态仅由本组件持有。 */
export function RadiusShowcase({ theme }: { theme: Theme }) {
  const contentRef = useRef<HTMLElement>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const [radiusValues, setRadiusValues] = useState<Record<string, string>>({});
  const [copyFeedback, setCopyFeedback] = useState<{
    className: string;
    status: "copied" | "error";
  } | null>(null);

  useEffect(() => {
    const previews = contentRef.current?.querySelectorAll<HTMLElement>("[data-radius]");
    if (!previews) return;

    const values: Record<string, string> = {};
    for (const preview of previews) {
      const name = preview.dataset.radius;
      if (!name) continue;
      const radius = Number.parseFloat(getComputedStyle(preview).borderTopLeftRadius);
      values[name] = `${Number(radius.toFixed(2))}px`;
    }
    setRadiusValues(values);
  }, [theme]);

  useEffect(() => () => {
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
  }, []);

  async function copyClassName(className: string) {
    let status: "copied" | "error";
    try {
      await navigator.clipboard.writeText(`className="${className}"`);
      status = "copied";
    } catch {
      status = "error";
    }
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    setCopyFeedback({ className, status });
    copyTimeoutRef.current = window.setTimeout(() => setCopyFeedback(null), 2000);
  }

  return (
    <section ref={contentRef} aria-labelledby="radius-showcase-title" className="space-y-6 py-2">
      <div className="space-y-2">
        <h3 id="radius-showcase-title" className="text-sm font-medium">圆角规范</h3>
        <p className="text-sm text-muted-foreground">
          统一使用 styles.css 的圆角 token。示例只改变左上角，尺寸读取实际渲染值，背景和边框跟随主题。点击复制按钮可复制完整的 className 属性。
        </p>
      </div>

      {radiusGroups.map((group) => (
        <div key={group.id} className="space-y-4">
          <div className="space-y-1">
            <h4 id={`radius-group-${group.id}`} className="text-sm font-medium">{group.title}</h4>
            <p className="text-xs text-muted-foreground">{group.description}</p>
          </div>
          <ul aria-labelledby={`radius-group-${group.id}`} className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {group.radii.map((radius) => (
              <li key={radius.name} className="min-w-0 space-y-3">
                <p className="text-sm font-medium tabular-nums text-foreground">
                  {radiusValues[radius.name] || "读取中…"}
                </p>
                <div className="relative aspect-square w-full max-w-40 bg-sidebar">
                  <div
                    role="img"
                    aria-label={`${radius.className} 左上角圆角预览`}
                    data-radius={radius.name}
                    className={cn(
                      "absolute top-6 right-0 bottom-0 left-5 border border-border bg-background",
                      radius.className,
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <code className="min-w-0 flex-1 break-all text-xs text-foreground">
                      {`className="${radius.className}"`}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`复制 className="${radius.className}"`}
                      title={copyFeedback?.className === radius.className && copyFeedback.status === "copied" ? "已复制" : "复制 JSX 属性"}
                      onClick={() => void copyClassName(radius.className)}
                    >
                      <AppIcon
                        icon={copyFeedback?.className === radius.className && copyFeedback.status === "copied" ? Check : Copy}
                        aria-hidden="true"
                        className="size-3"
                      />
                    </Button>
                  </div>
                  <code className="block break-all text-xs text-muted-foreground">--radius-{radius.name}</code>
                  <p className="text-xs text-muted-foreground">{radius.definition}</p>
                  <p role="status" className="min-h-4 text-xs text-muted-foreground">
                    {copyFeedback?.className === radius.className
                      ? copyFeedback.status === "copied" ? "已复制" : "复制失败，请手动复制上方代码"
                      : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
