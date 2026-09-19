"use client";

import type { TextareaHTMLAttributes } from "react";
import { Textarea } from "./Textarea";
import { cn } from "@/lib/utils";

type Props = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> & { value: string; onValueChange: (value: string) => void };

/** A single title value with a wrapping, content-sized visual field. */
export function WrappingTitleInput({
  value,
  onValueChange,
  className,
  style,
  ...props
}: Props) {
  return (
    <Textarea
      {...props}
      rows={1}
      value={value}
      onChange={(event) =>
        onValueChange(event.target.value.replace(/\r?\n/g, " "))
      }
      style={{ fieldSizing: "content", ...style }}
      className={cn("block min-h-11 resize-none", className)}
    />
  );
}
