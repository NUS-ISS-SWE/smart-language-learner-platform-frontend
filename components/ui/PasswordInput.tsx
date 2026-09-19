"use client";
import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function PasswordInput({
  className,
  disabled,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation("auth");
  return (
    <div className="relative">
      <Input
        {...props}
        disabled={disabled}
        type={visible ? "text" : "password"}
        className={cn("pr-12", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className="absolute right-0 top-0"
        aria-label={t(visible ? "hidePassword" : "showPassword")}
        aria-pressed={visible}
        aria-controls={props.id}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
