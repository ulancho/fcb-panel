import { useState } from 'react';

import { STATUS_OPTIONS } from 'Modules/transactions/constants';
import { formatStatusLabel } from 'Modules/transactions/utils';
import { downloadBlobFile } from 'Modules/transactions/utils/downloadBlob';

import { downloadFile } from './api/reportsApi';

interface Filters {
  status: string | null;
  serviceName: string;
  creditAccount: string;
  debitAccount: string;
  transactionType: string;
  customerId: string;
  deviceId: string;
  absId: string;
  startDate: string;
  endDate: string;
}

const initialFilters: Filters = {
  status: null,
  serviceName: '',
  creditAccount: '',
  debitAccount: '',
  transactionType: '',
  customerId: '',
  deviceId: '',
  absId: '',
  startDate: '',
  endDate: '',
};

export default function Reports() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetFilters = () => {
    setFilters(initialFilters);
    setError(null);
  };

  const handleDownload = async (type: 'excel' | 'pdf') => {
    setLoading(true);
    setError(null);

    try {
      const blob = await downloadFile(type, {
        status: filters.status || undefined,
        serviceName: filters.serviceName || undefined,
        creditAccount: filters.creditAccount || undefined,
        debitAccount: filters.debitAccount || undefined,
        transactionType: filters.transactionType ? Number(filters.transactionType) : undefined,
        customerId: filters.customerId ? Number(filters.customerId) : undefined,
        deviceId: filters.deviceId ? Number(filters.deviceId) : undefined,
        absId: filters.absId ? Number(filters.absId) : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      downloadBlobFile(blob, type === 'excel' ? 'xlsx' : 'pdf');
    } catch (err) {
      setError('Ошибка при скачивании файла');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = [
    [
      { label: 'Статус', key: 'status', type: 'select' as const },
      { label: 'Название сервиса', key: 'serviceName', type: 'text' as const },
      { label: 'Счет списания', key: 'creditAccount', type: 'text' as const },
      { label: 'Счет пополнения', key: 'debitAccount', type: 'text' as const },
    ],
    [
      { label: 'Тип транзакции', key: 'transactionType', type: 'number' as const },
      { label: 'ID клиента', key: 'customerId', type: 'number' as const },
      { label: 'ID устройства', key: 'deviceId', type: 'number' as const },
      { label: 'АБС ID', key: 'absId', type: 'number' as const },
    ],
  ];

  return (
    <div className="w-full min-h-screen rounded-[10px] border border-border-primary bg-white p-6">
      <form>
        {filterGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.map(({ label, key, type }) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-semibold uppercase text-text-gray">{label}</span>

                {type === 'select' && key === 'status' ? (
                  <select
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.status ?? ''}
                    onChange={(e) => setFilters((c) => ({ ...c, status: e.target.value || null }))}
                  >
                    <option value="">Все статусы</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {formatStatusLabel(s)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={(filters as never)[key]}
                    onChange={(e) => setFilters((c) => ({ ...c, [key]: e.target.value }))}
                  />
                )}
              </label>
            ))}
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold uppercase text-text-gray">Дата от</span>
            <input
              type="datetime-local"
              step="1"
              className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.startDate}
              onChange={(e) => setFilters((c) => ({ ...c, startDate: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold uppercase text-text-gray">Дата до</span>
            <input
              type="datetime-local"
              step="1"
              className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.endDate}
              onChange={(e) => setFilters((c) => ({ ...c, endDate: e.target.value }))}
            />
          </label>

          <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-2 justify-end items-center">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black hover:bg-gray-100 transition-colors"
            >
              Сбросить
            </button>

            <button
              type="button"
              onClick={() => handleDownload('excel')}
              disabled={loading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Загрузка...' : 'Excel'}
            </button>

            <button
              type="button"
              onClick={() => handleDownload('pdf')}
              disabled={loading}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Загрузка...' : 'PDF'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
