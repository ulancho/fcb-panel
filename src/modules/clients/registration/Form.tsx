import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';

import { useCustomerStore } from 'Common/stores/rootStore.tsx';

import type { CustomerResponse } from 'Modules/clients/registration/api/customerApi.ts';

type FormDataState = {
  residencyStatus: string;
  firstName: string;
  inn: string;
  lastName: string;
  phone: string;
  patronymic: string;
  email: string;
  birthDate: string;
};

const DEFAULT_FORM_DATA: FormDataState = {
  residencyStatus: 'Резидент/не резидент',
  firstName: '',
  inn: '',
  lastName: '',
  phone: '',
  patronymic: '',
  email: '',
  birthDate: '',
};

const mapCustomerToFormData = (customer: CustomerResponse | null): Partial<FormDataState> => ({
  firstName: customer?.name ?? '',
  inn: customer?.inn ?? '',
  lastName: customer?.surname ?? '',
  phone: customer?.phoneNumber ?? '',
  patronymic: customer?.patronymic ?? '',
  email: customer?.email ?? '',
});

const Form = observer(() => {
  const customerStore = useCustomerStore();
  const customer = customerStore.customer;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormDataState>(() => ({
    ...DEFAULT_FORM_DATA,
    ...mapCustomerToFormData(customer),
  }));

  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        ...mapCustomerToFormData(customer),
      }));
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await customerStore.registerCustomer(formData.email, formData.phone);
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Failed to register customer', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const AttachmentIcon = () => (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M12.0186 8.34418V2.88405C12.7909 3.1757 13.4924 3.62819 14.0766 4.21151L16.9853 7.12191C17.5693 7.7054 18.0221 8.40671 18.3136 9.17907H12.8535C12.3926 9.17907 12.0186 8.8042 12.0186 8.34418ZM13.0789 18.7635C12.7428 19.0995 12.4761 19.4984 12.2942 19.9375C12.1123 20.3766 12.0186 20.8472 12.0186 21.3224V22.5372H13.2334C14.1935 22.5372 15.1135 22.1557 15.7923 21.4769L21.4753 15.7938C21.8187 15.4307 22.0068 14.948 21.9998 14.4483C21.9928 13.9486 21.7912 13.4713 21.4378 13.118C21.0844 12.7646 20.6072 12.563 20.1075 12.556C19.6078 12.549 19.1251 12.7371 18.762 13.0805L13.0789 18.7635ZM10.3488 21.3224C10.3488 19.9098 10.899 18.5815 11.8975 17.583L17.5806 11.9C17.9005 11.5817 18.2775 11.3265 18.6918 11.1477C18.6885 11.0475 18.6843 10.9482 18.6776 10.848H12.8535C11.4726 10.848 10.3488 9.72425 10.3488 8.34335V2.52004C10.2144 2.51085 10.08 2.5 9.94391 2.5H6.17442C3.87264 2.5 2 4.37264 2 6.67442V18.3628C2 20.6646 3.87264 22.5372 6.17442 22.5372H10.3488V21.3224Z"
        fill="#B9B9B9"
      />
    </svg>
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[830px] p-6 sm:p-9 flex flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-montserrat text-2xl font-semibold leading-none text-[#1A1A1A]">
            Регистрация клиента в МП
          </h1>
          <p className="font-inter text-lg font-normal leading-[26px] text-[#737373]">
            Данные клиента
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-10 gap-y-4 mb-10">
            <div className="flex flex-col gap-2" ref={dropdownRef}>
              <label className="font-montserrat text-sm font-normal text-[#23262F]">
                Статус резидентства
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full h-12 px-4 flex items-center justify-between font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl hover:border-[#B50000]/50 focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                >
                  <span>{formData.residencyStatus}</span>
                  <svg
                    className={`w-5 h-5 text-[#737373] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl shadow-lg z-10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('residencyStatus', 'Резидент');
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left font-montserrat text-base font-normal text-[#232323] hover:bg-[#B50000]/10 active:bg-[#B50000]/20 transition-colors flex items-center gap-2"
                    >
                      {formData.residencyStatus === 'Резидент' && (
                        <svg
                          className="w-5 h-5 text-[#B50000]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span>Резидент</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('residencyStatus', 'не резидент');
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left font-montserrat text-base font-normal text-[#232323] hover:bg-[#B50000]/10 active:bg-[#B50000]/20 transition-colors flex items-center gap-2 border-t border-[#D7D7D7]"
                    >
                      {formData.residencyStatus === 'не резидент' && (
                        <svg
                          className="w-5 h-5 text-[#B50000]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span>не резидент</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-montserrat text-sm font-normal text-[#23262F]">Имя</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full h-12 px-4 font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-montserrat text-sm font-normal text-[#23262F]">ИНН</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.inn}
                  onChange={(e) => handleInputChange('inn', e.target.value)}
                  className="w-full h-12 px-4 font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-montserrat text-sm font-normal text-[#23262F]">Фамилия</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full h-12 px-4 font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-montserrat text-sm font-normal text-[#23262F]">
                Номер телефона
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full h-12 px-4 pr-12 font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <AttachmentIcon />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-montserrat text-sm font-normal text-[#23262F]">Отчество</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.patronymic}
                  onChange={(e) => handleInputChange('patronymic', e.target.value)}
                  className="w-full h-12 px-4 font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-montserrat text-sm font-normal text-[#23262F]">Почта</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-12 px-4 pr-12 font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <AttachmentIcon />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-montserrat text-sm font-normal text-[#23262F]">
                Дата рождения
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full h-12 px-4 font-montserrat text-base font-normal text-[#232323] bg-[#FCFCFC] border border-[#D7D7D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 px-6 flex items-center justify-center gap-2 bg-[#B50000] hover:bg-[#9a0000] active:bg-[#8a0000] rounded-xl font-montserrat text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#B50000] focus:ring-offset-2 cursor-pointer"
          >
            Подтвердить
          </button>
        </form>
      </div>
    </div>
  );
});

export default Form;
