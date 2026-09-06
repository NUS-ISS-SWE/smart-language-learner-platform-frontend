import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function MetricsDateControls({ from, to, earliestAllowedFrom, today, onDateChange, onSelectRange }: {
  readonly from: string;
  readonly to: string;
  readonly earliestAllowedFrom: string;
  readonly today: string;
  readonly onDateChange: (key: "from" | "to", value: string) => void;
  readonly onSelectRange: (days: number) => void;
}) {
  return <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
    <label className="grid gap-1.5 text-sm font-medium">From
      <Input type="date" value={from} min={earliestAllowedFrom} max={to} onChange={(event) => onDateChange("from", event.target.value)} />
    </label>
    <label className="grid gap-1.5 text-sm font-medium">To
      <Input type="date" value={to} min={from} max={today} onChange={(event) => onDateChange("to", event.target.value)} />
    </label>
    <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => onSelectRange(7)}>Last 7 days</Button><Button variant="outline" size="sm" onClick={() => onSelectRange(30)}>Last 30 days</Button></div>
  </div>;
}
