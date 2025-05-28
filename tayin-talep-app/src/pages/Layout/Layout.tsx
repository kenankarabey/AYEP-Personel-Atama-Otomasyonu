import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

const LoadingScreen: React.FC = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #fff 0%, #f6f7fa 100%)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    transition: 'opacity 0.4s',
  }}>
    <div style={{
      width: 64,
      height: 64,
      border: '6px solid #d7292a',
      borderTop: '6px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: 24
    }} />
    <div style={{ fontSize: 22, color: '#d7292a', fontWeight: 600, letterSpacing: 1 }}>Yükleniyor...</div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
  </div>
);

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={collapsed ? `${styles.layoutRoot} ${styles.collapsed}` : styles.layoutRoot}>
      {loading && <LoadingScreen />}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={styles.mainContent} style={loading ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 