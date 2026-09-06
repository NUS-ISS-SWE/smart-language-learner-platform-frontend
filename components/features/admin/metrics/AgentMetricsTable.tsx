import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatUsdMicros } from "@/lib/utils";
import type { AgentMetrics } from "@/types/admin";

const numberFormatter = new Intl.NumberFormat("en-US");

export function AgentMetricsTable({ agents }: { readonly agents: AgentMetrics[] }) {
  return <Card><CardHeader><CardTitle className="text-base">Agent reliability and cost</CardTitle><p className="text-sm text-muted-foreground">Provider attempts and usage for the selected period.</p></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b text-muted-foreground"><tr><th className="pb-2 font-medium">Agent</th><th className="pb-2 font-medium">Attempts</th><th className="pb-2 font-medium">Failed</th><th className="pb-2 font-medium">Failure rate</th><th className="pb-2 font-medium">Tokens</th><th className="pb-2 font-medium">Estimated cost</th></tr></thead><tbody>{agents.map((agent) => <tr key={agent.agent} className="border-b last:border-0"><td className="py-2 capitalize">{agent.agent}</td><td>{numberFormatter.format(agent.attempts)}</td><td>{numberFormatter.format(agent.failedAttempts)}</td><td>{agent.failurePercent == null ? "—" : `${agent.failurePercent.toFixed(2)}%`}</td><td>{numberFormatter.format(agent.aiTokensUsed)}</td><td>{formatUsdMicros(agent.estimatedAiCostMicros)}</td></tr>)}</tbody></table>{agents.length === 0 && <p className="text-sm text-muted-foreground">No agent calls were recorded for this period.</p>}</CardContent></Card>;
}
