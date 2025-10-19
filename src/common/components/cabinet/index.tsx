import { Header } from 'Common/components/appHeader';
import { AppBody } from 'Common/components/cabinet/AppBody.tsx';
import { Sidebar } from 'Common/components/sidebar';

export default function Cabinet() {
  return (
    <div className="flex flex-col min-h-screen bg-[#EDEEF3]">
      <Header />
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 px-4 py-8">
            <AppBody />
          </div>
        </div>
      </div>
    </div>
  );
}
