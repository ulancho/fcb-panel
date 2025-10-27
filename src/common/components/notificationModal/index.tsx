import type { FC } from 'react';

type NotificationModalProps = {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
};

const BUTTON_COLOR = {
  success: 'bg-[#0F9D58] hover:bg-[#0B7A43] focus:ring-[#0F9D58]/40',
  error: 'bg-[#B50000] hover:bg-[#8F0000] focus:ring-[#B50000]/40',
} as const;

export const NotificationModal: FC<NotificationModalProps> = ({ type, message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div
      role="alertdialog"
      aria-modal="true"
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="mt-2 font-inter text-sm text-[#4B4B4B] text-center">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className={`mt-6 w-full rounded-xl px-4 py-2 font-montserrat text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 cursor-pointer ${
          BUTTON_COLOR[type]
        }`}
      >
        Закрыть
      </button>
    </div>
  </div>
);
