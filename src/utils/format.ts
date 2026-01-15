export function formatNiceDate(d?: Date | null) {
  return d
    ? d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
}

export function formatNiceTime(d?: Date | null) {
  return d
    ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : '';
}
