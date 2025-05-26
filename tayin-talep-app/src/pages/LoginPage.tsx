import React, { useState } from 'react';
import './LoginPage.css';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import adaletLogo from '../assets/adalet-logo.png';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-root">
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo">
            <img src={adaletLogo} alt="Adalet Bakanlığı Logo" />
          </div>
          <div className="login-title">Personel Tayin Talebi Sistemi</div>
          <div className="login-desc">
               Personel tayin talebi sistemi, Adalet Bakanlığı'nda personel tayinlerinin tek noktadan yönetimi ve takibi için geliştirilmiş bir platformdur. Tüm geliştirme süreci bir üniversite öğrencisi ve Malatya Adliyesinde Bilgisayar Teknisyeni olarak çalışan Kenan Karabey tarafından yapılmıştır.
          </div>
        </div>
        <div className="login-right">
          <div className="login-welcome">Personel Tayin Talebi Sistemine Hoş Geldiniz</div>
          <div className="login-sub">Devam etmek için lütfen giriş yapın</div>
          <form className="login-form">
            <div className="login-input-group">
              <HowToRegIcon className="login-icon" />
              <input type="text" placeholder="Sicil No" className="login-input" />
            </div>
            <div className="login-input-group">
              <LockIcon className="login-icon" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Şifre" className="login-input" />
              <span className="login-eye" onClick={() => setShowPassword(v => !v)} style={{cursor:'pointer'}}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
            </div>
            <button type="submit" className="login-btn">
              <LoginIcon style={{marginRight: 6}} /> Giriş Yap
            </button>
          </form>
          <div className="login-support">
            <div>Teknik destek için:</div>
            <div className="login-support-row">
              <PhoneIcon className="login-icon" />
              <span>+90 (552) 363 14 01</span>
            </div>
            <div className="login-support-row">
              <EmailIcon className="login-icon" />
              <span>ab306515@adalet.gov.tr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 