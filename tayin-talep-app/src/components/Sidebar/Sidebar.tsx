import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

// Toggle butonu için class ve style belirleyen fonksiyon
function getToggleButtonProps(isMobile: boolean, collapsed: boolean, styles: any) {
  if (isMobile && !collapsed) {
    return {
      className: `${styles.toggleSidebar} ${styles.mobileMenuToggle} ${styles.active}`,
      style: {}
    };
  }
  return {
    className: styles.toggleSidebar,
    style: {}
  };
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [user, setUser] = useState({ ad_soyad: '', foto_url: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        setUser({ ad_soyad: parsed.ad_soyad, foto_url: parsed.foto_url });
      } catch {}
    }
    // Sidebar state'i localStorage'dan yükle
    const savedState = localStorage.getItem('sidebarState');
    if (savedState === 'collapsed') {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
    // Ekran boyutunu dinle
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  // Mobilde menü açma/kapama
  const handleMobileToggle = () => setMobileOpen(v => !v);
  const handleOverlayClick = () => setMobileOpen(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    localStorage.setItem('sidebarState', !collapsed ? 'collapsed' : 'expanded');
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Mobilde sidebar açıkken tam ekran, kapalıyken sadece buton
  if (isMobile) {
    return (
      <>
        {/* Sadece buton görünür */}
        {!mobileOpen && (
          <button className={styles.mobileMenuButton} onClick={handleMobileToggle}>
            <MenuIcon />
          </button>
        )}
        {/* Sidebar ve overlay */}
        {mobileOpen && (
          <>
            <div className={styles.mobileSidebarOverlay} onClick={handleOverlayClick}></div>
            <div className={styles.mobileSidebar}>
              <button className={styles.mobileMenuClose} onClick={handleMobileToggle}>
                <MenuIcon />
              </button>
              <nav className={styles.sidebarNav}>
                <ul>
                  <li>
                    <NavLink to="/talep" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                      <ListAltOutlinedIcon />
                      <span>Talepte bulun</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                      <AccountCircleIcon />
                      <span>Profil</span>
                    </NavLink>
                  </li>
                </ul>
              </nav>
              <div className={styles.userProfile}>
                <img src={user.foto_url || '/img/user.jpg'} className={styles.userAvatar} alt="User Avatar" />
                <div className={styles.userInfo}>
                  <h3>Hoş Geldiniz</h3>
                  <p>{user.ad_soyad}</p>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <LogoutOutlinedIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Masaüstü için mevcut yapı
  const sidebarStyle = isMobile && !collapsed
    ? {
        position: 'fixed' as const,
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: '#fff',
        zIndex: 9999,
        boxShadow: '2px 0 16px rgba(0,0,0,0.12)',
        padding: '0',
        margin: '0',
        borderRadius: '0',
        display: 'flex',
        flexDirection: 'column' as const,
        overflowY: 'auto' as const,
      }
    : {};

  return (
    <div
      className={collapsed ? `${styles.sidebar} ${styles.collapsed}` : styles.sidebar}
      style={sidebarStyle}
    >
      {/* Toggle butonu */}
      {(() => {
        const btnProps = getToggleButtonProps(isMobile, collapsed, styles);
        return (
          <button
            {...btnProps}
            onClick={handleCollapse}
          >
            <MenuIcon />
            <span>Menü Küçült</span>
          </button>
        );
      })()}
      <nav className={styles.sidebarNav}>
        <ul>
          <li>
            <NavLink to="/talep" className={({isActive}) => isActive ? styles.active : ''}>
              <ListAltOutlinedIcon />
              <span>Talepte bulun</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({isActive}) => isActive ? styles.active : ''}>
              <AccountCircleIcon />
              <span>Profil</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.userProfile}>
        <img src={user.foto_url || '/img/user.jpg'} className={styles.userAvatar} alt="User Avatar" />
        <div className={styles.userInfo}>
          <h3>Hoş Geldiniz</h3>
          <p>{user.ad_soyad}</p>
        </div>
        {!collapsed && (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutOutlinedIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 