
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تایید',
  cancelText = 'انصراف',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: 'bg-red-600', hover: 'hover:bg-red-700', icon: 'text-red-600', iconBg: 'bg-red-100' },
    warning: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', icon: 'text-orange-500', iconBg: 'bg-orange-100' },
    info: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', icon: 'text-blue-600', iconBg: 'bg-blue-100' }
  };

  const color = colors[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className={`mx-auto w-14 h-14 rounded-full ${color.iconBg} flex items-center justify-center mb-4`}>
            <AlertTriangle size={28} className={color.icon} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-l dark:border-gray-700"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-4 text-sm font-bold text-white ${color.bg} ${color.hover} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
