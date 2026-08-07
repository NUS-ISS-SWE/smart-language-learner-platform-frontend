import { Badge } from "@/components/ui/Badge";

const STATUS_VARIANTS: Record<string, "success" | "destructive" | "secondary" | "warning" | "default"> = {
  ACTIVE: "success",
  SUSPENDED: "destructive",
  INACTIVE: "secondary",
  PENDING_EMAIL_VERIFICATION: "warning",
};

type UserStatusBadgeProps = {
  readonly status: string;
};

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] ?? "default";
  return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
}
