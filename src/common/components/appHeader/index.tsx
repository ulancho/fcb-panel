import { LogOut } from 'lucide-react';

import { useCustomerStore, useLoginStore } from 'Common/stores/rootStore.tsx';

export function Header() {
  const loginStore = useLoginStore();
  const customerStore = useCustomerStore();
  const handleLogout = () => {
    customerStore.clearError();
    customerStore.clearCustomer();
    void loginStore.logout();
  };

  return (
    <header className="w-full h-[59px] bg-[#fff] border-b border-[#D7D7D7] flex items-center px-10">
      <div className="mr-auto flex gap-2.5 items-center">
        <img src="/src/assets/logo.svg" alt="logo" />
        <p>ФинансКредитБанк</p>
      </div>
      <div className="ml-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#414141] hover:text-[#B50000] hover:bg-[#F0F0F0] rounded-lg transition-colors cursor-pointer"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
