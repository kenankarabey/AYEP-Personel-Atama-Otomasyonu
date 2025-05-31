import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './HomePageAdmin.module.css';
import { supabase } from '../../supabaseClient';

const HomePageAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState([
    { title: 'Toplam Talep', value: 0, desc: 'Sisteme giren toplam talep sayısı.' },
    { title: 'Bekleyen', value: 0, desc: 'Onay bekleyen talepler.' },
    { title: 'Onaylanan', value: 0, desc: 'Onaylanan talepler.' },
    { title: 'İptal Edilen', value: 0, desc: 'İptal edilen/red edilen talepler.' },
  ]);
  const [sonTalepler, setSonTalepler] = useState<any[]>([]);
  const [duyurular, setDuyurular] = useState<any[]>([]);
  // SSS mock
  const sss = [
    { q: 'Talep nasıl oluşturulur?', a: 'Sol menüden "Talepte Bulun" sayfasına giderek formu doldurabilirsiniz.' },
    { q: 'Profil bilgilerimi nasıl güncellerim?', a: 'Profil sayfasında "Düzenle" butonuna tıklayarak bilgilerinizi güncelleyebilirsiniz.' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Talepler
      const { data: talepler, error: talepErr } = await supabase
        .from('talepler')
        .select('*')
        .order('created_at', { ascending: false });
      if (!talepErr && talepler) {
        setStats([
          { title: 'Toplam Talep', value: talepler.length, desc: 'Sisteme giren toplam talep sayısı.' },
          { title: 'Bekleyen', value: talepler.filter((t: any) => t.durum === 'Beklemede').length, desc: 'Onay bekleyen talepler.' },
          { title: 'Onaylanan', value: talepler.filter((t: any) => t.durum === 'Onaylandı').length, desc: 'Onaylanan talepler.' },
          { title: 'İptal Edilen', value: talepler.filter((t: any) => t.durum === 'Red Edildi' || t.durum === 'İptal Edildi').length, desc: 'İptal edilen/red edilen talepler.' },
        ]);
        // Son 3 talep için kullanıcı adını ekle
        const son3 = talepler.slice(0, 3);
        const enriched = await Promise.all(son3.map(async (talep: any) => {
          if (talep.ad_soyad || talep.kullanici_ad_soyad) return talep;
          if (talep.kullanici_id) {
            const { data: kullanici } = await supabase
              .from('kullanicilar')
              .select('ad_soyad')
              .eq('id', talep.kullanici_id)
              .single();
            return { ...talep, ad_soyad: kullanici?.ad_soyad || '' };
          }
          return talep;
        }));
        setSonTalepler(enriched);
      }
      // Duyurular
      const { data: duyuruData, error: duyuruErr } = await supabase
        .from('duyurular')
        .select('*')
        .order('created_at', { ascending: false });
      if (!duyuruErr && duyuruData) {
        setDuyurular(duyuruData);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = 'AYEP-Personel Tayin Talep Uygulaması';
  }, []);

  // Dinamik margin ayarı
  const mainMarginLeft = collapsed ? 70 : 280;
  const cardMaxWidth = 1100;
  const cardStyle = {
    width: '100%',
    maxWidth: cardMaxWidth,
    margin: '0 auto 24px auto',
    padding: '32px 24px',
    marginLeft: mainMarginLeft,
    transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
  };
  const headerCardStyle = {
    ...cardStyle,
    marginBottom: 32,
  };

  // Mobilde 2x2 grid için yardımcı fonksiyon
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  return (
    <div className={collapsed ? `${styles.adminRoot} ${styles.collapsed}` : styles.adminRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={user.yetki} />
      <div className={collapsed ? `${styles.adminMainContent} ${styles.collapsed}` : styles.adminMainContent}>
        {user && (
          <div className={styles.dashboardCard}>
            <div className={styles.adminKarsilamaPanel}>
              <img src={user.foto_url || '/img/user.jpg'} alt="Profil" className={styles.adminAvatar} />
              <div>
                <div className={styles.adminHosgeldin}>
                  Hoş geldin, <span>{user.ad_soyad}</span>
                </div>
                {!isMobile && (
                  <div style={{color:'#888', fontSize:'1.08rem', marginTop:8}}>
                    Yönetici olarak sistemdeki genel durumu ve istatistikleri aşağıda görebilirsiniz.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Tek büyük dashboard kartı */}
        <div className={styles.dashboardCard}>
          {/* İstatistikler */}
          <div className={styles.adminDashboardGrid}>
            {isMobile
              ? chunkArray(stats, 2).map((row, rowIdx) => (
                  <div key={rowIdx} style={{ display: 'flex', width: '100%', gap: 10, marginBottom: rowIdx === 0 ? 10 : 0 }}>
                    {row.map((item, i) => (
                      <div className={styles.adminCard} key={item.title} style={{ flex: 1 }}>
                        <div className={styles.adminCardValue}>{item.value}</div>
                        <div className={styles.adminCardTitle}>{item.title}</div>
                        <div className={styles.adminCardDesc}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                ))
              : stats.map((item) => (
                  <div className={styles.adminCard} key={item.title}>
                    <div className={styles.adminCardValue}>{item.value}</div>
                    <div className={styles.adminCardTitle}>{item.title}</div>
                    <div className={styles.adminCardDesc}>{item.desc}</div>
                  </div>
                ))}
          </div>
          {/* Son Talepler */}
          <div className={styles.sonIslemlerPanel}>
            <div className={styles.sonIslemlerBaslik}><span role="img" aria-label="note">📝</span> Son Talepler</div>
            {sonTalepler.length === 0 ? (
              <div className={styles.sonIslemBos}>Henüz talep yok.</div>
            ) : (
              <ul className={styles.sonIslemList}>
                {sonTalepler.map((talep, i) => (
                  <li key={talep.id || i} className={styles.sonIslemItem}>
                    {!isMobile && (
                      <span style={{minWidth:120, color:'#888', fontSize:'0.98rem'}}>{talep.talepte_bulunan || ''}</span>
                    )}
                    <span className={styles.sonIslemTuru}>{talep.talep_turu || talep.tur}</span>
                    <span className={
                      styles.sonIslemDurum + ' ' +
                      (talep.durum === 'Onaylandı'
                        ? styles.onay
                        : talep.durum === 'Beklemede'
                        ? styles.bekle
                        : styles.red)
                    }>{talep.durum}</span>
                    <span className={styles.sonIslemTarih}>{talep.tarih ? (talep.tarih.split('-').reverse().join('.')) : (talep.created_at ? new Date(talep.created_at).toLocaleDateString('tr-TR') : '')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Duyurular */}
          <div className={styles.duyurularPanel}>
            <div className={styles.duyurularBaslik}><span role="img" aria-label="duyuru">📢</span> Duyurular</div>
            <ul className={styles.duyurularList}>
              {duyurular.map((d, i) => (
                <li key={d.id || i} className={styles.duyuruItem}>
                  <div className={styles.duyuruTitle}>{d.baslik || d.title}</div>
                  <div className={styles.duyuruDesc}>{d.icerik || d.desc}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageAdmin; 