import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './GelenTaleplerAdminPage.module.css';
import { supabase } from '../../supabaseClient';
import dayjs from 'dayjs';

const DURUM_OPTIONS = ['Beklemede', 'Onaylandı', 'Red Edildi'];

const GelenTaleplerAdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [talepler, setTalepler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTalep, setEditTalep] = useState<any>(null);
  const [editDurum, setEditDurum] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTalepId, setDeleteTalepId] = useState<number|null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;

  useEffect(() => {
    const fetchTalepler = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('talepler')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setTalepler(data);
      setLoading(false);
    };
    fetchTalepler();
  }, []);

  useEffect(() => {
    document.title = 'AYEP-Personel Tayin Talep Uygulaması';
  }, []);

  const handleDelete = (talepId: number) => {
    setDeleteTalepId(talepId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTalepId == null) return;
    await supabase.from('talepler').delete().eq('id', deleteTalepId);
    setTalepler(talepler.filter(t => t.id !== deleteTalepId));
    setDeleteModalOpen(false);
    setDeleteTalepId(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteTalepId(null);
  };

  const handleEdit = (talep: any) => {
    setEditTalep(talep);
    setEditDurum(talep.durum);
    setModalOpen(true);
  };

  const handleModalSave = async () => {
    if (!editTalep) return;
    setModalLoading(true);
    await supabase.from('talepler').update({ durum: editDurum }).eq('id', editTalep.id);
    setTalepler(talepler.map((t: any) => t.id === editTalep.id ? { ...t, durum: editDurum } : t));
    setModalOpen(false);
    setModalLoading(false);
  };

  return (
    <div className={collapsed ? `${styles.gelenTaleplerRoot} ${styles.collapsed}` : styles.gelenTaleplerRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={user.yetki} />
      <div className={styles.mainContent}>
        <div className={styles.headerCard}>
          <h1 className={styles.talepTitle}>Gelen Talepler</h1>
          <p style={{fontSize:'1.08rem', color:'#666', marginTop:8}}>Sisteme gelen tüm tayin taleplerini aşağıda görebilirsiniz.</p>
        </div>
        <div className={styles.dashboardCard}>
          {!isMobile && (
            <div className={styles.talepTableWrapper} style={{marginBottom:0}}>
              {loading ? (
                <div style={{textAlign:'center', color:'#888', fontSize:18}}>Yükleniyor...</div>
              ) : (
                <table className={styles.talepTable}>
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Talep Türü</th>
                      <th>Adliyeler</th>
                      <th>Açıklama</th>
                      <th>Dosya</th>
                      <th>Durum</th>
                      <th>Talepte Bulunan</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talepler.length === 0 ? (
                      <tr><td colSpan={8} style={{textAlign:'center', color:'#888'}}>Hiç talep bulunamadı.</td></tr>
                    ) : talepler.map(talep => (
                      <tr key={talep.id}>
                        <td>{talep.tarih ? (talep.tarih.split('-').reverse().join('.')) : ''}</td>
                        <td>{talep.talep_turu}</td>
                        <td>{talep.adliye_tercihleri ? (Array.isArray(talep.adliye_tercihleri) ? talep.adliye_tercihleri.join(', ') : talep.adliye_tercihleri) : ''}</td>
                        <td>{talep.aciklama}</td>
                        <td>{talep.dosya_url ? <a href={talep.dosya_url} target="_blank" rel="noopener noreferrer" style={{color:'#d7292a', textDecoration:'underline'}}>Dosya</a> : <span style={{color:'#aaa'}}>Yok</span>}</td>
                        <td className={
                          talep.durum === 'Onaylandı' ? styles.durumOnaylandi :
                          talep.durum === 'Red Edildi' ? styles.durumRedEdildi :
                          styles.durumBeklemede
                        }>
                          {talep.durum}
                        </td>
                        <td>{talep.talepte_bulunan}</td>
                        <td>
                          <button onClick={() => handleEdit(talep)} style={{marginRight:8, background:'#f6f7fa', border:'1px solid #d7292a', color:'#d7292a', borderRadius:6, padding:'4px 12px', cursor:'pointer'}}>Düzenle</button>
                          <button onClick={() => handleDelete(talep.id)} style={{background:'#ff4040', border:'none', color:'#fff', borderRadius:6, padding:'4px 12px', cursor:'pointer'}}>Sil</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {isMobile && (
            <div className={styles.adminTalepCardWrapper} style={{marginTop:0}}>
              {talepler.map(talep => (
                <div key={talep.id} className={styles.adminTalepCard}>
                  <div className={styles.adminTalepCardHeader}>
                    <span className={styles.adminTalepCardTitle}>{talep.talep_turu}</span>
                    <span className={
                      talep.durum === 'Onaylandı' ? styles.durumOnaylandi :
                      talep.durum === 'Red Edildi' ? styles.durumRedEdildi :
                      styles.durumBeklemede
                    }>{talep.durum}</span>
                  </div>
                  <div className={styles.adminTalepCardField}><b>Adliyeler:</b> {talep.adliye_tercihleri ? (Array.isArray(talep.adliye_tercihleri) ? talep.adliye_tercihleri.join(', ') : talep.adliye_tercihleri) : ''}</div>
                  <div className={styles.adminTalepCardField}><b>Açıklama:</b> {talep.aciklama}</div>
                  <div className={styles.adminTalepCardField}><b>Dosya:</b> {talep.dosya_url ? <a href={talep.dosya_url} target="_blank" rel="noopener noreferrer" style={{color:'#d7292a', textDecoration:'underline'}}>Dosya</a> : <span style={{color:'#aaa'}}>Yok</span>}</div>
                  <div className={styles.adminTalepCardField}><b>Tarih:</b> {talep.tarih ? (talep.tarih.split('-').reverse().join('.')) : ''}</div>
                  <div className={styles.adminTalepCardField}><b>Talepte Bulunan:</b> {talep.talepte_bulunan}</div>
                  <div className={styles.adminTalepCardBtnGroup}>
                    <button onClick={() => handleEdit(talep)} className={styles.adminTalepEditBtn}>Düzenle</button>
                    <button onClick={() => handleDelete(talep.id)} className={styles.adminTalepDeleteBtn}>Sil</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Modal */}
        {modalOpen && (
          <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.18)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div className={styles.modalContainer} style={{background:'#fff', borderRadius:14, boxShadow:'0 4px 32px rgba(22,26,74,0.18)', padding:32, minWidth:320, minHeight:120, display:'flex', flexDirection:'column', gap:18, alignItems:'center'}}>
              <h3 style={{color:'#d7292a', marginBottom:8}}>Durum Güncelle</h3>
              <div className={styles.modalSelect}>
                {DURUM_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={styles.modalOption + (editDurum === opt ? ' ' + styles.selected : '')}
                    onClick={() => setEditDurum(opt)}
                    tabIndex={0}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{display:'flex', gap:12, marginTop:12}}>
                <button onClick={handleModalSave} disabled={modalLoading} className={styles.modalBtn + ' ' + styles.modalBtnKaydet}>{modalLoading ? 'Kaydediliyor...' : 'Kaydet'}</button>
                <button onClick={()=>setModalOpen(false)} className={styles.modalBtn + ' ' + styles.modalBtnSil}>Vazgeç</button>
              </div>
            </div>
          </div>
        )}
        {/* Silme Modalı */}
        {deleteModalOpen && (
          <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.18)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background:'#fff', borderRadius:14, boxShadow:'0 4px 32px rgba(22,26,74,0.18)', padding:32, minWidth:320, minHeight:120, display:'flex', flexDirection:'column', gap:18, alignItems:'center'}}>
              <h3 style={{color:'#d7292a', marginBottom:8}}>Talep Sil</h3>
              <div style={{fontSize:16, color:'#232a4d', marginBottom:12}}>Bu talebi silmek istediğinize emin misiniz?</div>
              <div style={{display:'flex', gap:12, marginTop:12}}>
                <button onClick={confirmDelete} className={styles.modalBtn + ' ' + styles.modalBtnSil}>Sil</button>
                <button onClick={cancelDelete} className={styles.modalBtn + ' ' + styles.modalBtnVazgec}>Vazgeç</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GelenTaleplerAdminPage; 