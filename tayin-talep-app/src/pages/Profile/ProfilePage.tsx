import React, { useState, useEffect, useRef } from 'react';
import styles from './Profile.module.css';
import classNames from 'classnames';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const ProfilePage: React.FC = () => {
  const [form, setForm] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState<'profile' | 'password' | 'activity'>('profile');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (!localUser) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(localUser);
      setForm(parsed);
      setAvatar(parsed.foto_url || '/img/user.jpg');
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  if (!form) return null;

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => { setEditMode(false); };
  const handleSave = async () => {
    if (!form) return;
    const updateData = {
      ad_soyad: form.ad_soyad,
      email: form.email,
      telefon: form.telefon,
      departman: form.departman,
      konum: form.konum,
      foto_url: form.foto_url,
    };
    console.log('Supabase update gönderilen veri:', updateData);
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('sicil_no', form.sicil_no);
    console.log('Supabase update sonucu:', { data, error });
    if (!error) {
      localStorage.setItem('user', JSON.stringify(form));
      setEditMode(false);
      alert('Profil başarıyla güncellendi!');
    } else {
      alert('Profil güncellenemedi!');
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleTab = (t: 'profile' | 'password' | 'activity') => {
    setTab(t); setEditMode(false); setPasswordError('');
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Eski fotoğrafı sil
      if (form.foto_url && form.foto_url.includes('/storage/v1/object/public/profil-foto/')) {
        const eskiDosyaAdresi = form.foto_url.split('/storage/v1/object/public/profil-foto/')[1];
        if (eskiDosyaAdresi) {
          await supabase.storage.from('profil-foto').remove([eskiDosyaAdresi]);
        }
      }
      const file = e.target.files[0];
      // Dosya adını benzersiz yap (ör: sicil_no + timestamp)
      const fileName = `${form.sicil_no}_${Date.now()}_${file.name}`;
      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage.from('profil-foto').upload(fileName, file, { upsert: true });
      if (error) {
        console.error('Supabase upload error:', error);
        alert('Fotoğraf yüklenemedi!');
        return;
      }
      // Public URL oluştur
      const { publicUrl } = supabase.storage.from('profil-foto').getPublicUrl(fileName).data;
      setAvatar(publicUrl);
      setForm({ ...form, foto_url: publicUrl });
      localStorage.setItem('user', JSON.stringify({ ...form, foto_url: publicUrl }));
      // Fotoğraf URL'sini Supabase'de hemen güncelle
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update({ foto_url: publicUrl })
        .eq('sicil_no', form.sicil_no);
      console.log('Eklenen fotoğraf publicUrl:', publicUrl);
      console.log('Supabase foto_url update sonucu:', { updateData, updateError });
    }
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };
  const handlePasswordSave = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('Yeni şifreler eşleşmiyor!');
      return;
    }
    if (passwordForm.new.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalı!');
      return;
    }
    // Mevcut şifre doğru mu kontrol et
    if (passwordForm.current !== form.sifre) {
      setPasswordError('Mevcut şifre yanlış!');
      return;
    }
    // Supabase'de güncelle
    const { error } = await supabase
      .from('users')
      .update({ sifre: passwordForm.new })
      .eq('sicil_no', form.sicil_no);
    if (!error) {
      setForm({ ...form, sifre: passwordForm.new });
      localStorage.setItem('user', JSON.stringify({ ...form, sifre: passwordForm.new }));
      setPasswordError('Şifre başarıyla değiştirildi!');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setTimeout(() => { window.location.reload(); }, 1000);
    } else {
      setPasswordError('Şifre güncellenemedi!');
    }
  };

  return (
    <main className={styles.mainContent}>
      <div className={styles.profileHeader}>
        <div className={styles.profileCover}>
          <div className={styles.profileAvatarWrapper}>
            <img src={avatar} alt="Profil Fotoğrafı" className={styles.profileAvatar} />
            <button className={styles.btnChangeAvatar} onClick={() => fileInputRef.current?.click()}>
              <CameraAltIcon />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>
            <h1>{form.ad_soyad}</h1>
            <span className={styles.profileRole}>{form.sicil_no ? form.sicil_no.replace(/^ab/i, '') : ''}</span>
          </div>
          <div className={styles.profileMeta}>
            <div className={styles.metaItem}><BusinessIcon /> <span>{form.konum}</span></div>
            <div className={styles.metaItem}><EmailIcon /> <span>{form.email}</span></div>
            <div className={styles.metaItem}><PhoneIcon /> <span>{form.telefon}</span></div>
          </div>
        </div>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.profileNav}>
          <button className={classNames(styles.navItem, tab === 'profile' && styles.active)} onClick={() => handleTab('profile')}>
            <PersonIcon style={{ marginRight: 8, verticalAlign: 'middle' }} className={tab === 'profile' ? styles.activeIcon : ''} />
            <span>Profil Bilgileri</span>
          </button>
          <button className={classNames(styles.navItem, tab === 'password' && styles.active)} onClick={() => handleTab('password')}>
            <PasswordIcon style={{ marginRight: 8, verticalAlign: 'middle' }} className={tab === 'password' ? styles.activeIcon : ''} />
            <span>Şifre Değiştir</span>
          </button>
          
        </div>
        <div className={styles.profileSections}>
          {/* Profil Bilgileri */}
          <div className={classNames(styles.profileSection, tab === 'profile' && styles.active)} id="profile">
            <div className={styles.sectionHeader}>
              <h2>Profil Bilgileri</h2>
              <div className={styles.sectionActions}>
                {!editMode && (
                  <button className={classNames(styles.btn, styles.btnPrimary, styles.btnEditProfile)} onClick={handleEdit}>
                     <span><EditIcon /></span>
                  </button>
                )}
                {editMode && (
                  <>
                    <button className={classNames(styles.btn, styles.btnPrimary, styles.btnSaveProfile)} onClick={handleSave}>
                       <span><SaveIcon /></span>
                    </button>
                    <button className={classNames(styles.btn, styles.btnSecondary)} onClick={handleCancel}>
                      Vazgeç
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className={styles.profileForm}>
              <div className={styles.formGroup}>
                <label>Ad Soyad</label>
                <input type="text" name="ad_soyad" value={form.ad_soyad || ''} onChange={handleInputChange} disabled={!editMode} />
              </div>
              <div className={styles.formGroup}>
                <label>E-posta</label>
                <input type="email" name="email" value={form.email || ''} onChange={handleInputChange} disabled={!editMode} />
              </div>
              <div className={styles.formGroup}>
                <label>Şifre</label>
                <input type="password" name="sifre" value={form.sifre || ''} disabled />
                <small style={{ display: 'block', marginTop: 5, color: '#666' }}>
                  Şifrenizi değiştirmek için "Şifre Değiştir" sekmesini kullanın.
                </small>
              </div>
              <div className={styles.formGroup}>
                <label>Telefon</label>
                <input type="tel" name="telefon" value={form.telefon || ''} onChange={handleInputChange} disabled={!editMode} />
              </div>
              <div className={styles.formGroup}>
                <label>Departman</label>
                <input type="text" name="departman" value={form.departman || ''} onChange={handleInputChange} disabled={!editMode} />
              </div>
              <div className={styles.formGroup}>
                <label>Konum</label>
                <input type="text" name="konum" value={form.konum || ''} onChange={handleInputChange} disabled={!editMode} />
              </div>
            </div>
          </div>
          {/* Şifre Değiştir */}
          <div className={classNames(styles.profileSection, tab === 'password' && styles.active)} id="password">
            <div className={styles.sectionHeader}>
              <h2>Şifre Değiştir</h2>
            </div>
            <div className={styles.passwordChangeForm}>
              <div className={styles.formGroup}>
                <label htmlFor="currentPasswordField">Mevcut Şifre</label>
                <input type="password" id="currentPasswordField" name="current" value={passwordForm.current} onChange={handlePasswordChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newPasswordField">Yeni Şifre</label>
                <input type="password" id="newPasswordField" name="new" value={passwordForm.new} onChange={handlePasswordChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPasswordField">Yeni Şifre (Tekrar)</label>
                <input type="password" id="confirmPasswordField" name="confirm" value={passwordForm.confirm} onChange={handlePasswordChange} required />
              </div>
              {passwordError && <div style={{ color: passwordError.includes('başarı') ? 'green' : 'red', marginBottom: 8 }}>{passwordError}</div>}
              <div className={styles.formActions}>
                <button className={classNames(styles.btn, styles.btnPrimary)} onClick={handlePasswordSave}>
                  <VpnKeyIcon /> <span>Şifreyi Değiştir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage; 