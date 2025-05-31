import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './DuyuruYayinlaAdminPage.module.css';

const DuyuruYayinlaAdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className={collapsed ? `${styles.duyuruRoot} ${styles.collapsed}` : styles.duyuruRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={user.yetki} />
      <div className={styles.mainContent}>
        <div className={styles.headerCard}>
          <h2>Duyuru Yayınla (Admin)</h2>
        </div>
        <div className={styles.dashboardCard}>
          <div>Buraya duyuru yayınlama paneli gelecek.</div>
        </div>
      </div>
    </div>
  );
};

export default DuyuruYayinlaAdminPage; 