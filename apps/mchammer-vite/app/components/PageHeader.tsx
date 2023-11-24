import type { HTMLAttributes } from "react";
import { Balancer } from "react-wrap-balancer";

import { cn } from "~/lib/utils.ts";

export function PageHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "flex max-w-[980px] flex-col items-start gap-2 px-4 pt-8 md:pt-12",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function PageHeaderHeading({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeaderDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Balancer
      className={cn(
        "max-w-[750px] text-lg text-muted-foreground sm:text-xl",
        className,
      )}
      {...props}
    />
  );
}
