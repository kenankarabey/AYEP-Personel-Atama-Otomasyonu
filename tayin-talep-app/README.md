# Personel Tayin Talebi Uygulaması

## Proje Açıklaması
Personel Tayin Talebi Uygulaması, kurum personelinin sicil numarası ve şifresiyle giriş yaparak tayin talebinde bulunmasını, taleplerini takip etmesini ve yöneticilerin bu talepleri yönetmesini sağlayan modern ve kullanıcı dostu bir web uygulamasıdır. Ayrıca yöneticiler için duyuru yayınlama ve gelen talepleri görüntüleme gibi ek yönetimsel özellikler de sunar.

## Özellikler
- **Kullanıcı Girişi:** Personel, sicil numarası ve şifresiyle güvenli giriş yapar.
- **Profil Görüntüleme:** Giriş yapan personel, kendisine ait temel bilgileri görüntüleyebilir.
- **Tayin Talebi Oluşturma:** Personel, tercih listesinden adliye seçerek yeni tayin talebi oluşturabilir.
- **Taleplerim:** Personel, daha önce oluşturduğu talepleri başvuru tarihi ve talep türüyle birlikte görebilir.
- **Responsive Tasarım:** Mobil ve tablet cihazlara uyumlu, modern ve sade arayüz.
- **Form Doğrulama:** Tüm formlarda kullanıcıya açıklayıcı geri bildirimler sunan doğrulama mekanizmaları.
- **Akıcı Sayfa Geçişleri:** Tüm sayfalar arası geçişler hızlı ve kullanıcı dostudur.
- **Örnek Veriler:** Uygulama, örnek adliye ve kullanıcı verileriyle çalışır.

### Admin Özellikleri
- **Duyuru Yayınlama:** Yöneticiler, sisteme yeni duyurular ekleyebilir ve mevcut duyuruları yönetebilir.
- **Gelen Talepleri Görüntüleme:** Yöneticiler, tüm personel tarafından oluşturulan tayin taleplerini detaylı şekilde görebilir.
- **Talep Detayları:** Her bir talebin başvuru tarihi, talep türü, personel bilgileri ve durumu görüntülenebilir.
- **Yönetici Ana Sayfası:** Yöneticiler için özel bir ana sayfa ve navigasyon menüsü.
- **Kullanıcı ve Talep Yönetimi:** (Opsiyonel) Taleplerin durumunu güncelleme, başvuruları filtreleme gibi ek yönetimsel işlemler.

## Kullanılan Teknolojiler
- **React** (TypeScript)
- **Material UI (MUI)**
- **React Router**
- **React Icons**
- **Day.js**
- **CSS Modules**
- **Supabase** (veritabanı ve kimlik doğrulama için)

## Kurulum ve Çalıştırma

1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/kullanici-adi/tayin-talep-app.git
   cd tayin-talep-app
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Supabase Ayarları:**
   - `src/supabaseClient.ts` dosyasındaki `SUPABASE_URL` ve `SUPABASE_ANON_KEY` alanlarını kendi Supabase projenize göre güncelleyin.
   - Supabase üzerinde aşağıdaki tabloları oluşturun:
     - **users**: id, sicil_no, ad, soyad, sifre, rol
     - **talepler**: id, user_id, adliye, talep_tarihi, talep_turu, durum
     - **duyurular**: id, baslik, icerik, yayin_tarihi

4. **Uygulamayı Başlatın:**
   ```bash
   npm start
   ```
   Uygulama, varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Proje Yapısı
- `src/pages/LoginPage`: Giriş ekranı
- `src/pages/Profile`: Profil görüntüleme
- `src/pages/Talep`: Tayin talebi oluşturma
- `src/pages/Taleplerim`: Personelin taleplerini listeleme
- `src/pages/Anasayfa`: Personel ve admin ana sayfa
- `src/pages/DuyuruYayinlaAdmin`: Duyuru yayınlama (admin)
- `src/pages/GelenTaleplerAdmin`: Gelen taleplerin yönetimi (admin)
- `src/components/Sidebar`: Navigasyon menüsü ve yardımcı bileşenler

## Katkı Sağlama
Katkıda bulunmak isterseniz lütfen bir fork oluşturun, değişikliklerinizi ayrı bir dalda yapın ve pull request gönderin.

## Lisans
Bu proje MIT lisansı ile lisanslanmıştır.
