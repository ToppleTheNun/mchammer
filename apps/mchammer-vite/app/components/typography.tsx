import type { HTMLAttributes } from "react";

import { cn } from "~/lib/utils.ts";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {}
export function H1({ className, ...props }: HeadingProps) {
  return (
    <h1
      {...props}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
    />
  );
}

export function H2({ className, ...props }: HeadingProps) {
  return (
    <h2
      {...props}
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className,
      )}
    />
  );
}

export function H3({ className, ...props }: HeadingProps) {
  return (
    <h3
      {...props}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    />
  );
}

export function H4({ className, ...props }: HeadingProps) {
  return (
    <h4
      {...props}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    />
  );
}

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {}

export function Paragraph({ className, ...props }: ParagraphProps) {
  return (
    <p
      {...props}
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    />
  );
}

export function Lead({ className, ...props }: ParagraphProps) {
  return <p {...props} className={cn("text-xl text-muted-foreground", className)} />;
}
