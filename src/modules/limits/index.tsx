import { useState } from 'react';

interface LimitEntry {
  id: string;
  operationType: string;
  dailyLimit: number;
  monthlyLimit: number;
  name: string;
}

const OPERATION_OPTIONS = [
  'SWIFT-перевод',
  'Конверсия между своими счетами',
  'Перевод клиенту банка',
  'Перевод по QR-коду',
  'Оплата услуг',
];

const REMOTE_IDENTIFICATION_LIMITS: LimitEntry[] = [
  {
    id: 'remote-swift',
    operationType: 'SWIFT-перевод',
    dailyLimit: 50000,
    monthlyLimit: 200000,
    name: '',
  },
  {
    id: 'remote-conversion',
    operationType: 'Конверсия между своими счетами',
    dailyLimit: 200000,
    monthlyLimit: 200000,
    name: '',
  },
  {
    id: 'remote-client-transfer',
    operationType: 'Перевод клиенту банка',
    dailyLimit: 10000,
    monthlyLimit: 100000,
    name: '',
  },
  {
    id: 'remote-qr',
    operationType: 'Перевод по QR-коду',
    dailyLimit: 30000,
    monthlyLimit: 50000,
    name: '',
  },
  {
    id: 'remote-services',
    operationType: 'Оплата услуг',
    dailyLimit: 200000,
    monthlyLimit: 200000,
    name: '',
  },
];

const FULL_ACCESS_LIMITS: LimitEntry[] = [
  {
    id: 'full-swift',
    operationType: 'SWIFT-перевод',
    dailyLimit: 150000,
    monthlyLimit: 200000,
    name: '',
  },
  {
    id: 'full-conversion',
    operationType: 'Конверсия между своими счетами',
    dailyLimit: 50000,
    monthlyLimit: 100000,
    name: '',
  },
  {
    id: 'full-client-transfer',
    operationType: 'Перевод клиенту банка',
    dailyLimit: 200000,
    monthlyLimit: 200000,
    name: '',
  },
  {
    id: 'full-qr',
    operationType: 'Перевод по QR-коду',
    dailyLimit: 100000,
    monthlyLimit: 1000000,
    name: '',
  },
  {
    id: 'full-services',
    operationType: 'Оплата услуг',
    dailyLimit: 1500000,
    monthlyLimit: 1500000,
    name: '',
  },
];

function LimitSection({
  title,
  limits,
  onChange,
}: {
  title: string;
  limits: LimitEntry[];
  onChange: (limits: LimitEntry[]) => void;
}) {
  function updateEntry(id: string, field: keyof LimitEntry, value: string) {
    const nextLimits = limits.map((entry) => {
      if (entry.id !== id) {
        return entry;
      }

      if (field === 'dailyLimit' || field === 'monthlyLimit') {
        return {
          ...entry,
          [field]: value === '' ? Number.NaN : Number(value),
        };
      }

      return {
        ...entry,
        [field]: value,
      };
    });

    onChange(nextLimits);
  }

  return (
    <section className="w-full overflow-x-auto px-2">
      <h2 className="text-lg font-semibold text-text-black">{title}</h2>

      <div className="flex flex-col gap-6 w-full border-b border border-border-secondary bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(200px,2fr)_repeat(3,minmax(120px,1fr))]">
          <span className="text-sm font-semibold uppercase text-text-gray">Тип операции</span>
          <span className="text-sm font-semibold uppercase text-text-gray">Лимит (сутки)</span>
          <span className="text-sm font-semibold uppercase text-text-gray">Лимит (месяц)</span>
          <span className="text-sm font-semibold uppercase text-text-gray">Название</span>
        </div>

        <div className="flex flex-col gap-3">
          {limits.map((limit) => (
            <div
              key={limit.id}
              className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(200px,2fr)_repeat(3,minmax(120px,1fr))]"
            >
              <select
                className="h-10 w-full rounded-md border border-border-secondary px-3 text-sm text-text-black"
                value={limit.operationType}
                onChange={(event) => updateEntry(limit.id, 'operationType', event.target.value)}
              >
                {OPERATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="h-10 w-full rounded-md border border-border-secondary px-3 text-sm text-text-black"
                value={Number.isNaN(limit.dailyLimit) ? '' : limit.dailyLimit}
                onChange={(event) => updateEntry(limit.id, 'dailyLimit', event.target.value)}
                min={0}
              />

              <input
                type="number"
                className="h-10 w-full rounded-md border border-border-secondary px-3 text-sm text-text-black"
                value={Number.isNaN(limit.monthlyLimit) ? '' : limit.monthlyLimit}
                onChange={(event) => updateEntry(limit.id, 'monthlyLimit', event.target.value)}
                min={0}
              />

              <input
                type="text"
                className="h-10 w-full rounded-md border border-border-secondary px-3 text-sm text-text-black"
                value={limit.name}
                onChange={(event) => updateEntry(limit.id, 'name', event.target.value)}
                placeholder="Название лимита"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Limits() {
  const [remoteLimits, setRemoteLimits] = useState<LimitEntry[]>(REMOTE_IDENTIFICATION_LIMITS);
  const [fullAccessLimits, setFullAccessLimits] = useState<LimitEntry[]>(FULL_ACCESS_LIMITS);

  return (
    <div className="mx-auto w-full h-full">
      <div className="flex h-full flex-col items-start gap-8">
        <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold leading-none text-text-black">Лимиты</h1>
        </header>

        <div className="w-full rounded-[10px] border border-border-primary overflow-x-auto bg-white p-3 lg:p-3">
          <LimitSection
            title="Лимиты – удалённая идентификация по фото"
            limits={remoteLimits}
            onChange={setRemoteLimits}
          />
          <LimitSection
            title="Лимиты – полный доступ"
            limits={fullAccessLimits}
            onChange={setFullAccessLimits}
          />
          <div className="mt-auto flex justify-end">
            <button
              type="button"
              className="flex h-11 min-w-[160px] items-center justify-center rounded-md bg-[#B50000] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#a10000]"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
