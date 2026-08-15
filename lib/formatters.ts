// Shared formatting helpers for tuition, dates, and labels

export function formatTuition(
  minOrAmount: number | null | undefined,
  max?: number | null | undefined,
  currency?: string | null | undefined
): string {
  if (minOrAmount == null && max == null) return 'N/A';
  const sym =
    currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CAD' ? 'C$' : currency === 'USD' ? '$' : (currency ?? '');

  if (max !== undefined && max !== null) {
    if (minOrAmount == null) return `${sym}${max}`;
    if (minOrAmount === max) return `${sym}${minOrAmount}`;
    return `${sym}${minOrAmount} – ${sym}${max}`;
  }

  return minOrAmount != null ? `${sym}${minOrAmount}` : 'N/A';
}

export function daysUntil(dateStr: string | null | undefined): number {
  if (!dateStr) return 0;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function timeLeftLabel(deadline: string | null | undefined): string {
  if (!deadline) return '';
  const days = daysUntil(deadline);
  if (days < 0) return 'Deadline passed';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  if (days < 14) return `${days} days left`;
  if (days < 60) return `${Math.round(days / 7)} weeks left`;
  return `${Math.round(days / 30)} months left`;
}
