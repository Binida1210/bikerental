export function formatDate(dateValue) {
  if (!dateValue) return "Unknown date";
  const d = new Date(dateValue);
  if (isNaN(d)) return "Invalid date";
  return d.toLocaleDateString();
}

export function formatDateTime(dateValue) {
  if (!dateValue) return "Unknown date";
  const d = new Date(dateValue);
  if (isNaN(d)) return "Invalid date";
  return d.toLocaleString();
}

export function isRecent(dateValue, days = 7) {
  if (!dateValue) return false;
  const d = new Date(dateValue);
  if (isNaN(d)) return false;
  return d.getTime() > Date.now() - days * 24 * 60 * 60 * 1000;
}

export function formatTime(dateValue) {
  if (!dateValue) return "Unknown time";
  const d = new Date(dateValue);
  if (isNaN(d)) return "Invalid time";
  return d.toLocaleTimeString();
}
