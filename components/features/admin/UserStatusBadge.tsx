"use client";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/useTranslation";

const STATUS_VARIANTS: Record<
  string,
  "success" | "destructive" | "secondary" | "warning" | "default"
> = {
  ACTIVE: "success",
  SUSPENDED: "destructive",
  INACTIVE: "secondary",
  PENDING_EMAIL_VERIFICATION: "warning",
};

type UserStatusBadgeProps = {
  readonly status: string;
};

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const { t } = useTranslation("visual");
  const variant = STATUS_VARIANTS[status] ?? "default";
  return (
    <Badge variant={variant}>
      {t(`status_${status}`, {
        defaultValue: status.replace(/_/g, " ").toLowerCase(),
      })}
    </Badge>
  );
}
