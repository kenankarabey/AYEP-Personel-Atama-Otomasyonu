import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

const Layout: React.FC<{ admin?: boolean }> = ({ admin }) => {
  const [collapsed, setCollapsed] = useState(false);
  let yetki = undefined;
  if (admin) {
    yetki = 'admin';
  } else {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        yetki = parsed.yetki;
      } catch {}
    }
  }
  return (
    <div className={collapsed ? `${styles.layoutRoot} ${styles.collapsed}` : styles.layoutRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={yetki} />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 