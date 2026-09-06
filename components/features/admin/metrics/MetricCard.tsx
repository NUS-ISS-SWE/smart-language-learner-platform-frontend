import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const numberFormatter = new Intl.NumberFormat("en-US");

export function MetricCard({ label, value, description, icon: Icon }: {
  readonly label: string;
  readonly value: number;
  readonly description: string;
  readonly icon: LucideIcon;
}) {
  return <Card><CardContent className="flex items-start justify-between p-5"><div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-semibold tabular-nums">{numberFormatter.format(value)}</p>
    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
  </div><div className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></div></CardContent></Card>;
}
