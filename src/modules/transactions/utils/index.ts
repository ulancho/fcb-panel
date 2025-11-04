export function formatStatusLabel(status: string | null): string {
  if (!status) {
    return 'Неизвестен';
  }

  return status
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getStatusAppearance(status: string | null) {
  const normalized = status?.toLowerCase() ?? '';

  if (
    normalized.includes('fail') ||
    normalized.includes('error') ||
    normalized.includes('cancel')
  ) {
    return {
      container: 'border-red-200 bg-red-50',
      text: 'text-red-700',
    };
  }

  if (
    normalized.includes('success') ||
    normalized.includes('complete') ||
    normalized.includes('finish')
  ) {
    return {
      container: 'border-emerald-200 bg-emerald-50',
      text: 'text-emerald-700',
    };
  }

  if (normalized.includes('pending') || normalized.includes('progress')) {
    return {
      container: 'border-amber-200 bg-amber-50',
      text: 'text-amber-700',
    };
  }

  return {
    container: 'border-slate-200 bg-slate-50',
    text: 'text-slate-600',
  };
}

export function formatDateTime(date: string | null): string {
  if (!date) {
    return '—';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }

  return parsed.toLocaleString('ru-RU');
}

export function formatAmount(amount: number | null): string {
  if (amount === null || amount === undefined) {
    return '—';
  }

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatString(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value);
}

export function normalizeDateTimeFilterValue(value: string): string | null {
  if (!value) {
    return null;
  }

  if (value.length === 16) {
    return `${value}:00`;
  }

  if (value.length >= 19) {
    return value.slice(0, 19);
  }

  return value;
}
