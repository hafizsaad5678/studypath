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
    if (minOrAmount == null) return `${sym}${max.toLocaleString()}`;
    if (minOrAmount === max) return `${sym}${minOrAmount.toLocaleString()}`;
    return `${sym}${minOrAmount.toLocaleString()} – ${sym}${max.toLocaleString()}`;
  }

  return minOrAmount != null ? `${sym}${minOrAmount.toLocaleString()}` : 'N/A';
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

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return 'SP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

