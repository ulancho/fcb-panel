type Status = 'in-progress' | 'active' | 'cancelled';

interface ServiceRow {
  name: string;
  provider: string;
  code: string;
  account: string;
  status: Status;
  group: string;
}

const mockData: ServiceRow[] = [
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'in-progress',
    group: 'Платежи',
  },
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'in-progress',
    group: 'Платежи',
  },
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'active',
    group: 'Платежи',
  },
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'cancelled',
    group: 'Платежи',
  },
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'active',
    group: 'Платежи',
  },
  {
    name: 'Перевод на кар��у',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'active',
    group: 'Платежи',
  },
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'active',
    group: 'Платежи',
  },
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'active',
    group: 'Платежи',
  },
  {
    name: 'Перевод на карту',
    provider: 'Элкарт',
    code: '324',
    account: '1234',
    status: 'active',
    group: 'Платежи',
  },
];

const StatusBadge = ({ status }: { status: Status }) => {
  const statusConfig = {
    'in-progress': {
      text: 'В работе',
      className: 'bg-status-orange-bg border-status-orange-border text-status-orange-text',
    },
    active: {
      text: 'Активен',
      className: 'bg-status-green-bg border-status-green-border text-status-green',
    },
    cancelled: {
      text: 'Отменен',
      className: 'bg-status-red-bg border-status-red-border text-status-red',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="inline-flex h-7 items-center justify-center rounded-[32px] border px-4 py-1">
      <span className={`text-sm font-normal leading-none ${config.className}`}>{config.text}</span>
    </div>
  );
};

export default function Transactions() {
  return (
    <div className="mx-auto h-full">
      <div className="flex flex-col items-start gap-8 h-full">
        <header>
          <h1 className="text-2xl font-bold leading-none text-text-black">Транзакции</h1>
        </header>
        <div className="bg-white p-3 lg:p-3 w-full rounded-[10px] border border-border-primary bg-background-gray h-full">
          <div className="w-full overflow-x-auto px-2">
            <div className="min-w-[800px]">
              <div className="flex items-center gap-6 border-b border-border-secondary py-3">
                <div className="w-[164px] text-sm font-semibold leading-none text-text-black">
                  Наименование
                </div>
                <div className="w-[180px] px-2 text-sm font-semibold leading-none text-text-black">
                  Провайдер
                </div>
                <div className="w-[175px] px-2 text-sm font-semibold leading-none text-text-black">
                  Код
                </div>
                <div className="w-[158px] px-2 text-sm font-semibold leading-none text-text-black">
                  Счёт
                </div>
                <div className="w-[140px] px-2 text-sm font-semibold leading-none text-text-black">
                  Статус
                </div>
                <div className="flex-1 px-4 text-sm font-semibold leading-none text-text-black">
                  Группа
                </div>
              </div>

              {mockData.map((row, index) => (
                <div key={index}>
                  <div className="flex items-center gap-6 py-3">
                    <div className="w-[164px] text-sm font-normal leading-none text-text-black">
                      {row.name}
                    </div>
                    <div className="w-[180px] px-2 text-sm font-normal leading-none text-text-black">
                      {row.provider}
                    </div>
                    <div className="w-[175px] px-2 text-sm font-normal leading-none text-text-black">
                      {row.code}
                    </div>
                    <div className="w-[158px] px-2 text-sm font-normal leading-none text-text-black">
                      {row.account}
                    </div>
                    <div className="w-[140px] px-2">
                      <StatusBadge status={row.status} />
                    </div>
                    <div className="flex flex-1 items-center gap-1 px-4">
                      <button className="rounded-[32px] px-3 py-2.5 text-sm font-normal leading-none text-text-black hover:bg-gray-100 transition-colors">
                        {row.group}
                      </button>
                    </div>
                  </div>
                  {index < mockData.length - 1 && (
                    <div className="h-px w-full bg-border-secondary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
