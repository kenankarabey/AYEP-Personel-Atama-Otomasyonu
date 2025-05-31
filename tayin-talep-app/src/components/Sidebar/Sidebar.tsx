import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HomeIcon from '@mui/icons-material/Home';



type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  yetki?: string;
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

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, yetki }) => {
  const location = useLocation();
  const [user, setUser] = useState({ ad_soyad: '', foto_url: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [mobileSidebarState, setMobileSidebarState] = useState<'closed' | 'open' | 'closing'>('closed');
  const isAdmin = yetki === 'admin';

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
    // localStorage değişimini dinle
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user') {
        const updatedUser = localStorage.getItem('user');
        if (updatedUser) {
          try {
            const parsed = JSON.parse(updatedUser);
            setUser({ ad_soyad: parsed.ad_soyad, foto_url: parsed.foto_url });
          } catch {}
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', handleStorage);
    };
  }, [setCollapsed]);

  // Mobilde menü açma/kapama
  const handleMobileToggle = () => {
    if (mobileSidebarState === 'open') {
      setMobileSidebarState('closing');
    } else {
      setMobileSidebarState('open');
    }
  };
  const handleOverlayClick = () => setMobileSidebarState('closing');
  const handleSidebarAnimationEnd = () => {
    if (mobileSidebarState === 'closing') {
      setMobileSidebarState('closed');
    }
  };

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
        {mobileSidebarState === 'closed' && (
          <button className={styles.mobileMenuButton} onClick={handleMobileToggle}>
            <MenuIcon />
          </button>
        )}
        {(mobileSidebarState === 'open' || mobileSidebarState === 'closing') && (
          <>
            <div className={styles.mobileSidebarOverlay} onClick={handleOverlayClick}></div>
            <div
              className={
                styles.mobileSidebar +
                (mobileSidebarState === 'closing' ? ' ' + styles.slideOutSidebar : '')
              }
              onAnimationEnd={handleSidebarAnimationEnd}
            >
              <button className={styles.mobileMenuClose} onClick={handleMobileToggle}>
                <MenuIcon />
              </button>
              <nav className={styles.sidebarNav}>
                <ul>
                  {isAdmin ? (
                    <>
                      <li>
                        <NavLink to="/admin" end className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <HomeIcon />
                          <span>Admin Anasayfa</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/gelen-talepler" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <AssignmentOutlinedIcon />
                          <span>Gelen Talepler</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/duyuru-yayinla" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <ListAltOutlinedIcon />
                          <span>Duyuru Yayınla</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin/profile" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <AccountCircleIcon />
                          <span>Admin Profil</span>
                        </NavLink>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <NavLink to="/" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <HomeIcon />
                          <span>Anasayfa</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/taleplerim" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <AssignmentOutlinedIcon />
                          <span>Taleplerim</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/talep-olustur" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <ListAltOutlinedIcon />
                          <span>Talepte Bulun</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/profile" className={({isActive}) => isActive ? styles.active : ''} onClick={handleMobileToggle}>
                          <AccountCircleIcon />
                          <span>Profil</span>
                        </NavLink>
                      </li>
                    </>
                  )}
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
          {isAdmin ? (
            <>
              <li>
                <NavLink to="/admin" end className={({isActive}) => isActive ? styles.active : ''}>
                  <HomeIcon />
                  <span>Admin Anasayfa</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/gelen-talepler" className={({isActive}) => isActive ? styles.active : ''}>
                  <AssignmentOutlinedIcon />
                  <span>Gelen Talepler</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/duyuru-yayinla" className={({isActive}) => isActive ? styles.active : ''}>
                  <ListAltOutlinedIcon />
                  <span>Duyuru Yayınla</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/profile" className={({isActive}) => isActive ? styles.active : ''}>
                  <AccountCircleIcon />
                  <span>Admin Profil</span>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/" className={({isActive}) => isActive ? styles.active : ''}>
                  <HomeIcon />
                  <span>Anasayfa</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/taleplerim" className={({isActive}) => isActive ? styles.active : ''}>
                  <AssignmentOutlinedIcon />
                  <span>Taleplerim</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/talep-olustur" className={({isActive}) => isActive ? styles.active : ''}>
                  <ListAltOutlinedIcon />
                  <span>Talepte Bulun</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({isActive}) => isActive ? styles.active : ''}>
                  <AccountCircleIcon />
                  <span>Profil</span>
                </NavLink>
              </li>
            </>
          )}
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