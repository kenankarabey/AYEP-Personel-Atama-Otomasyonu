import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const mockDuyurular = [
  { id: 1, title: 'Sistem Bakımı', desc: '15 Haziran 2024 tarihinde 22:00-23:00 arası sistem bakımı yapılacaktır.' },
  { id: 2, title: 'Yeni Özellik', desc: 'Talep formlarında dosya ekleme özelliği aktif edilmiştir.' },
];
const mockSSS = [
  { q: 'Talep nasıl oluşturulur?', a: 'Sol menüden "Talepte Bulun" sayfasına giderek formu doldurabilirsiniz.' },
  { q: 'Profil bilgilerimi nasıl güncellerim?', a: 'Profil sayfasında "Düzenle" butonuna tıklayarak bilgilerinizi güncelleyebilirsiniz.' },
];

const HomePage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [istatistik, setIstatistik] = useState({ toplam: 0, bekleyen: 0, onaylanan: 0 });
  const [sonTalepler, setSonTalepler] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  useEffect(() => {
    const fetchTalepler = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('talepler')
        .select('*')
        .eq('kullanici_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setIstatistik({
          toplam: data.length,
          bekleyen: data.filter((t: any) => t.durum === 'Beklemede').length,
          onaylanan: data.filter((t: any) => t.durum === 'Onaylandı').length,
        });
        setSonTalepler(data.slice(0, 3));
      }
    };
    if (user) fetchTalepler();
  }, [user]);

  // user null ise localStorage'dan oku (ilk render için fallback)
  const userObj = user || JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className={collapsed ? `${styles.homeRoot} ${styles.collapsed}` : styles.homeRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={userObj.yetki} />
      <div className={styles.mainContent}>
        {user && (
          <div className={styles.karsilamaPanel}>
            <img src={user.foto_url || '/img/user.jpg'} alt="Profil" className={styles.karsilamaAvatar} />
            <div>
              <h2>Hoş geldin, <span className={styles.karsilamaIsim}>{user.ad_soyad}</span></h2>
              <div className={styles.karsilamaRol}>{user.departman || 'Kullanıcı'}</div>
            </div>
          </div>
        )}
        <div className={styles.dashboardCard}>
          {/* İstatistik Kartları */}
          <div className={styles.istatistikGrid}>
            <div className={styles.istatistikCard}>
              <div className={styles.istatistikSayi}>{istatistik.toplam}</div>
              <div className={styles.istatistikLabel}>Toplam Talep</div>
            </div>
            <div className={styles.istatistikCard}>
              <div className={styles.istatistikSayi}>{istatistik.bekleyen}</div>
              <div className={styles.istatistikLabel}>Bekleyen</div>
            </div>
            <div className={styles.istatistikCard}>
              <div className={styles.istatistikSayi}>{istatistik.onaylanan}</div>
              <div className={styles.istatistikLabel}>Onaylanan</div>
            </div>
          </div>
          {/* Son İşlemler */}
          <div className={styles.sonIslemlerPanel}>
            <div className={styles.sonIslemlerBaslik}><InfoIcon /> Son Taleplerin</div>
            {sonTalepler.length === 0 ? (
              <div className={styles.sonIslemBos}>Henüz talebin yok.</div>
            ) : (
              <ul className={styles.sonIslemList}>
                {sonTalepler.map((talep) => (
                  <li key={talep.id} className={styles.sonIslemItem}>
                    <span className={styles.sonIslemTuru}>{talep.talep_turu}</span>
                    <span className={styles.sonIslemDurum + ' ' + (talep.durum === 'Onaylandı' ? styles.onay : styles.bekle)}>{talep.durum}</span>
                    <span className={styles.sonIslemTarih}>{talep.tarih ? talep.tarih.split('-').reverse().join('.') : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Duyurular */}
          <div className={styles.duyurularPanel}>
            <div className={styles.duyurularBaslik}><InfoIcon /> Duyurular</div>
            <ul className={styles.duyurularList}>
              {mockDuyurular.map((d) => (
                <li key={d.id} className={styles.duyuruItem}>
                  <div className={styles.duyuruTitle}>{d.title}</div>
                  <div className={styles.duyuruDesc}>{d.desc}</div>
                </li>
              ))}
            </ul>
          </div>
          {/* SSS ve Yardım */}
          <div className={styles.sssPanel}>
            <div className={styles.sssBaslik}><HelpOutlineIcon /> Sıkça Sorulan Sorular</div>
            <ul className={styles.sssList}>
              {mockSSS.map((s, i) => (
                <li key={i} className={styles.sssItem}>
                  <div className={styles.sssQ}>{s.q}</div>
                  <div className={styles.sssA}>{s.a}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 