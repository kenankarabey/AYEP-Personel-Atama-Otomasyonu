import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './DuyuruYayinlaAdminPage.module.css';
import talepStyles from '../Talep/Talep.module.css';
import { supabase } from '../../supabaseClient';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const BASLIK_SECENEKLERI = [
  'Bakım Çalışması',
  'Güncelleme',
  'Yeni Özellik',
  'Duyuru',
  'Bilgilendirme',
];

function AutocompleteInput({ label, value, setValue, input, setInput, options, error, placeholder }: {
  label: string,
  value: string,
  setValue: (v: string) => void,
  input: string,
  setInput: (v: string) => void,
  options: string[],
  error?: string,
  placeholder?: string
}) {
  const [open, setOpen] = useState(false);
  const filtered = options.filter(opt => opt.toLowerCase().includes(input.toLowerCase()));
  const handleSelect = (opt: string) => {
    setValue(opt);
    setInput(opt);
    setOpen(false);
  };
  return (
    <div className={talepStyles.talepFormGroup} style={{position:'relative'}}>
      <label>{label}</label>
      <div className={talepStyles.adliyeFormDropdownWrapper}>
        <input
          type="text"
          className={talepStyles.adliyeInput}
          placeholder={placeholder || 'Seçiniz'}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); setValue(''); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          autoComplete="off"
        />
        {open && filtered.length > 0 && (
          <div className={talepStyles.adliyeDropdown}>
            {filtered.map(opt => (
              <div
                key={opt}
                className={talepStyles.adliyeDropdownItem + (value === opt ? ' ' + talepStyles.selected : '')}
                onMouseDown={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span style={{color:'red'}}>{error}</span>}
    </div>
  );
}

const DuyuruYayinlaAdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [baslik, setBaslik] = useState('');
  const [baslikInput, setBaslikInput] = useState('');
  const [icerik, setIcerik] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [duyurular, setDuyurular] = useState<any[]>([]);
  const [editId, setEditId] = useState<number|null>(null);
  const [editMode, setEditMode] = useState(false);
  const isMobile = window.innerWidth <= 600;
  const [showSilModal, setShowSilModal] = useState(false);
  const [silId, setSilId] = useState<number|null>(null);

  // Duyuruları çek
  const fetchDuyurular = async () => {
    const { data, error } = await supabase.from('duyurular').select('*').order('created_at', { ascending: false });
    if (!error && data) setDuyurular(data);
  };
  useEffect(() => { fetchDuyurular(); }, []);

  useEffect(() => {
    document.title = 'AYEP-Personel Tayin Talep Uygulaması';
  }, []);

  // Sil
  const handleDelete = (id: number) => {
    setSilId(id);
    setShowSilModal(true);
  };

  // Silme Modalı fonksiyonları (TaleplerimPage ile aynı)
  const handleSilOnay = async () => {
    if (!silId) return;
    await supabase.from('duyurular').delete().eq('id', silId);
    fetchDuyurular();
    setShowSilModal(false);
    setSilId(null);
  };
  const handleSilVazgec = () => {
    setShowSilModal(false);
    setSilId(null);
  };

  // Düzenle
  const handleEdit = (duyuru: any) => {
    setEditId(duyuru.id);
    setEditMode(true);
    setBaslik(duyuru.baslik);
    setBaslikInput(duyuru.baslik);
    // Tarih eskiyse bugünün tarihi olsun
    let tarih = duyuru.created_at ? dayjs(duyuru.created_at).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    if (dayjs(tarih).isBefore(dayjs().format('YYYY-MM-DD'))) {
      tarih = dayjs().format('YYYY-MM-DD');
    }
    // Açıklama başına -Düzenleme- ekle
    let yeniIcerik = duyuru.icerik;
    if (!yeniIcerik.startsWith('-Düzenleme-')) {
      yeniIcerik = `-Düzenleme- ${yeniIcerik}`;
    }
    setIcerik(yeniIcerik);
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    if (!baslik) {
      setError('Başlık seçiniz!');
      setLoading(false);
      return;
    }
    if (editMode && editId) {
      // Güncelle
      const { error } = await supabase.from('duyurular').update({
        baslik,
        icerik,
        guncelleyen: user.ad_soyad || 'Admin',
        created_at: dayjs().format('YYYY-MM-DD'),
      }).eq('id', editId);
      setLoading(false);
      if (!error) {
        setSuccess('Duyuru başarıyla güncellendi!');
        setEditMode(false);
        setEditId(null);
        setBaslik('');
        setBaslikInput('');
        setIcerik('');
        fetchDuyurular();
      } else {
        setError('Duyuru güncellenemedi!');
      }
    } else {
      // Ekle
      const { error } = await supabase.from('duyurular').insert([
        {
          baslik,
          icerik,
          yayinlayan: user.ad_soyad || 'Admin',
          guncelleyen: user.ad_soyad || 'Admin',
          created_at: dayjs().format('YYYY-MM-DD'),
        }
      ]);
      setLoading(false);
      if (!error) {
        setSuccess('Duyuru başarıyla yayınlandı!');
        setBaslik('');
        setBaslikInput('');
        setIcerik('');
        fetchDuyurular();
      } else {
        setError('Duyuru yayınlanamadı!');
      }
    }
  };

  return (
    <div className={collapsed ? `${styles.duyuruRoot} ${styles.collapsed}` : styles.duyuruRoot}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} yetki={user.yetki} />
      <div className={styles.mainContent}>
        <div className={styles.headerCard}>
          <h1 className={talepStyles.talepTitle}>Duyuru Yayınla</h1>
          <p className={talepStyles.talepDesc}>Yayınlamak istediğiniz duyuruyu aşağıdaki form ile oluşturabilirsiniz.</p>
        </div>
        <div className={styles.dashboardCard}>
          <form
            onSubmit={handleSubmit}
            className={talepStyles.talepForm}
            style={isMobile ? {
              width: '96%',
              maxWidth: 340,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 2px 12px #0001',
              padding: 10
            } : { width: '100%' }}
          >
            <div style={isMobile ? { width: '100%', marginBottom: 8 } : {}}>
              <label>Tarih</label>
              <input
                type="date"
                value={dayjs().format('YYYY-MM-DD')}
                disabled
                readOnly
                className={talepStyles.adliyeInput}
                style={isMobile ? { width: '100%', fontSize: 13, padding: '6px 4px' } : {}}
              />
            </div>
            <div style={isMobile ? { width: '100%', marginBottom: 8 } : {}}>
              <AutocompleteInput
                label="Başlık"
                value={baslik}
                setValue={setBaslik}
                input={baslikInput}
                setInput={setBaslikInput}
                options={BASLIK_SECENEKLERI}
                error={error && !baslik ? error : ''}
                placeholder="Başlık seçiniz"
              />
            </div>
            <div style={isMobile ? { width: '100%', marginBottom: 8 } : {}}>
              <label>İçerik</label>
              <textarea
                value={icerik}
                onChange={e => setIcerik(e.target.value)}
                required
                rows={isMobile ? 8 : 6}
                className={talepStyles.adliyeInput}
                style={isMobile ? { resize: 'vertical', width: '100%', fontSize: 13, minHeight: 120, padding: '6px 4px' } : { resize: 'vertical' }}
              />
            </div>
            {success && <div style={{ color: 'green', marginBottom: 10 }}>{success}</div>}
            {error && baslik ? <div style={{ color: 'red', marginBottom: 10 }}>{error}</div> : null}
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: isMobile ? '100%' : '100%' }}>
              <button
                type="submit"
                disabled={loading}
                className={talepStyles.talepSaveBtn}
                style={isMobile ? { minWidth: 90, padding: '6px 0', fontSize: 10, borderRadius: 6, letterSpacing: 0 } : { minWidth: 200 }}
              >
                {editMode ? (loading ? 'Güncelleniyor...' : 'Duyuruyu Güncelle') : (loading ? 'Yayınlanıyor...' : 'Duyuruyu Yayınla')}
              </button>
            </div>
          </form>
        </div>
        {/* Yayınlanan Duyurular Tablosu veya Kartları */}
        <div className={styles.dashboardCard} style={{marginTop: 24}}>
          <h2 style={{marginBottom:16, color:'#d7292a'}}>Yayınlanan Duyurular</h2>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {duyurular.map(duyuru => (
                <div key={duyuru.id} className="talepCardMobile" style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '14px 10px 10px 10px', margin: '0 2px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontWeight: 700, color: '#d7292a', fontSize: 15, marginBottom: 4, letterSpacing: 0.1 }}>{duyuru.baslik}</div>
                  <div style={{ color: '#232a4d', fontSize: 12, whiteSpace: 'pre-line', wordBreak: 'break-word', marginBottom: 6 }}>{duyuru.icerik}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: '#888' }}><b>Yayınlayan:</b> {duyuru.yayinlayan}</span>
                    <span style={{ fontSize: 10, color: '#888' }}><b>Güncelleyen:</b> {duyuru.guncelleyen || '-'}</span>
                    <span style={{ fontSize: 10, color: '#888' }}><b>Tarih:</b> {dayjs(duyuru.created_at).format('YYYY-MM-DD')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <button onClick={() => handleEdit(duyuru)} style={{ flex: 1, background:'#f6f7fa', border:'1px solid #d7292a', color:'#d7292a', borderRadius:8, padding:'3px 0', cursor:'pointer', fontWeight: 500, fontSize: 9, minWidth: 0, letterSpacing: 0 }}>{'Düzenle'}</button>
                    <button onClick={() => handleDelete(duyuru.id)} style={{ flex: 1, background:'#ff4040', border:'none', color:'#fff', borderRadius:8, padding:'3px 0', cursor:'pointer', fontWeight: 500, fontSize: 9, minWidth: 0, letterSpacing: 0 }}>{'Sil'}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className={styles.talepTable}>
              <thead>
                <tr style={{background:'#f6f7fa'}}>
                  <th>Başlık</th>
                  <th>İçerik</th>
                  <th>Yayınlayan</th>
                  <th>Güncelleyen</th>
                  <th>Tarih</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {duyurular.map(duyuru => (
                  <tr key={duyuru.id}>
                    <td>{duyuru.baslik}</td>
                    <td style={{maxWidth:300, whiteSpace:'pre-line', overflowWrap:'break-word'}}>{duyuru.icerik}</td>
                    <td>{duyuru.yayinlayan}</td>
                    <td>{duyuru.guncelleyen || '-'}</td>
                    <td>{dayjs(duyuru.created_at).format('YYYY-MM-DD')}</td>
                    <td>
                      <button onClick={() => handleEdit(duyuru)} style={{marginRight:8, background:'#f6f7fa', border:'1px solid #d7292a', color:'#d7292a', borderRadius:6, padding:'4px 12px', cursor:'pointer'}}>Düzenle</button>
                      <button onClick={() => handleDelete(duyuru.id)} style={{background:'#ff4040', border:'none', color:'#fff', borderRadius:6, padding:'4px 12px', cursor:'pointer'}}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Silme Modalı (TaleplerimPage ile birebir aynı) */}
        {showSilModal && (
          <div className={styles.silModalOverlay}>
            <div className={styles.silModal}>
              <button className={styles.silModalClose} onClick={handleSilVazgec} aria-label="Kapat"><CloseIcon /></button>
              <div className={styles.silModalContent}>
                <WarningAmberIcon style={{ color: '#d7292a', fontSize: 56, marginBottom: 10, filter: 'drop-shadow(0 2px 8px #ffeaea)' }} />
                <div style={{ fontWeight: 700, fontSize: '1.18rem', marginTop: 8, color: '#232a4d', letterSpacing: 0.1 }}>
                  Bu duyuruyu silmek istediğinize emin misiniz?
                </div>
              </div>
              <div className={styles.silModalButtons}>
                <button className={styles.vazgec + ' vazgec'} type="button" onClick={handleSilVazgec}>Vazgeç</button>
                <button className={styles.onay + ' onay'} type="button" onClick={handleSilOnay}>Evet, Sil</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuyuruYayinlaAdminPage; 