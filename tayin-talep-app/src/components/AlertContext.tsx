import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AlertType = 'success' | 'error' | 'info';

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType>({ showAlert: () => {} });

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{ message: string; type: AlertType; open: boolean }>({ message: '', type: 'info', open: false });

  const showAlert = (message: string, type: AlertType = 'info') => {
    if (type === 'success' && message === 'Başarıyla giriş yapıldı') return;
    setAlert({ message, type, open: true });
    setTimeout(() => setAlert(a => ({ ...a, open: false })), 2500);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div style={{ position: 'fixed', top: 32, right: 32, zIndex: 99999, minWidth: 240, pointerEvents: 'none' }}>
        <div
          style={{
            transform: alert.open ? 'translateX(0)' : 'translateX(120%)',
            transition: 'transform 0.45s cubic-bezier(.4,0,.2,1)',
            willChange: 'transform',
            pointerEvents: 'auto',
          }}
        >
          {alert.open && (
            <div style={{
              background: alert.type === 'success' ? 'linear-gradient(135deg, #1bbf4c 0%, #4be37a 100%)' : alert.type === 'error' ? 'linear-gradient(135deg, #d7292a 0%, #ff4040 100%)' : '#232a4d',
              color: '#fff',
              borderRadius: 18,
              padding: '18px 32px',
              fontWeight: 600,
              fontSize: 17,
              boxShadow: '0 4px 32px rgba(22,26,74,0.18)',
              marginBottom: 8,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              letterSpacing: 0.2,
              border: 'none',
              opacity: alert.open ? 1 : 0,
              minWidth: 240,
              maxWidth: 400,
            }}>
              {alert.message}
            </div>
          )}
        </div>
      </div>
    </AlertContext.Provider>
  );
}; 