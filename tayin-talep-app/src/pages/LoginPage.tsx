import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAlert } from '../components/AlertContext';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [sicilNo, setSicilNo] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const isMobile = window.innerWidth <= 600;
  const [open, setOpen] = useState(() => {
    const stored = localStorage.getItem('stickyNoteOpen');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    document.title = 'AYEP-Personel Tayin Talep Uygulaması';
  }, []);

  useEffect(() => {
    localStorage.setItem('stickyNoteOpen', open ? 'true' : 'false');
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Eski kullanıcıyı sil
    localStorage.removeItem('user');
    // Supabase'den kullanıcıyı çek
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('sicil_no', sicilNo)
      .eq('sifre', sifre)
      .single();
    setLoading(false);
    if (error || !data) {
      setError('Sicil No veya şifre hatalı!');
      showAlert('Sicil No veya şifre hatalı!', 'error');
      return;
    }
    // Doğrudan Supabase'den gelen kullanıcıyı kaydet
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('stickyNoteOpen', 'false'); // Girişte sticky note'u kapat
    console.log('Kaydedilen kullanıcı:', data); // LOG
    showAlert('Başarıyla giriş yapıldı', 'success');
    navigate('/');
  };

  return (
    isMobile ? (
      <div style={{ minHeight: '100vh', background: '#f6f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <div style={{ width: '100%', maxWidth: 340, padding: '24px 8px 0 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={adaletLogo} alt="Adalet Bakanlığı Logo" style={{ width: 90, height: 90, marginBottom: 12, borderRadius: 16, boxShadow: '0 2px 12px #0001' }} />
          <div style={{ fontWeight: 700, fontSize: 20, color: '#d7292a', marginBottom: 6, textAlign: 'center' }}>Tayin Talep Giriş</div>
          <div style={{ fontSize: 14, color: '#555', marginBottom: 18, textAlign: 'center' }}>Adalet Bakanlığı Personel Tayin Sistemi</div>
          <form onSubmit={handleSubmit} style={{ width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f6f7fa', borderRadius: 8, padding: '8px 10px' }}>
              <HowToRegIcon style={{ color: '#d7292a', marginRight: 8 }} />
              <input type="text" placeholder="Sicil No" value={sicilNo} onChange={e => setSicilNo(e.target.value)} required style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 15 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f6f7fa', borderRadius: 8, padding: '8px 10px' }}>
              <LockIcon style={{ color: '#d7292a', marginRight: 8 }} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Şifre" value={sifre} onChange={e => setSifre(e.target.value)} required style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 15 }} />
              <span onClick={() => setShowPassword(v => !v)} style={{ cursor: 'pointer', marginLeft: 6, color: '#888' }}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
            </div>
            {error && <div style={{ color: 'red', fontSize: 13, marginTop: -6 }}>{error}</div>}
            <button type="submit" style={{ background: '#d7292a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <LoginIcon /> Giriş Yap
            </button>
          </form>
        </div>
        <div style={{ width: '100%', maxWidth: 340, margin: '32px auto 0 auto', background: 'none', textAlign: 'center', fontSize: 13, color: '#888' }}>
          <div style={{ marginBottom: 8, color: '#232a4d', fontWeight: 500 }}>Teknik Destek</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            <PhoneIcon style={{ color: '#d7292a' }} />
            <span>+90 (552) 363 14 01</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <EmailIcon style={{ color: '#d7292a' }} />
            <span>ab306515@adalet.gov.tr</span>
          </div>
        </div>
      </div>
    ) : (
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
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-group">
                <HowToRegIcon className="login-icon" />
                <input type="text" placeholder="Sicil No" className="login-input" value={sicilNo} onChange={e => setSicilNo(e.target.value)} required />
              </div>
              <div className="login-input-group">
                <LockIcon className="login-icon" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Şifre" className="login-input" value={sifre} onChange={e => setSifre(e.target.value)} required />
                <span className="login-eye" onClick={() => setShowPassword(v => !v)} style={{cursor:'pointer'}}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
              {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
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
    )
  );
};

// StickyNote bileşeni (sadece webde)
const StickyNote = () => {
  const isMobile = window.innerWidth <= 600;
  const [open, setOpen] = useState(true);
  const [note, setNote] = useState(localStorage.getItem('stickyNote') || '');
  const [drag, setDrag] = useState({ x: 40, y: 40 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('stickyNote', note);
  }, [note]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setDrag(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  if (isMobile) return null;

  return (
    <>
      {!open && (
        <button
          style={{
            position: 'fixed', right: 24, bottom: 24, zIndex: 9999,
            background: '#ffe066', color: '#232a4d', border: 'none', borderRadius: 8, padding: '10px 18px',
            fontWeight: 700, fontSize: 18, boxShadow: '0 2px 12px #0002', cursor: 'pointer'
          }}
          onClick={() => setOpen(true)}
        >
          Not Aç
        </button>
      )}
      {open && (
        <div
          ref={dragRef}
          style={{
            position: 'fixed',
            left: drag.x,
            top: drag.y,
            zIndex: 9999,
            background: '#fffbe6',
            border: '1.5px solid #ffe066',
            borderRadius: 12,
            boxShadow: '0 4px 24px #0002',
            width: 260,
            minHeight: 160,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            resize: 'both',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              background: '#ffe066',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              padding: '8px 12px',
              cursor: 'move',
              fontWeight: 700,
              color: '#232a4d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onMouseDown={() => setDragging(true)}
          >
            Yapışkan Not
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#d7292a',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
                marginLeft: 8
              }}
              aria-label="Kapat"
            >×</button>
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Notunuzu buraya yazın..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              padding: 12,
              fontSize: 15,
              color: '#232a4d',
              resize: 'none'
            }}
          />
        </div>
      )}
    </>
  );
};

export default LoginPage;

// LoginPage'in en altına StickyNote'u ekle
// (export default'un üstüne ekle)
if (typeof window !== 'undefined') {
  const root = document.getElementById('root');
  if (root) {
    // StickyNote'u sadece LoginPage'de render et
    const observer = new MutationObserver(() => {
      if (window.location.pathname === '/login' && !document.getElementById('sticky-note-root')) {
        const stickyDiv = document.createElement('div');
        stickyDiv.id = 'sticky-note-root';
        document.body.appendChild(stickyDiv);
        // React 18+ için createRoot kullanımı
        import('react-dom/client').then(({ createRoot }) => {
          createRoot(stickyDiv).render(<StickyNote />);
        });
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  }
} 