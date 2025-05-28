import React, { useState, useEffect } from 'react';
import styles from './Talep.module.css';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dayjs from 'dayjs';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../../supabaseClient';

const TALEP_TURLERI = [
  'Yer Değişikliği',
  'Geçici Görevlendirme',
  'Tayin',
  'Eş Durumu',
];

const ADLIYELER = [
  { il: 'İstanbul', ilce: 'Bakırköy', adliye: 'Bakırköy Adliyesi' },
  { il: 'İstanbul', ilce: 'Anadolu', adliye: 'İstanbul Anadolu Adliyesi' },
  { il: 'İstanbul', ilce: 'Çağlayan', adliye: 'İstanbul Çağlayan Adliyesi' },
  { il: 'Malatya', ilce: 'Merkez', adliye: 'Malatya Adliyesi' },
  { il: 'Malatya', ilce: 'Pütürge', adliye: 'Pütürge Adliyesi' },
  { il: 'Ankara', ilce: 'Çankaya', adliye: 'Ankara BAM' },
  { il: 'Sivas', ilce: 'Merkez', adliye: 'Sivas  Adliyesi' },
  { il: 'Elazığ', ilce: 'Merkez', adliye: 'Yeşilyurt Adliyesi' },


];

const MAHKEME_TURLERI = [
  'Asliye Ceza',
  'Asliye Hukuk',
  'Aile Mahkemesi',
  'İcra Mahkemesi',
  'Sulh Ceza',
  'Sulh Hukuk',
];

