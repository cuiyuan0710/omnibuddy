import { Bot } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/** Agent UI remains independent from the host runtime integration. */
export function AgentWorkspacePanel() {
  return (
    <section aria-labelledby="agent-workspace-title" className="space-y-6">
      <div className="space-y-2">
        <h1 id="agent-workspace-title" className="text-xl font-semibold">Agent 工作区</h1>
        <p className="text-sm text-muted-foreground">在本地项目中与编码 Agent 协作。</p>
      </div>
      <Empty className="min-h-64 rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Bot aria-hidden="true" /></EmptyMedia>
          <EmptyTitle>Agent 运行时尚未接入</EmptyTitle>
          <EmptyDescription>工作区界面已保留，宿主运行时将在后续接入。</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  );
}
