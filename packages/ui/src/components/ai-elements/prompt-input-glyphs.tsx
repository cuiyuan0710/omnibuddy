import type { ComponentProps } from "react";

/** Reuses the Desktop prompt's filled send and stop icons. */
export const PromptSendGlyph = ({ className, ...props }: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 21"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 0.5 23.5 20.5 12 18.5 0.5 20.5Z"
      fill="currentColor"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  </svg>
);

export const PromptStopGlyph = ({ className, ...props }: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect fill="currentColor" height={17} rx={3} width={17} x={0.5} y={0.5} />
  </svg>
);