// Custom Autocomplete Input Component
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
    <div className={styles.talepFormGroup} style={{position:'relative'}}>
      <label>{label}</label>
      <div className={styles.adliyeFormDropdownWrapper}>
        <input
          type="text"
          className={styles.adliyeInput}
          placeholder={placeholder || 'Seçiniz'}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); setValue(''); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          autoComplete="off"
        />
        {open && filtered.length > 0 && (
          <div className={styles.adliyeDropdown}>
            {filtered.map(opt => (
              <div
                key={opt}
                className={styles.adliyeDropdownItem + (value === opt ? ' ' + styles.selected : '')}
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

const TalepPage: React.FC = () => {
  const [form, setForm] = useState({
    talepTuru: '',
    adliyeTercihleri: [] as string[],
    aciklama: '',
    dosya: null as File | null,
  });
  const [talepler, setTalepler] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState('');
  const [adliyeInput, setAdliyeInput] = useState('');
  const [adliyeDropdownOpen, setAdliyeDropdownOpen] = useState(false);
  const [removingChip, setRemovingChip] = useState<string | null>(null);
  const [talepTuruInput, setTalepTuruInput] = useState('');
  const [loading, setLoading] = useState(false);
  const maxTercih = 4;

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
      if (!error && data) setTalepler(data);
      setLoading(false);
    };
    fetchTalepler();
  }, []);

  const adliyeListesi = ADLIYELER.map(a => a.adliye);
  const filtreliAdliyeler = adliyeListesi.filter(adliye =>
    adliye.toLowerCase().includes(adliyeInput.toLowerCase()) && !form.adliyeTercihleri.includes(adliye)
  );

  const handleAddAdliye = (adliye: string) => {
    if (form.adliyeTercihleri.length < maxTercih && !form.adliyeTercihleri.includes(adliye)) {
      setForm({ ...form, adliyeTercihleri: [...form.adliyeTercihleri, adliye] });
      setAdliyeInput('');
      setAdliyeDropdownOpen(false);
    }
  };
  const handleRemoveAdliye = (adliye: string) => {
    setRemovingChip(adliye);
    setTimeout(() => {
      setForm({ ...form, adliyeTercihleri: form.adliyeTercihleri.filter(a => a !== adliye) });
      setRemovingChip(null);
    }, 180);
  };

  const handleTalepTuruChange = (v: string) => setForm(f => ({ ...f, talepTuru: v }));

  const handleInputFocus = () => setAdliyeDropdownOpen(true);
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => setAdliyeDropdownOpen(false), 120);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdliyeInput(e.target.value);
    setAdliyeDropdownOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, dosya: e.target.files ? e.target.files[0] : null });
  };

  const validate = () => {
    const err: any = {};
    if (!form.talepTuru) err.talepTuru = 'Talep türü seçiniz';
    if (form.adliyeTercihleri.length === 0) err.adliyeTercihleri = 'En az bir adliye tercihi ekleyin';
    if (!form.aciklama) err.aciklama = 'Açıklama giriniz';
    return err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setLoading(true);
      const localUser = localStorage.getItem('user');
      if (!localUser) return;
      const user = JSON.parse(localUser);
      let dosya_url = '';
      if (form.dosya) {
        const fileName = `${user.id}_${Date.now()}_${form.dosya.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('talep-dosya').upload(fileName, form.dosya, { upsert: true });
        if (!uploadError) {
          const { publicUrl } = supabase.storage.from('talep-dosya').getPublicUrl(fileName).data;
          dosya_url = publicUrl;
        }
      }
      const { error: insertError } = await supabase.from('talepler').insert([
        {
          kullanici_id: user.id,
          tarih: dayjs().format('YYYY-MM-DD'),
          talep_turu: form.talepTuru,
          adliye_tercihleri: form.adliyeTercihleri,
          aciklama: form.aciklama,
          dosya_url,
          durum: 'Beklemede',
        },
      ]);
      if (!insertError) {
        setSuccess('Talebiniz başarıyla oluşturuldu!');
        setForm({ talepTuru: '', adliyeTercihleri: [], aciklama: '', dosya: null });
        setTalepTuruInput('');
        // Talepleri tekrar çek
        const { data } = await supabase
          .from('talepler')
          .select('*')
          .eq('kullanici_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setTalepler(data);
      }
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className={styles.talepRoot}>
      <div className={styles.talepCardWrapper}>
      <div className={styles.talepCard}>
        <h1 className={styles.talepTitle}>Tayin Talebi Oluştur</h1>
        <p className={styles.talepDesc}>Lütfen tayin talebi için aşağıdaki formu doldurunuz.</p>
      </div>
      </div>
      <div className={styles.talepCardWrapper}>
        <div className={styles.talepCard} tabIndex={0}>
          <form className={styles.talepForm} onSubmit={handleSubmit}>
            <div className={styles.talepFormGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Tarih
              </label>
              <input type="date" value={dayjs().format('YYYY-MM-DD')} disabled readOnly className={styles.adliyeInput} />
            </div>
            <div className={styles.talepFormGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AssignmentIcon style={{ color: '#d7292a' }} /> Talep Türü
              </label>
              <AutocompleteInput
                label=""
                value={form.talepTuru}
                setValue={handleTalepTuruChange}
                input={talepTuruInput}
                setInput={setTalepTuruInput}
                options={TALEP_TURLERI}
                error={errors.talepTuru}
                placeholder="Talep türü seçiniz"
              />
            </div>
            <div className={styles.talepFormGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BusinessIcon style={{ color: '#d7292a' }} /> Tercih Edilen Adliyeler
              </label>
              <div className={styles.adliyeChipContainer}>
                {form.adliyeTercihleri.map((adliye, idx) => (
                  <span className={styles.adliyeChip + (removingChip === adliye ? ' ' + styles.removing : '')} key={adliye}>
                    <BusinessIcon style={{fontSize:18, marginRight:4}} />
                    {adliye}
                    <button type="button" className={styles.adliyeChipRemove} onClick={() => handleRemoveAdliye(adliye)}><CloseIcon style={{fontSize:16}} /></button>
                  </span>
                ))}
              </div>
              <div className={styles.adliyeFormDropdownWrapper}>
                <input
                  type="text"
                  placeholder={`Adliye seçiniz (En fazla ${maxTercih} tercih)`}
                  value={adliyeInput}
                  onChange={handleInputChange}
                  className={styles.adliyeInput}
                  disabled={form.adliyeTercihleri.length >= maxTercih}
                  autoComplete="off"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                {(adliyeDropdownOpen && filtreliAdliyeler.length > 0) && (
                  <div className={styles.adliyeDropdown}>
                    {filtreliAdliyeler.map(adliye => (
                      <div
                        key={adliye}
                        className={styles.adliyeDropdownItem + (form.adliyeTercihleri.includes(adliye) ? ' ' + styles.selected : '')}
                        onMouseDown={() => handleAddAdliye(adliye)}
                      >
                        <BusinessIcon style={{fontSize:18, marginRight:6}} />
                        {adliye}
                      </div>
                    ))}
                </div>
                )}
              </div>
              {errors.adliyeTercihleri && <span style={{color:'red'}}>{errors.adliyeTercihleri}</span>}
            </div>
            <div className={styles.talepFormGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DescriptionIcon style={{ color: '#d7292a' }} /> Açıklama
              </label>
              <textarea name="aciklama" value={form.aciklama} onChange={handleChange} rows={3} style={{resize:'vertical'}} />
              {errors.aciklama && <span style={{color:'red'}}>{errors.aciklama}</span>}
            </div>
            <div className={styles.talepFormGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AttachFileIcon style={{ color: '#d7292a' }} /> Dosya Ekle
              </label>
              <div
                className={styles.fileBox}
                onClick={() => document.getElementById('talep-dosya-input')?.click()}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('talep-dosya-input')?.click(); }}
              >
                <input
                  id="talep-dosya-input"
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFile}
                  style={{display:'none'}}
                />
                <span className={form.dosya ? '' : styles.placeholder}>
                  {form.dosya ? form.dosya.name : 'Dosya seçilmedi'}
                </span>
              </div>
            </div>
            <button className={`${styles.talepSaveBtn} ${styles.talepSaveBtnSmall}`} type="submit" style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:8}}>
              <SendIcon style={{fontSize:20}} /> Talep Oluştur
            </button>
            {success && <div style={{color:'green', marginTop:8}}>{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TalepPage; 