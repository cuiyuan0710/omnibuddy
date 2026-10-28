import { Sparkles } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/** 能力中心入口的页面壳；真实能力列表接入后替换准备中的状态。 */
export function CapabilityCenterPanel() {
  return (
    <section aria-labelledby="capability-center-title" className="space-y-6">
      <div className="space-y-2">
        <h1 id="capability-center-title" className="text-xl font-semibold">能力中心</h1>
        <p className="text-sm text-muted-foreground">统一查看和管理技能、插件与 MCP。</p>
      </div>
      <Empty className="min-h-64 rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Sparkles aria-hidden="true" /></EmptyMedia>
          <EmptyTitle>能力中心准备中</EmptyTitle>
          <EmptyDescription>技能、插件与 MCP 管理功能将在这里开放。</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  );
}
