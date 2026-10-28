import type { LucideIcon, LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

export type IconVariant = "monochrome" | "emphasis";

interface AppIconProps extends LucideProps {
  icon: LucideIcon;
  variant?: IconVariant;
}

/** Stateless UI variants shared by title-bar controls and the settings preview. */
export function AppIcon({
  icon: Icon,
  variant = "monochrome",
  className,
  strokeWidth = 1.5,
  ...props
}: AppIconProps) {
  return (
    <Icon
      data-slot="app-icon"
      data-variant={variant}
      strokeWidth={strokeWidth}
      className={cn("size-4 shrink-0", variant === "emphasis" && "text-foreground", className)}
      {...props}
    />
  );
}
