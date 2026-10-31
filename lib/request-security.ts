export function isSameOrigin(request: Request): boolean {
  const value = request.headers.get("origin");
  if (!value) return false;
  try {
    const origin = new URL(value);
    const url = new URL(request.url);
    // Next.js can use an internal hostname in request.url. Host retains the
    // browser-facing hostname, including the port, through the hosting proxy.
    const host = request.headers.get("host") || url.host;
    return (
      (origin.protocol === "https:" || origin.protocol === "http:") &&
      origin.protocol === url.protocol &&
      origin.host === host.toLowerCase() &&
      !origin.username &&
      !origin.password
    );
  } catch {
    return false;
  }
}
