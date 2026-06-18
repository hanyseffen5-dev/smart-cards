import React from "react";
import { cn } from "@/lib/utils";

type BilingualTextProps = {
  en: React.ReactNode;
  ar: React.ReactNode;
  className?: string;
  enClassName?: string;
  arClassName?: string;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3" | "label";
};

/** English primary text with a small Arabic subtitle underneath. */
export function BilingualText({
  en,
  ar,
  className,
  enClassName,
  arClassName,
  as: Tag = "div",
}: BilingualTextProps) {
  return (
    <Tag className={className}>
      <span className={cn("block", enClassName)}>{en}</span>
      {ar ? (
        <span className={cn("block text-[11px] text-muted-foreground leading-tight mt-0.5", arClassName)} dir="rtl">
          {ar}
        </span>
      ) : null}
    </Tag>
  );
}

export function PageTitle({ en, ar, className }: { en: string; ar: string; className?: string }) {
  return (
    <BilingualText
      as="h1"
      en={en}
      ar={ar}
      className={className}
      enClassName="text-2xl sm:text-3xl font-bold"
      arClassName="text-xs sm:text-sm mt-1"
    />
  );
}

export function SectionTitle({ en, ar, className }: { en: string; ar: string; className?: string }) {
  return (
    <BilingualText
      as="h2"
      en={en}
      ar={ar}
      className={className}
      enClassName="text-lg font-bold"
      arClassName="text-xs mt-0.5 font-normal"
    />
  );
}

export function StatLabel({ en, ar }: { en: string; ar: string }) {
  return (
    <BilingualText
      en={en}
      ar={ar}
      enClassName="text-xs font-medium"
      arClassName="text-[10px] mt-0.5"
    />
  );
}
