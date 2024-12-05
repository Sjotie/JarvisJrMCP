export function getCurrentTime(args = {}) {
  const now = new Date();
  
  return {
    iso: now.toISOString(),
    local: now.toLocaleString(),
    unix: Math.floor(now.getTime() / 1000),
    utc: now.toUTCString()
  };
}
