import { LogOut } from 'lucide-react';

export function Header() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <header className="w-full h-[54px] bg-[#F9F9F9] border-b border-[#D7D7D7] flex items-center px-10">
      <div className="ml-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#414141] hover:text-[#B50000] hover:bg-[#F0F0F0] rounded-lg transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          Выход
        </button>
      </div>
    </header>
  );
}
