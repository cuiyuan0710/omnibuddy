import { useShellStore } from "@/stores/shell-store";
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const themes = [
  { value: "system", label: "跟随系统" },
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
] as const;

/** The menu selects the local preference; useTheme applies it to the document. */
export function ThemeMenuItems() {
  const theme = useShellStore((state) => state.theme);
  const setTheme = useShellStore((state) => state.setTheme);

  return (
    <DropdownMenuRadioGroup
      value={theme}
      onValueChange={(value: unknown) => {
        if (value === "system" || value === "light" || value === "dark") setTheme(value);
      }}
      aria-label="主题"
    >
      <DropdownMenuLabel>主题</DropdownMenuLabel>
      {themes.map(({ value, label }) => (
        <DropdownMenuRadioItem key={value} value={value} size="sm" indicatorSide="left" className="text-xs">
          {label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
