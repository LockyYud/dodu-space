const PLACEHOLDER_HOSTS = new Set(["example.com", "www.example.com"]);

export function isPlaceholderUrl(value?: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return PLACEHOLDER_HOSTS.has(url.hostname) || url.href === "https://x.com/";
  } catch {
    return true;
  }
}

export function isPlaceholderEmail(value?: string) {
  if (!value) return true;
  return value.endsWith("@example.com");
}
