export const MAXIMUM_METRICS_RANGE_DAYS = 366;

export function utcIsoDate(offsetDays = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function shiftIsoDate(value: string, offsetDays: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function isIsoDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Normalizes URL date parameters to the backend's inclusive 366-day limit. */
export function normalizeMetricsDateRange(fromValue: string | null, toValue: string | null, today = utcIsoDate()) {
  const to = isIsoDate(toValue) && toValue <= today ? toValue : today;
  const earliestAllowedFrom = shiftIsoDate(to, -(MAXIMUM_METRICS_RANGE_DAYS - 1));
  const requestedFrom = isIsoDate(fromValue) ? fromValue : shiftIsoDate(to, -29);
  const from = requestedFrom > to ? to : requestedFrom < earliestAllowedFrom ? earliestAllowedFrom : requestedFrom;
  return { from, to, earliestAllowedFrom };
}
