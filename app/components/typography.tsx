import type { HTMLAttributes } from "react";

import { cn } from "#app/lib/utils.ts";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {}
export const H1 = ({ className, ...props }: HeadingProps) => (
  <h1
    {...props}
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
  />
);

export const H2 = ({ className, ...props }: HeadingProps) => (
  <h2
    {...props}
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      className,
    )}
  />
);

export const H3 = ({ className, ...props }: HeadingProps) => (
  <h3
    {...props}
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight",
      className,
    )}
  />
);

export const H4 = ({ className, ...props }: HeadingProps) => (
  <h4
    {...props}
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      className,
    )}
  />
);

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Paragraph = ({ className, ...props }: ParagraphProps) => (
  <p
    {...props}
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
  />
);

export const Lead = ({ className, ...props }: ParagraphProps) => (
  <p {...props} className={cn("text-xl text-muted-foreground", className)} />
);
