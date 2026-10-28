export interface ThemeColor {
  name: string;
  purpose: string;
  usage: string;
  preview: "background" | "text" | "border" | "ring" | "swatch";
  previewClasses: string;
}

interface ThemeColorGroup {
  id: string;
  title: string;
  colors: ThemeColor[];
}

/** 只记录颜色的用途与完整语义类名；实际颜色值由 styles.css 提供。 */
export const themeColorGroups: ThemeColorGroup[] = [
  {
    id: "surfaces",
    title: "页面与容器",
    colors: [
      {
        name: "background",
        purpose: "页面与内容区域的基础背景，搭配 text-foreground。",
        usage: "bg-background",
        preview: "background",
        previewClasses: "bg-background text-foreground",
      },
      {
        name: "foreground",
        purpose: "基础背景上的正文和标题文字。",
        usage: "text-foreground",
        preview: "text",
        previewClasses: "bg-background text-foreground",
      },
      {
        name: "card",
        purpose: "卡片背景，搭配 text-card-foreground。",
        usage: "bg-card",
        preview: "background",
        previewClasses: "bg-card text-card-foreground",
      },
      {
        name: "card-foreground",
        purpose: "卡片背景上的文字。",
        usage: "text-card-foreground",
        preview: "text",
        previewClasses: "bg-card text-card-foreground",
      },
      {
        name: "popover",
        purpose: "浮层背景，搭配 text-popover-foreground。",
        usage: "bg-popover",
        preview: "background",
        previewClasses: "bg-popover text-popover-foreground",
      },
      {
        name: "popover-foreground",
        purpose: "浮层背景上的文字。",
        usage: "text-popover-foreground",
        preview: "text",
        previewClasses: "bg-popover text-popover-foreground",
      },
    ],
  },
  {
    id: "interaction",
    title: "交互与辅助颜色",
    colors: [
      {
        name: "primary",
        purpose: "主操作和强调区域的背景，搭配 text-primary-foreground。",
        usage: "bg-primary",
        preview: "background",
        previewClasses: "bg-primary text-primary-foreground",
      },
      {
        name: "primary-foreground",
        purpose: "主色背景上的文字。",
        usage: "text-primary-foreground",
        preview: "text",
        previewClasses: "bg-primary text-primary-foreground",
      },
      {
        name: "secondary",
        purpose: "次级操作和区域的背景，搭配 text-secondary-foreground。",
        usage: "bg-secondary",
        preview: "background",
        previewClasses: "bg-secondary text-secondary-foreground",
      },
      {
        name: "secondary-foreground",
        purpose: "次级背景上的文字。",
        usage: "text-secondary-foreground",
        preview: "text",
        previewClasses: "bg-secondary text-secondary-foreground",
      },
      {
        name: "muted",
        purpose: "弱化区域的背景，搭配 text-muted-foreground。",
        usage: "bg-muted",
        preview: "background",
        previewClasses: "bg-muted text-muted-foreground",
      },
      {
        name: "muted-foreground",
        purpose: "说明、辅助信息和弱化文字。",
        usage: "text-muted-foreground",
        preview: "text",
        previewClasses: "bg-muted text-muted-foreground",
      },
      {
        name: "accent",
        purpose: "悬停或选中等交互区域的背景，搭配 text-accent-foreground。",
        usage: "bg-accent / hover:bg-accent",
        preview: "background",
        previewClasses: "bg-accent text-accent-foreground",
      },
      {
        name: "accent-foreground",
        purpose: "交互强调背景上的文字。",
        usage: "text-accent-foreground",
        preview: "text",
        previewClasses: "bg-accent text-accent-foreground",
      },
      {
        name: "destructive",
        purpose: "错误文字、危险操作和错误区域的颜色。",
        usage: "text-destructive / bg-destructive",
        preview: "text",
        previewClasses: "bg-background text-destructive",
      },
    ],
  },
  {
    id: "boundaries",
    title: "边框与焦点",
    colors: [
      {
        name: "border",
        purpose: "通用边框和分隔线颜色；border 设置边框宽度。",
        usage: "border border-border",
        preview: "border",
        previewClasses: "border-2 border-border bg-background text-foreground",
      },
      {
        name: "input",
        purpose: "输入区域的边框颜色。",
        usage: "border border-input",
        preview: "border",
        previewClasses: "border-2 border-input bg-background text-foreground",
      },
      {
        name: "ring",
        purpose: "焦点轮廓颜色；搭配 ring 宽度，在获得键盘焦点时使用。",
        usage: "focus-visible:ring-2 focus-visible:ring-ring",
        preview: "ring",
        previewClasses: "border-transparent bg-background text-foreground ring-2 ring-ring",
      },
    ],
  },
  {
    id: "sidebar",
    title: "侧栏颜色",
    colors: [
      {
        name: "sidebar",
        purpose: "侧栏背景，搭配 text-sidebar-foreground。",
        usage: "bg-sidebar",
        preview: "background",
        previewClasses: "bg-sidebar text-sidebar-foreground",
      },
      {
        name: "sidebar-foreground",
        purpose: "侧栏的默认文字。",
        usage: "text-sidebar-foreground",
        preview: "text",
        previewClasses: "bg-sidebar text-sidebar-foreground",
      },
      {
        name: "sidebar-primary",
        purpose: "侧栏主色区域的背景，搭配 text-sidebar-primary-foreground。",
        usage: "bg-sidebar-primary",
        preview: "background",
        previewClasses: "bg-sidebar-primary text-sidebar-primary-foreground",
      },
      {
        name: "sidebar-primary-foreground",
        purpose: "侧栏主色背景上的文字。",
        usage: "text-sidebar-primary-foreground",
        preview: "text",
        previewClasses: "bg-sidebar-primary text-sidebar-primary-foreground",
      },
      {
        name: "sidebar-accent",
        purpose: "侧栏悬停与选中区域的背景，搭配 text-sidebar-accent-foreground。",
        usage: "bg-sidebar-accent",
        preview: "background",
        previewClasses: "bg-sidebar-accent text-sidebar-accent-foreground",
      },
      {
        name: "sidebar-accent-foreground",
        purpose: "侧栏交互背景上的文字。",
        usage: "text-sidebar-accent-foreground",
        preview: "text",
        previewClasses: "bg-sidebar-accent text-sidebar-accent-foreground",
      },
      {
        name: "sidebar-border",
        purpose: "侧栏边框和分隔线颜色。",
        usage: "border border-sidebar-border",
        preview: "border",
        previewClasses: "border-2 border-sidebar-border bg-sidebar text-sidebar-foreground",
      },
      {
        name: "sidebar-ring",
        purpose: "侧栏中的焦点轮廓颜色。",
        usage: "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        preview: "ring",
        previewClasses: "border-transparent bg-sidebar text-sidebar-foreground ring-2 ring-sidebar-ring",
      },
    ],
  },
  {
    id: "charts",
    title: "图表颜色",
    colors: [
      {
        name: "chart-1",
        purpose: "图表第 1 个数据系列的颜色。",
        usage: "bg-chart-1 / fill-chart-1 / stroke-chart-1",
        preview: "swatch",
        previewClasses: "bg-chart-1",
      },
      {
        name: "chart-2",
        purpose: "图表第 2 个数据系列的颜色。",
        usage: "bg-chart-2 / fill-chart-2 / stroke-chart-2",
        preview: "swatch",
        previewClasses: "bg-chart-2",
      },
      {
        name: "chart-3",
        purpose: "图表第 3 个数据系列的颜色。",
        usage: "bg-chart-3 / fill-chart-3 / stroke-chart-3",
        preview: "swatch",
        previewClasses: "bg-chart-3",
      },
      {
        name: "chart-4",
        purpose: "图表第 4 个数据系列的颜色。",
        usage: "bg-chart-4 / fill-chart-4 / stroke-chart-4",
        preview: "swatch",
        previewClasses: "bg-chart-4",
      },
      {
        name: "chart-5",
        purpose: "图表第 5 个数据系列的颜色。",
        usage: "bg-chart-5 / fill-chart-5 / stroke-chart-5",
        preview: "swatch",
        previewClasses: "bg-chart-5",
      },
    ],
  },
];
