export function formatDate(dateValue) {
  // For legacy rows without createdAt, return empty string so UI can show nothing
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d)) return "Invalid date";
  return d.toLocaleDateString();
}

export function formatDateTime(dateValue) {
  // Return empty string for missing timestamps so older rows stay blank
  if (!dateValue) return "";
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
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d)) return "Invalid time";
  return d.toLocaleTimeString();
}

// Compare two objects (posts) descending by createdAt; fallback to id when missing
export function compareByCreatedAtDesc(a, b) {
  const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : null;
  const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : null;
  if (aTime !== null && bTime !== null) return bTime - aTime; // later first
  if (aTime !== null) return -1; // a has date -> a before b
  if (bTime !== null) return 1; // b has date -> b before a
  // both missing createdAt -> fallback to id descending
  return (b?.id || 0) - (a?.id || 0);
}

export function formatRelative(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d)) return "";
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  // fallback to readable date
  return d.toLocaleDateString();
}
