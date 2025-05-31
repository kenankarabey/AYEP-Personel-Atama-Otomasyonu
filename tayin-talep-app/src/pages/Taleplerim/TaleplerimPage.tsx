/** @jsxImportSource react */
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../Taleplerim/TaleplerimPage.module.css';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { supabase } from '../../supabaseClient';
import { useAlert } from '../../components/AlertContext';

const TALEP_TURLERI = [
  'Yer Değişikliği',
  'Geçici Görevlendirme',
  'Tayin',
  'Eş Durumu',
];

const DURUM_OPTIONS = [
  'Tümü',
  'Beklemede',
  'Onaylandı',
];
const ADLIYE_OPTIONS = [
  'Tümü',
  'Malatya Adliyesi',
  'İstanbul Anadolu Adliyesi',
  'Ankara BAM',
];

function AutocompleteInput({ value, setValue, input, setInput, options, placeholder }: {
  value: string,
  setValue: (v: string) => void,
  input: string,
  setInput: (v: string) => void,
  options: string[],
  placeholder?: string
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{left: number, top: number, width: number}>({left: 0, top: 0, width: 0});
  const filtered = options.filter(opt => opt.toLowerCase().includes(input.toLowerCase()));
  const handleSelect = (opt: string) => {
    setValue(opt);
    setInput(opt);
    setOpen(false);
  };
  useEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom + window.scrollY, width: rect.width });
    }
  }, [open, input]);
  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownPos({ left: rect.left, top: rect.bottom + window.scrollY, width: rect.width });
      }
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll, true);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
    };
  }, [open]);
  return (
    <>
      <input
        ref={inputRef}
        type="text"
        className={styles.talepFilterInput}
        placeholder={placeholder || 'Seçiniz'}
        value={input}
        onChange={e => { setInput(e.target.value); setOpen(true); setValue(''); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        autoComplete="off"
      />
      {open && filtered.length > 0 && ReactDOM.createPortal(
        <div
          className={styles.adliyeDropdown}
          style={{
            zIndex: 2147483647,
            position: 'absolute',
            left: dropdownPos.left,
            top: dropdownPos.top,
            width: dropdownPos.width
          }}
        >
          {filtered.map(opt => (
            <div
              key={opt}
              className={styles.adliyeDropdownItem + (value === opt ? ' ' + styles.selected : '')}
              onMouseDown={() => handleSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

const TaleplerimPage: React.FC = () => {
  const [talepTuru, setTalepTuru] = useState('');
  const [talepTuruInput, setTalepTuruInput] = useState('');
  const [durum, setDurum] = useState('');
  const [durumInput, setDurumInput] = useState('');
  const [adliye, setAdliye] = useState('');
  const [adliyeInput, setAdliyeInput] = useState('');
  const [tarih, setTarih] = useState('');
  const [talepler, setTalepler] = useState<any[]>([]);
  const [filteredTalepler, setFilteredTalepler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let filtered = talepler.filter(talep => {
      // Talep Türü
      const talepTuruMatch = !talepTuru || talepTuru === '' || talepTuru === 'Tümü' || talep.talep_turu === talepTuru;
      // Durum
      const durumMatch = !durum || durum === '' || durum === 'Tümü' || talep.durum === durum;
      // Adliye
      const adliyeMatch = !adliye || adliye === '' || adliye === 'Tümü' || (talep.adliye_tercihleri && talep.adliye_tercihleri.includes(adliye));
      // Tarih (veritabanında YYYY-MM-DD, inputta YYYY-MM-DD)
      const tarihMatch = !tarih || tarih === '' || talep.tarih === tarih;
      return talepTuruMatch && durumMatch && adliyeMatch && tarihMatch;
    });
    setFilteredTalepler(filtered);
  };

  const handleDelete = async (talepId: number) => {
    if (!window.confirm('Bu talebi silmek istediğinize emin misiniz?')) return;
    await supabase.from('talepler').delete().eq('id', talepId);
    showAlert('Talep başarıyla silindi!', 'success');
    // Silme sonrası güncel verileri çek
    const localUser = localStorage.getItem('user');
    if (!localUser) return;
    const user = JSON.parse(localUser);
    const { data } = await supabase
      .from('talepler')
      .select('*')
      .eq('kullanici_id', user.id)
      .order('created_at', { ascending: false });
    if (data) {
      setTalepler(data);
      setFilteredTalepler(data);
    }
  };

  useEffect(() => {
    const fetchTalepler = async () => {
      setLoading(true);
      const localUser = localStorage.getItem('user');
      if (!localUser) return;
      const user = JSON.parse(localUser);
      const { data, error } = await supabase
        .from('talepler')
        .select('*')
        .eq('kullanici_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setTalepler(data);
        setFilteredTalepler(data);
      }
      setLoading(false);
    };
    fetchTalepler();
  }, []);

  return (
    <div className={styles.talepRoot}>
      <div className={styles.talepCardWrapper}>
        <div className={styles.talepCard}>
          <h1 className={styles.talepTitle}>Taleplerim</h1>
          <p className={styles.talepDesc}>Yaptığınız tüm tayin taleplerini aşağıda görebilirsiniz.</p>
        </div>
      </div>
      <div className={styles.talepCardWrapper}>
        <div className={styles.talepCard} style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div style={{ width: '100%' }}>
            <form className={styles.talepFilterArea} onSubmit={handleFilter}>
              <div className={styles.talepFilterField}>
                <label htmlFor="filterTalepTuru" className={styles.talepFilterLabel}>Talep Türü</label>
                <AutocompleteInput
                  value={talepTuru}
                  setValue={setTalepTuru}
                  input={talepTuruInput}
                  setInput={setTalepTuruInput}
                  options={TALEP_TURLERI}
                  placeholder="Talep Türü Seçin"
                />
              </div>
              <div className={styles.talepFilterField}>
                <label htmlFor="filterDurum" className={styles.talepFilterLabel}>Durum</label>
                <AutocompleteInput
                  value={durum}
                  setValue={setDurum}
                  input={durumInput}
                  setInput={setDurumInput}
                  options={DURUM_OPTIONS}
                  placeholder="Durum Seçin"
                />
              </div>
              <div className={styles.talepFilterField}>
                <label htmlFor="filterTarih" className={styles.talepFilterLabel}>Tarih</label>
                <input id="filterTarih" type="date" className={styles.talepFilterInput} value={tarih} onChange={e => setTarih(e.target.value)} />
              </div>
              <div className={styles.talepFilterField}>
                <label htmlFor="filterAdliye" className={styles.talepFilterLabel}>Adliyeler</label>
                <AutocompleteInput
                  value={adliye}
                  setValue={setAdliye}
                  input={adliyeInput}
                  setInput={setAdliyeInput}
                  options={ADLIYE_OPTIONS}
                  placeholder="Adliye Seçin"
                />
              </div>
              <button type="submit" className={styles.talepFilterBtn}>Filtrele</button>
            </form>
          </div>
        </div>
      </div>
      <div className={styles.talepCardWrapper}>
        <div className={styles.talepCard} tabIndex={0} style={{paddingTop: 24, paddingBottom: 24}}>
          {filteredTalepler.length === 0 ? (
            <div style={{textAlign:'center', color:'#888', fontSize:18}}>Henüz bir talebiniz yok.</div>
          ) : (
            <div style={{width:'100%'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f6f7fa'}}>
                    <th style={{padding:'10px 8px', color:'#d7292a', fontWeight:600, fontSize:15, textAlign:'left'}}>Tarih</th>
                    <th style={{padding:'10px 8px', color:'#d7292a', fontWeight:600, fontSize:15, textAlign:'left'}}><AssignmentIcon style={{verticalAlign:'middle', fontSize:18}} /> Talep Türü</th>
                    <th style={{padding:'10px 8px', color:'#d7292a', fontWeight:600, fontSize:15, textAlign:'left'}}><BusinessIcon style={{verticalAlign:'middle', fontSize:18}} /> Adliyeler</th>
                    <th style={{padding:'10px 8px', color:'#d7292a', fontWeight:600, fontSize:15, textAlign:'left'}}><DescriptionIcon style={{verticalAlign:'middle', fontSize:18}} /> Açıklama</th>
                    <th style={{padding:'10px 8px', color:'#d7292a', fontWeight:600, fontSize:15, textAlign:'left'}}><AttachFileIcon style={{verticalAlign:'middle', fontSize:18}} /> Dosya</th>
                    <th style={{padding:'10px 8px', color:'#d7292a', fontWeight:600, fontSize:15, textAlign:'left'}}>Durum</th>
                    <th style={{padding:'10px 8px', color:'#d7292a', fontWeight:600, fontSize:15, textAlign:'left'}}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTalepler.map(talep => (
                    <tr key={talep.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                      <td style={{padding:'10px 8px'}}>{talep.tarih ? (talep.tarih.split('-').reverse().join('.')) : ''}</td>
                      <td style={{padding:'10px 8px'}}>{talep.talep_turu}</td>
                      <td style={{padding:'10px 8px'}}>{talep.adliye_tercihleri ? talep.adliye_tercihleri.join(', ') : ''}</td>
                      <td style={{padding:'10px 8px'}}>{talep.aciklama}</td>
                      <td style={{padding:'10px 8px'}}>{talep.dosya_url ? <a href={talep.dosya_url} target="_blank" rel="noopener noreferrer" style={{color:'#d7292a', textDecoration:'underline'}}>Dosya</a> : <span style={{color:'#aaa'}}>Yok</span>}</td>
                      <td style={{padding:'10px 8px', fontWeight:600, color: talep.durum === 'Onaylandı' ? '#1bbf4c' : '#d7292a'}}>{talep.durum}</td>
                      <td style={{padding:'10px 8px'}}>
                        <button onClick={() => handleDelete(talep.id)} className={styles.silBtn}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaleplerimPage; 