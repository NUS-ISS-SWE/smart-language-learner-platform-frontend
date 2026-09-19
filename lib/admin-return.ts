/** Only return to an internal admin user list or account, never a supplied URL. */
export function adminReturnTo(
  value: string | null,
  fallback = "/admin/users",
): string {
  return value && /^\/admin\/users(?:\/[1-9]\d*)?(?:\?[^#]*)?$/.test(value)
    ? value
    : fallback;
}
