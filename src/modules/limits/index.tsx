import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchLimits, type TransactionLimit } from 'Modules/limits/api/limitsApi.tsx';
import { formatString } from 'Modules/transactions/utils';

export default function Limits() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limits, setLimits] = useState<TransactionLimit[]>([]);

  useEffect(() => {
    let isActive = true;

    async function loadTransactions() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchLimits();

        if (!isActive) {
          return;
        }

        setLimits(response);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError('Не удалось загрузить список лимитов. Попробуйте обновить страницу.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadTransactions();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="mx-auto h-full w-full">
      <div className="flex h-full flex-col items-start gap-8">
        <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold leading-none text-text-black">Лимиты</h1>
          <button
            type="button"
            className="flex gap-2 w-full border rounded border-amber-950 px-4 py-2 transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer"
            onClick={() => navigate('/limits/create')}
          >
            <span className="text-sm font-medium text-text-black">Создать</span>
          </button>
        </header>

        <div className="w-full rounded-[10px] border border-border-primary overflow-x-auto bg-white p-3 lg:p-3">
          <div className="w-full overflow-x-auto px-2">
            <div className="flex gap-6 py-3 border-b border-border-secondary">
              <div className="w-[80px] flex-shrink-0 text-sm font-semibold leading-none text-text-black">
                ID
              </div>
              <div className="w-[220px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Название
              </div>
              <div className="w-[160px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Лимит (сутки)
              </div>
              <div className="w-[150px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Лимит (месяц)
              </div>
              <div className="w-[150px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Тип
              </div>
              <div className="flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Тип операции
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

            {!loading && !error && limits.length === 0 && (
              <div className="flex items-center justify-center py-10 text-sm text-text-gray">
                Нет данных для отображения
              </div>
            )}

            {!loading &&
              !error &&
              limits.map((limit) => (
                <div key={limit.id} className="flex items-center gap-6 py-3">
                  <div className="w-[80px] flex-shrink-0 text-sm font-normal leading-none text-text-black">
                    {formatString(limit.id)}
                  </div>
                  <div className="w-[220px] flex-shrink-0 px-2 text-sm font-normal leading-none text-text-black">
                    {formatString(limit.name)}
                  </div>
                  <div className="w-[160px] flex-shrink-0 px-2 text-sm font-normal leading-none text-text-black">
                    {limit.amountPerDay}
                  </div>
                  <div className="w-[150px] flex-shrink-0 px-2">{limit.amountPerMonth}</div>
                  <div className="w-[150px] flex-shrink-0 px-2">
                    {limit.type === 'FULL_IDENTIFICATION' ? 'Полный доступ' : 'Онлайн доступ'}
                  </div>
                  <div className="flex-shrink-0 px-2">{limit.transactionType.name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
