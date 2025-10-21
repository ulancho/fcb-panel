import { LayoutDashboard, FileEdit } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from 'Common/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  active?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Главная страница',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '',
  },
  {
    id: 'registration',
    label: 'Регистрация клиента',
    icon: <FileEdit className="w-5 h-5" />,
    path: 'client/registration',
    active: true,
  },
];

export function Sidebar() {
  return (
    <div className="w-[268px] min-h-screen bg-[#fff] flex flex-col pt-5 pb-3">
      <nav className="flex flex-col gap-7 px-0">
        {menuItems.map((item) => (
          <Link key={item.id} to={item.path} prefetch="intent">
            <div
              className={cn(
                'flex items-center h-[42px] py-2 gap-7 relative cursor-pointer',
                item.active && 'bg-[rgba(155,37,37,0.10)]',
              )}
            >
              <div className={cn('w-1 h-5', item.active ? 'bg-[#B50000]' : 'bg-[transparent]')} />
              <div className={cn('flex items-center gap-2 flex-1', !item.active && 'opacity-50')}>
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6',
                    item.active ? 'text-[#B50000]' : 'text-[#5F5F5F]',
                  )}
                >
                  {item.icon}
                </div>
                <div
                  className={cn(
                    'text[14px] font-normal fon leading-[100%] w-[180px]',
                    item.active ? 'text-[#B50000]' : 'text-[#414141]',
                  )}
                >
                  {item.label}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
