import { FolderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * 输入框上方的项目头部条。
 * 仅复刻桌面端的视觉与几何（-mb-4 压入输入框），项目选择逻辑尚未接入。
 */
export function NewChatProjectBar() {
  return (
    <header className="corner-squircle mx-6 -mb-4 rounded-t-[var(--prompt-header-radius)] bg-prompt-header px-2 pb-4">
      <div className="flex h-8 min-w-0 items-center">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          aria-label="选择项目"
          className="max-w-full gap-1.5 text-[13px] font-normal text-foreground transition-none hover:bg-input/50 dark:hover:bg-input/50 data-popup-open:bg-input/50"
        >
          <FolderIcon className="size-3.5" />
          <span className="flex h-full min-w-0 items-center leading-none">
            <span className="relative top-px truncate">选择项目</span>
          </span>
        </Button>
      </div>
    </header>
  );
}
