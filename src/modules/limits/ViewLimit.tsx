import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  deleteTransactionLimit,
  fetchLimit,
  type TransactionLimit,
} from 'Modules/limits/api/limitsApi.tsx';

const LIMIT_TYPE_LABELS: Record<string, string> = {
  FULL_IDENTIFICATION: 'Полная идентификация',
  ONLINE_IDENTIFICATION: 'Онлайн идентификация',
};

export default function ViewLimit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [limit, setLimit] = useState<TransactionLimit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Идентификатор лимита не найден.');
      return;
    }

    let isMounted = true;

    async function loadLimit(limitId: number) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchLimit(limitId);

        if (!isMounted) {
          return;
        }

        setLimit(response);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load limit', loadError);
        setError('Не удалось загрузить лимит. Попробуйте обновить страницу.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const limitId = Number(id);

    if (!Number.isFinite(limitId)) {
      setError('Некорректный идентификатор лимита.');
      return;
    }

    void loadLimit(limitId);

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!limit) {
      return;
    }

    const shouldDelete = window.confirm('Вы уверены, что хотите удалить лимит?');

    if (!shouldDelete) {
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      await deleteTransactionLimit(limit.id);
      navigate('/limits');
    } catch (deleteError) {
      console.error('Failed to delete limit', deleteError);
      setError('Не удалось удалить лимит. Попробуйте позже.');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="mx-auto h-full w-full">
      <div className="flex h-full flex-col items-start gap-8">
        <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-primary text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
            >
              <span className="sr-only">Назад</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold leading-none text-text-black">Просмотр лимита</h1>
          </div>
          {limit && (
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => navigate(`/limits/${limit.id}/edit`)}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#00439d] border border-border-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-[#05387d] cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Редактировать
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex cursor-pointer h-10 items-center gap-2 rounded-lg bg-[#B50000] px-4 text-sm font-medium text-white transition-colors hover:bg-[#990000] disabled:cursor-not-allowed disabled:bg-[#B50000]/60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                {deleteLoading ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          )}
        </header>

        <div className="w-full max-w-3xl rounded-[10px] border border-border-primary bg-white p-6 shadow-sm">
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

          {!loading && !error && limit && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Тип операции</span>
                  <input
                    type="text"
                    value={limit.transactionType.name}
                    readOnly
                    disabled
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Название</span>
                  <input
                    type="text"
                    value={limit.name}
                    readOnly
                    disabled
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Лимит (сутки)</span>
                  <input
                    type="number"
                    value={limit.amountPerDay}
                    readOnly
                    disabled
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Лимит (месяц)</span>
                  <input
                    type="number"
                    value={limit.amountPerMonth}
                    readOnly
                    disabled
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-semibold text-text-black">Тип идентификации</span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(LIMIT_TYPE_LABELS).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex cursor-not-allowed items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-colors ${
                          limit.type === value
                            ? 'border-[#B50000] bg-[#B50000]/10'
                            : 'border-border-secondary'
                        }`}
                      >
                        <input
                          type="radio"
                          name="limit-type"
                          value={value}
                          checked={limit.type === value}
                          readOnly
                          disabled
                          className="h-4 w-4"
                        />
                        <span className="text-text-black">{label}</span>
                      </label>
                    ))}
                  </div>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/limits')}
                  className="w-full rounded-lg border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
