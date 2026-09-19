import { formatUsdMicros } from "./utils";

function isMetricValue(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value);
}

export function metricNumber(
  value: number | null | undefined,
  locale = "en",
  unavailable = "—",
) {
  return isMetricValue(value)
    ? new Intl.NumberFormat(locale).format(value)
    : unavailable;
}
export function metricPercent(
  value: number | null | undefined,
  unavailable = "—",
) {
  return isMetricValue(value) ? `${value.toFixed(2)}%` : unavailable;
}
export function metricCost(
  value: number | null | undefined,
  unavailable = "—",
) {
  return isMetricValue(value) ? formatUsdMicros(value) : unavailable;
}
