import React, { useEffect, useState } from 'react';
import { AlertCircle, Lightbulb, Undo2 } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'hint' | 'undo' | 'boss-aid' | 'error' | 'success';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Allow fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'hint':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'undo':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'boss-aid':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'hint':
        return <Lightbulb className="w-5 h-5" />;
      case 'undo':
        return <Undo2 className="w-5 h-5" />;
      case 'boss-aid':
        return <AlertCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <span className="text-lg">✓</span>;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (!isVisible && !show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        show && isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm ${getToastStyles()}`}
      >
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast notification hook for easy usage
export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastProps['type'];
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastProps['type'] = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const showHintToast = (isBoss: boolean = false) => {
    const message = isBoss
      ? "Aid used — max 1★ this game"
      : "Hint used — max 2★ this game";
    const type = isBoss ? 'boss-aid' : 'hint';
    showToast(message, type);
  };

  const showUndoToast = (isBoss: boolean = false) => {
    const message = isBoss
      ? "Aid used — max 1★ this game"
      : "Undo used — max 2★ this game";
    const type = isBoss ? 'boss-aid' : 'undo';
    showToast(message, type);
  };

  return {
    toast,
    showToast,
    hideToast,
    showHintToast,
    showUndoToast
  };
};