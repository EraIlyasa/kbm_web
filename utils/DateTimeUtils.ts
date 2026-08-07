/** Returns a `YYYY-MM-DD-HH:MM` stamp used to build unique captions/titles. */
export function todayStamp(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
  return `${dateStr}-${timeStr}`;
}
