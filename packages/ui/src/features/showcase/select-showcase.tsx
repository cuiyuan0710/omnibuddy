import { ViewMenuItems } from "@/components/app/view-menu-items";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const selectOptions = [
  { value: "conversation", label: "会话" },
  { value: "provider", label: "模型配置" },
  { value: "about", label: "应用信息" },
  { value: "unavailable", label: "暂不可用", disabled: true },
];

/** 复用视图菜单与标准 Select；选择框的示例值由 Select 自身管理。 */
export function SelectShowcase() {
  return (
    <section aria-labelledby="select-showcase-title" className="space-y-4 py-2">
      <div className="space-y-2">
        <h3 id="select-showcase-title" className="text-sm font-medium">选择菜单</h3>
        <p className="text-sm text-muted-foreground">
          菜单项高度为 28px。展开查看选中、悬停与禁用样式；视图菜单中的主题选择会应用到当前界面。
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <div className="space-y-2">
          <p id="view-menu-showcase-label" className="text-xs text-muted-foreground">视图菜单</p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  aria-describedby="view-menu-showcase-label"
                  className="rounded-lg text-[13px] text-muted-foreground transition-none focus-visible:text-foreground"
                />
              }
            >
              视图
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" animated={false} className="min-w-48 text-xs">
              <ViewMenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-2">
          <p id="select-showcase-label" className="text-xs text-muted-foreground">Select 选择框</p>
          <Select items={selectOptions} defaultValue="conversation">
            <SelectTrigger size="sm" aria-labelledby="select-showcase-label" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              <SelectGroup>
                {selectOptions.map(({ value, label, disabled }) => (
                  <SelectItem key={value} value={value} disabled={disabled} size="sm">
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
