"use client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { metricNumber, metricPercent, metricCost } from "@/lib/metric-format";
import type { AgentMetrics } from "@/types/admin";

export function AgentMetricsTable({ agents }: { agents: AgentMetrics[] }) {
  const { t, i18n } = useTranslation("metrics");
  const n = (value: number | null | undefined) =>
    metricNumber(value, i18n.language, t("unavailable"));
  return (
    <article className="rounded-2xl border bg-card p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-primary">{t("agentTitle")}</h3>
      <p className="mb-5 mt-2 text-sm text-muted-foreground">
        {t("agentHint")}
      </p>
      <div
        role="region"
        aria-label={t("agentTitle")}
        tabIndex={0}
        className="overflow-x-auto"
      >
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              {[
                "agent",
                "attempts",
                "failed",
                "failureRate",
                "tokens",
                "cost",
              ].map((key) => (
                <th scope="col" key={key} className="px-3 pb-3 font-medium">
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.agent} className="border-b last:border-0">
                <th
                  scope="row"
                  className="px-3 text-left font-medium capitalize"
                >
                  {agent.agent}
                </th>
                <td className="px-3 tabular-nums">{n(agent.attempts)}</td>
                <td className="px-3 tabular-nums">{n(agent.failedAttempts)}</td>
                <td className="px-3 tabular-nums">
                  {metricPercent(agent.failurePercent, t("unavailable"))}
                </td>
                <td className="px-3 tabular-nums">{n(agent.aiTokensUsed)}</td>
                <td className="px-3 tabular-nums">
                  {metricCost(agent.estimatedAiCostMicros, t("unavailable"))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!agents.length && (
        <p className="py-6 text-sm text-muted-foreground">{t("noAgents")}</p>
      )}
    </article>
  );
}
