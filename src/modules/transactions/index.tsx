type TabType = 'services' | 'operations' | 'quick-transfers';

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

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex h-[46px] w-full min-w-[150px] flex-1 items-center justify-center border-b-[1.5px] bg-white px-4 py-2 sm:w-[206px] ${
        active ? 'border-border-primary-red' : 'border-border-6'
      }`}
    >
      <span
        className={`text-sm font-semibold leading-none ${
          active ? 'text-[#B52F27]' : 'text-text-black'
        }`}
      >
        {children}
      </span>
    </button>
  );
};

export default function Transactions() {
  // const [activeTab, setActiveTab] = useState<TabType>('services');

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start gap-4">
          <header>
            <h1 className="text-2xl font-bold leading-none text-text-black">Транзакции</h1>
          </header>
          <div className="min-h-screen bg-white p-4 sm:p-6 md:p-12 lg:p-16 w-full rounded-[10px] border border-border-primary bg-background-gray"></div>
        </div>
      </div>
    </div>
  );
}
