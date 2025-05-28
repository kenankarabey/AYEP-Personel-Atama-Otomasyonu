import React from 'react';
import styles from '../Talep/Talep.module.css';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const mockTalepler = [
  {
    id: 1,
    tarih: '28.05.2025',
    talepTuru: 'Yer Değişikliği',
    adliyeTercihleri: ['Malatya Adliyesi', 'İstanbul Anadolu Adliyesi'],
    aciklama: 'Ailevi nedenlerle yer değişikliği talep ediyorum.',
    dosya: 'dilekce.pdf',
    durum: 'Beklemede',
  },
  {
    id: 2,
    tarih: '15.04.2025',
    talepTuru: 'Geçici Görevlendirme',
    adliyeTercihleri: ['Ankara BAM'],
    aciklama: 'Geçici görevlendirme için başvuru.',
    dosya: '',
    durum: 'Onaylandı',
  },
];

const TaleplerimPage: React.FC = () => {
  return (
    <div className={styles.talepRoot}>
      <div className={styles.talepCardWrapper}>
        <div className={styles.talepCard}>
          <h1 className={styles.talepTitle}>Taleplerim</h1>
          <p className={styles.talepDesc}>Yaptığınız tüm tayin taleplerini aşağıda görebilirsiniz.</p>
        </div>
      </div>
      <div className={styles.talepCardWrapper}>
        <div className={styles.talepCard} tabIndex={0} style={{paddingTop: 24, paddingBottom: 24}}>
          {mockTalepler.length === 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {mockTalepler.map(talep => (
                    <tr key={talep.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                      <td style={{padding:'10px 8px'}}>{talep.tarih}</td>
                      <td style={{padding:'10px 8px'}}>{talep.talepTuru}</td>
                      <td style={{padding:'10px 8px'}}>{talep.adliyeTercihleri.join(', ')}</td>
                      <td style={{padding:'10px 8px'}}>{talep.aciklama}</td>
                      <td style={{padding:'10px 8px'}}>{talep.dosya ? <a href="#" style={{color:'#d7292a', textDecoration:'underline'}}>{talep.dosya}</a> : <span style={{color:'#aaa'}}>Yok</span>}</td>
                      <td style={{padding:'10px 8px', fontWeight:600, color: talep.durum === 'Onaylandı' ? '#1bbf4c' : '#d7292a'}}>{talep.durum}</td>
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