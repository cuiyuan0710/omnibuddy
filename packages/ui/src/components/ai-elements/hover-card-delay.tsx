"use client";

import {
  HoverCard as BaseHoverCard,
  HoverCardTrigger as BaseHoverCardTrigger,
} from "@/components/ui/hover-card";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";

type HoverCardDelay = {
  openDelay: number;
  closeDelay: number;
};

const HoverCardDelayContext = createContext<HoverCardDelay>({
  openDelay: 0,
  closeDelay: 0,
});

export type HoverCardProps = ComponentProps<typeof BaseHoverCard> & {
  openDelay?: number;
  closeDelay?: number;
};

/**
 * 将 AI Elements 的延迟配置保存在悬浮卡片范围内，供 Base UI 触发器读取。
 * @param props.openDelay 鼠标进入后打开卡片的等待时间，单位毫秒。
 * @param props.closeDelay 鼠标离开后关闭卡片的等待时间，单位毫秒。
 * @param props.children 卡片的触发器和内容。
 */
export const HoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  children,
  ...props
}: HoverCardProps) => (
  <HoverCardDelayContext.Provider value={{ openDelay, closeDelay }}>
    <BaseHoverCard {...props}>{children}</BaseHoverCard>
  </HoverCardDelayContext.Provider>
);

export type HoverCardTriggerProps = ComponentProps<typeof BaseHoverCardTrigger>;

/**
 * 将根组件的延迟配置映射到 Base UI PreviewCard.Trigger。
 * @param props.delay 此触发器单独指定的打开延迟，优先于根组件配置。
 * @param props.closeDelay 此触发器单独指定的关闭延迟，优先于根组件配置。
 */
export const HoverCardTrigger = ({
  delay,
  closeDelay,
  ...props
}: HoverCardTriggerProps) => {
  const defaults = useContext(HoverCardDelayContext);

  return (
    <BaseHoverCardTrigger
      delay={delay ?? defaults.openDelay}
      closeDelay={closeDelay ?? defaults.closeDelay}
      {...props}
    />
  );
};
