import { ListFilterPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { fetchTransactions, fetchStatuses } from 'Modules/transactions/api/transactionsApi.tsx';
import { PAGE_SIZE_OPTIONS } from 'Modules/transactions/constants';
import {
  formatAmount,
  formatDateTime,
  formatStatusLabel,
  formatString,
  getStatusAppearance,
  normalizeDateTimeFilterValue,
} from 'Modules/transactions/utils';

import type {
  FetchTransactionsParams,
  SortDirection,
  TransactionItem,
  StatusOption,
} from 'Modules/transactions/api/transactionsApi.tsx';

function StatusBadge({ status }: { status: string | null }) {
  const appearance = useMemo(() => getStatusAppearance(status), [status]);

  return (
    <div
      className={`inline-flex h-7 items-center justify-center rounded-[32px] border px-4 py-1 ${appearance.container}`}
    >
      <span className={`text-sm font-medium leading-none ${appearance.text}`}>
        {formatStatusLabel(status)}
      </span>
    </div>
  );
}

interface FiltersState {
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

function createInitialFiltersState(): FiltersState {
  return {
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
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  //поля фильтрации
  const [filters, setFilters] = useState<FiltersState>(() => createInitialFiltersState());
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(() =>
    createInitialFiltersState(),
  );

  const sortBy: FetchTransactionsParams['sortBy'] = 'id';
  const direction: SortDirection = 'desc';

  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function loadTransactions() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchTransactions({
          page,
          size: pageSize,
          sortBy,
          direction,
          status: appliedFilters.status,
          serviceName: appliedFilters.serviceName || null,
          creditAccount: appliedFilters.creditAccount || null,
          debitAccount: appliedFilters.debitAccount || null,
          transactionType: appliedFilters.transactionType || null,
          customerId: appliedFilters.customerId || null,
          deviceId: appliedFilters.deviceId || null,
          absId: appliedFilters.absId || null,
          startDate: normalizeDateTimeFilterValue(appliedFilters.startDate),
          endDate: normalizeDateTimeFilterValue(appliedFilters.endDate),
          signal: controller.signal,
        });

        if (!isActive) {
          return;
        }

        setTransactions(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setError('Не удалось загрузить список транзакций. Попробуйте обновить страницу.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadTransactions();

    async function loadStatuses() {
      const statuses = await fetchStatuses();
      setStatusOptions(statuses);
    }

    void loadStatuses();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [page, pageSize, appliedFilters, direction, sortBy]);

  function toggleFiltersVisibility() {
    setFiltersVisible((current) => !current);
  }

  function resetFilters() {
    const defaultFilters = createInitialFiltersState();
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(0);
  }

  function applyFilters() {
    setAppliedFilters({ ...filters });
    setPage(0);
  }

  const canGoPrevious = page > 0;
  const canGoNext = page + 1 < totalPages;
  const showingFrom = totalElements === 0 ? 0 : page * pageSize + 1;
  const showingTo = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="mx-auto h-full max-w-[100%]">
      <div className="flex h-full flex-col items-start gap-8">
        <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold leading-none text-text-black">Транзакции</h1>
          <button
            type="button"
            className="flex gap-2 w-full border rounded border-amber-950 px-4 py-2 transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer"
            onClick={toggleFiltersVisibility}
          >
            <ListFilterPlus className="w-4" />
            <p className="text-sm font-medium text-text-black">Фильтр</p>
          </button>
        </header>
        {filtersVisible && (
          <div className="w-full rounded-[10px] border border-border-primary bg-white p-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
              <div className="flex flex-wrap gap-4">
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">Статус</span>
                  <select
                    className="rounded-md border border-border-secondary px-3 py-2  text-sm text-text-black"
                    value={filters.status ?? ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        status: value === '' ? null : value,
                      }));
                    }}
                  >
                    <option value="">Все статусы</option>
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">
                    Название статуса
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.serviceName}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        serviceName: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">
                    Счет списания
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.creditAccount}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        creditAccount: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">
                    Счет пополнения
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.debitAccount}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        debitAccount: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">Транзакция</span>
                  <input
                    type="number"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.transactionType}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        transactionType: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">ID клиента</span>
                  <input
                    type="number"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.customerId}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        customerId: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">
                    ID устройства
                  </span>
                  <input
                    type="number"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.deviceId}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        deviceId: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">АБС ID</span>
                  <input
                    type="number"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.absId}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        absId: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">Дата от</span>
                  <input
                    type="datetime-local"
                    step="1"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.startDate}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        startDate: value,
                      }));
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-text-black">
                  <span className="text-xs font-semibold uppercase text-text-gray">Дата до</span>
                  <input
                    type="datetime-local"
                    step="1"
                    className="w-full rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.endDate}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFilters((current) => ({
                        ...current,
                        endDate: value,
                      }));
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-3.5">
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={resetFilters}
              >
                Сбросить
              </button>
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={applyFilters}
              >
                Применить
              </button>
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFiltersVisible(false);
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
        <div className="w-full rounded-[10px] border border-border-primary overflow-x-auto bg-white p-3 lg:p-3">
          <div className="w-full overflow-x-auto px-2">
            <div className="flex gap-6 py-3 border-b border-border-secondary">
              <div className="w-[120px] flex-shrink-0 text-sm font-semibold leading-none text-text-black">
                ID
              </div>
              <div className="w-[170px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Дата
              </div>
              <div className="w-[160px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Тип
              </div>
              <div className="w-[150px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Статус
              </div>
              <div className="w-[130px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Сумма
              </div>
              <div className="w-[170px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Счёт списания
              </div>
              <div className="w-[170px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Счёт зачисления
              </div>
              <div className="flex flex-1 flex-shrink-0 px-4 text-sm font-semibold leading-none text-text-black">
                Комментарий
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-10 text-sm text-text-gray">
                Загрузка...
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center justify-center py-10 text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && transactions.length === 0 && (
              <div className="flex items-center justify-center py-10 text-sm text-text-gray">
                Нет данных для отображения
              </div>
            )}

            {!loading &&
              !error &&
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-6 py-3">
                  <div className="w-[120px] flex-shrink-0 text-sm font-normal leading-none text-text-black">
                    {formatString(transaction.transactionID ?? transaction.id)}
                  </div>
                  <div className="w-[170px] flex-shrink-0 px-2 text-sm font-normal leading-none text-text-black">
                    {formatDateTime(transaction.transactionDate)}
                  </div>
                  <div className="w-[160px] flex-shrink-0 px-2 text-sm font-normal leading-none text-text-black">
                    {formatString(transaction.transactionType)}
                  </div>
                  <div className="w-[150px] flex-shrink-0 px-2">
                    <StatusBadge status={transaction.status} />
                  </div>
                  <div className="w-[130px] flex-shrink-0 px-2 text-sm font-normal leading-none text-text-black">
                    {formatAmount(transaction.sumN ?? transaction.sumV)}
                  </div>
                  <div className="w-[170px] flex-shrink-0 px-2 text-sm font-normal leading-none text-text-black">
                    {formatString(transaction.debitAccount)}
                  </div>
                  <div className="w-[170px] flex-shrink-0 px-2 text-sm font-normal leading-none text-text-black">
                    {formatString(transaction.creditAccount)}
                  </div>
                  <div className="flex flex-1 px-4 text-sm font-normal leading-none text-text-black">
                    {formatString(transaction.comment ?? transaction.serviceName)}
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-sm text-text-gray">
              <label className="flex items-center gap-2">
                <span>Показывать по:</span>
                <select
                  className="rounded-md border border-border-secondary px-2 py-1 text-sm text-text-black"
                  value={pageSize}
                  onChange={(event) => {
                    const newSize = Number.parseInt(event.target.value, 10);
                    setPageSize(newSize);
                    setPage(0);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <span>
                Показано {totalElements === 0 ? 0 : `${showingFrom}–${showingTo}`} из{' '}
                {totalElements}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-border-secondary px-3 py-1 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                disabled={!canGoPrevious || loading}
              >
                Назад
              </button>
              <span className="text-sm text-text-gray">
                Страница {totalPages === 0 ? 0 : page + 1} из {totalPages}
              </span>
              <button
                type="button"
                className="rounded-md border border-border-secondary px-3 py-1 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((current) => (canGoNext ? current + 1 : current))}
                disabled={!canGoNext || loading}
              >
                Вперёд
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
