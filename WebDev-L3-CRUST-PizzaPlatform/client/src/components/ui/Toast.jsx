import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

const typeStyles = {
  info:    'bg-charcoal-light border-char-grey',
  success: 'bg-charcoal-light border-basil',
  warning: 'bg-charcoal-light border-mozzarella',
  error:   'bg-charcoal-light border-tomato',
};

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3
            rounded-button border-l-4 shadow-card
            font-body text-sm text-dough-cream
            ${typeStyles[toast.type]}
          `}
          style={{
            animation: toast.exiting
              ? 'toast-out 0.3s ease-in forwards'
              : 'toast-in 0.3s ease-out forwards',
          }}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-dough-cream/50 hover:text-dough-cream transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* Standalone Toast for styleguide preview */
export function Toast({ message, type = 'info', className = '' }) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        rounded-button border-l-4 shadow-card
        font-body text-sm text-dough-cream
        ${typeStyles[type]}
        ${className}
      `}
    >
      <span className="flex-1">{message}</span>
      <button className="text-dough-cream/50 hover:text-dough-cream transition-colors cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;
