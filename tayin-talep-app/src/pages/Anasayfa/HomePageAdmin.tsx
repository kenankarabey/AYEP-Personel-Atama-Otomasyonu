import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './HomePage.module.css';

const HomePageAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className={collapsed ? `${styles.homeRoot} ${styles.collapsed}` : styles.homeRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={user.yetki} />
      <div className={styles.mainContent}>
        <div className={styles.karsilamaPanel}>
          <h2>Admin Ana Sayfa</h2>
        </div>
        <div className={styles.dashboardCard}>
          <div>Buraya admin panelleri gelecek.</div>
        </div>
      </div>
    </div>
  );
};

export default HomePageAdmin; 