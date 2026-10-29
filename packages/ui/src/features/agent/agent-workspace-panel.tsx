import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { NewChatProjectBar } from "./new-chat-project-bar";

/**
 * Agent 工作区空态：视觉沿用桌面端新对话页（空态文案 + 底部输入区）。
 * 提交与项目选择尚未接入运行时，这里只承载输入框样式。
 */
export function AgentWorkspacePanel({ appName }: { appName: string }) {
  return (
    <section
      aria-labelledby="agent-workspace-title"
      className="flex min-h-[calc(100svh-9rem)] flex-col"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10">
        <h2
          id="agent-workspace-title"
          className="text-4xl font-bold tracking-tight text-foreground"
        >
          {appName}, 我帮你
        </h2>
        <p className="text-sm text-muted-foreground">
          把想做的事写下来，剩下的交给我。
        </p>
      </div>
      <div className="shrink-0 pb-2">
        <div className="relative w-full">
          <NewChatProjectBar />
          <PromptInput
            className="relative w-full"
            maxFiles={0}
            onSubmit={() => undefined}
          >
            <PromptInputTextarea placeholder="今天帮你做些什么？" />
            <PromptInputFooter>
              <div className="ml-auto flex min-w-0 items-center gap-1">
                <PromptInputSubmit aria-label="发送消息" />
              </div>
            </PromptInputFooter>
          </PromptInput>
        </div>
        <p className="mt-3.5 w-full text-center text-xs text-muted-foreground">
          内容由 AI 生成，请核实重要消息
        </p>
      </div>
    </section>
  );
}
