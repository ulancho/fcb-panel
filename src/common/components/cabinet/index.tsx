import { AppBody } from '@/app/AppBody.tsx';
import { Header } from 'Common/components/appHeader';
import { Sidebar } from 'Common/components/sidebar';

export default function Cabinet() {
  return (
    <div className="flex flex-col min-h-screen bg-[#EDEEF3] pt-[65px]">
      <Header />
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col px-[25px] pt-6 h-[calc(100vh-80px)] overflow-hidden">
          <AppBody />
        </div>
      </div>
    </div>
  );
}
