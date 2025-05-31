import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './GelenTaleplerAdminPage.module.css';

const GelenTaleplerAdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className={collapsed ? `${styles.gelenTaleplerRoot} ${styles.collapsed}` : styles.gelenTaleplerRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={user.yetki} />
      <div className={styles.mainContent}>
        <div className={styles.headerCard}>
          <h2>Gelen Talepler (Admin)</h2>
        </div>
        <div className={styles.dashboardCard}>
          <div>Buraya gelen talepler tablosu gelecek.</div>
        </div>
      </div>
    </div>
  );
};

export default GelenTaleplerAdminPage; 