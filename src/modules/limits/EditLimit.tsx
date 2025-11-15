import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NotificationModal } from 'Common/components/notificationModal';
import {
  createTransactionLimit,
  fetchLimit,
  fetchTransactionTypes,
  type CreateLimitPayload,
  type LimitIdentificationType,
  type TransactionType,
} from 'Modules/limits/api/limitsApi.tsx';

interface FormState {
  transactionTypeId: string;
  name: string;
  amountPerDay: string;
  amountPerMonth: string;
  type: LimitIdentificationType;
}

const LIMIT_TYPE_OPTIONS: Array<{ value: LimitIdentificationType; label: string }> = [
  {
    value: 'FULL_IDENTIFICATION',
    label: 'Полная идентификация',
  },
  {
    value: 'ONLINE_IDENTIFICATION',
    label: 'Онлайн идентификация',
  },
];

export default function EditLimit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formState, setFormState] = useState<FormState | null>(null);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [redirectAfterNotification, setRedirectAfterNotification] = useState(false);

  useEffect(() => {
    const limitId = Number(id);

    if (!id || !Number.isFinite(limitId)) {
      setLoadError('Некорректный идентификатор лимита.');
      setIsLoading(false);
      return;
    }

    let isActive = true;

    async function loadLimit() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetchLimit(limitId);

        if (!isActive) {
          return;
        }

        setFormState({
          transactionTypeId: String(response.transactionType.id),
          name: response.name,
          amountPerDay: String(response.amountPerDay),
          amountPerMonth: String(response.amountPerMonth),
          type: response.type as LimitIdentificationType,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error('Failed to load limit for editing', error);
        setLoadError('Не удалось загрузить данные лимита. Попробуйте обновить страницу.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadLimit();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    let isActive = true;

    async function loadTransactionTypes() {
      setTypesLoading(true);
      setTypesError(null);

      try {
        const types = await fetchTransactionTypes();

        if (!isActive) {
          return;
        }

        setTransactionTypes(types);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error('Failed to load transaction types for editing', error);
        setTypesError('Не удалось загрузить типы операций. Попробуйте обновить страницу.');
      } finally {
        if (isActive) {
          setTypesLoading(false);
        }
      }
    }

    void loadTransactionTypes();

    return () => {
      isActive = false;
    };
  }, []);

  const isSubmitDisabled = useMemo(() => {
    if (!formState || isSubmitting || isLoading) {
      return true;
    }

    if (!formState.transactionTypeId || !formState.name.trim()) {
      return true;
    }

    const amountPerDay = Number(formState.amountPerDay);
    const amountPerMonth = Number(formState.amountPerMonth);

    if (!Number.isFinite(amountPerDay) || !Number.isFinite(amountPerMonth)) {
      return true;
    }

    if (amountPerDay < 0 || amountPerMonth < 0) {
      return true;
    }

    return false;
  }, [formState, isSubmitting, isLoading]);

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [field]: value,
      };
    });

    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState || !id) {
      return;
    }

    const limitId = Number(id);
    const transactionTypeId = Number(formState.transactionTypeId);
    const amountPerDay = Number(formState.amountPerDay);
    const amountPerMonth = Number(formState.amountPerMonth);

    if (!Number.isFinite(limitId)) {
      setSubmitError('Некорректный идентификатор лимита.');
      return;
    }

    if (!Number.isFinite(transactionTypeId)) {
      setSubmitError('Выберите тип операции.');
      return;
    }

    if (!Number.isFinite(amountPerDay) || !Number.isFinite(amountPerMonth)) {
      setSubmitError('Пожалуйста, введите корректные числовые значения лимитов.');
      return;
    }

    const payload: CreateLimitPayload = {
      transactionTypeId,
      name: formState.name.trim(),
      amountPerDay,
      amountPerMonth,
      type: formState.type,
    };

    setIsSubmitting(true);

    try {
      await createTransactionLimit(payload);
      setNotification({
        type: 'success',
        message: 'Лимит успешно обновлен.',
      });
      setRedirectAfterNotification(true);
    } catch (error) {
      console.error('Failed to update transaction limit', error);
      const responseMessage =
        axios.isAxiosError(error) &&
        typeof error.response?.data === 'object' &&
        error.response?.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : null;

      setSubmitError(responseMessage ?? 'Не удалось сохранить изменения. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);

    if (redirectAfterNotification && id) {
      navigate(`/limits/${id}`);
    }

    setRedirectAfterNotification(false);
  };

  return (
    <div className="mx-auto h-full w-full">
      {notification && (
        <NotificationModal
          type={notification.type}
          message={notification.message}
          onClose={handleCloseNotification}
        />
      )}
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
            <h1 className="text-2xl font-bold leading-none text-text-black">
              Редактирование лимита
            </h1>
          </div>
        </header>

        <div className="w-full max-w-3xl rounded-[10px] border border-border-primary bg-white p-6 shadow-sm">
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-sm text-text-gray">
              Загрузка...
            </div>
          )}

          {!isLoading && loadError && (
            <div className="flex items-center justify-center py-10 text-sm text-red-600">
              {loadError}
            </div>
          )}

          {!isLoading && !loadError && formState && (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Тип операции</span>
                  <select
                    value={formState.transactionTypeId}
                    onChange={(event) => handleFieldChange('transactionTypeId', event.target.value)}
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black focus:border-[#B50000] focus:outline-none focus:ring-2 focus:ring-[#B50000]/40 disabled:cursor-not-allowed disabled:bg-gray-100"
                    disabled={typesLoading}
                  >
                    <option value="" disabled>
                      {typesLoading ? 'Загрузка...' : 'Выберите тип операции'}
                    </option>
                    {transactionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {typesError && <p className="text-xs text-red-600">{typesError}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Название</span>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(event) => handleFieldChange('name', event.target.value)}
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black focus:border-[#B50000] focus:outline-none focus:ring-2 focus:ring-[#B50000]/40"
                    placeholder="Введите название лимита"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Лимит (сутки)</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.amountPerDay}
                    onChange={(event) => handleFieldChange('amountPerDay', event.target.value)}
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black focus:border-[#B50000] focus:outline-none focus:ring-2 focus:ring-[#B50000]/40"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-text-black">Лимит (месяц)</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.amountPerMonth}
                    onChange={(event) => handleFieldChange('amountPerMonth', event.target.value)}
                    className="w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-black focus:border-[#B50000] focus:outline-none focus:ring-2 focus:ring-[#B50000]/40"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-semibold text-text-black">Тип идентификации</span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {LIMIT_TYPE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-colors ${
                          formState.type === option.value
                            ? 'border-[#B50000] bg-[#B50000]/10'
                            : 'border-border-secondary hover:border-[#B50000]/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="limit-type"
                          value={option.value}
                          checked={formState.type === option.value}
                          onChange={(event) =>
                            handleFieldChange('type', event.target.value as LimitIdentificationType)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-text-black">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </label>
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(id ? `/limits/${id}` : '/limits')}
                  className="w-full rounded-lg border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full rounded-lg bg-[#B50000] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#990000] disabled:cursor-not-allowed disabled:bg-[#B50000]/60 sm:w-auto cursor-pointer"
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
