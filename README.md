📌 Personel Tayin Talebi Uygulaması

📖 Proje Açıklaması

Personel Tayin Talebi Uygulaması, Adalet Bakanlığı personelinin sicil numarası ve şifresiyle sisteme giriş yaparak tayin talebinde bulunmasını, 
taleplerini takip etmesini ve yöneticilerin bu talepleri yönetmesini sağlayan kullanıcı dostu, modern bir web uygulamasıdır.
Ayrıca yöneticilere özel duyuru yayınlama ve gelen talepleri görüntüleme gibi yönetimsel işlevler sunar.

🚀 Özellikler

👤 Personel Paneli

Güvenli Giriş: Sicil numarası ve şifre ile kullanıcı doğrulama.

Profil Görüntüleme: Kullanıcıya ait temel bilgilerin görüntülenmesi.

Tayin Talebi Oluşturma: Tercih edilen adliyeyi seçerek yeni talep oluşturma.

Taleplerim Sayfası: Önceki taleplerin tarih ve tür bilgileriyle listelenmesi.

Admin Özellikleri

- **Duyuru Yayınlama:** Yöneticiler, sisteme yeni duyurular ekleyebilir ve mevcut duyuruları yönetebilir.
- **Gelen Talepleri Görüntüleme:** Yöneticiler, tüm personel tarafından oluşturulan tayin taleplerini detaylı şekilde görebilir.
- **Talep Detayları:** Her bir talebin başvuru tarihi, talep türü, personel bilgileri ve durumu görüntülenebilir.
- **Yönetici Ana Sayfası:** Yöneticiler için özel bir ana sayfa ve navigasyon menüsü.
- **Kullanıcı ve Talep Yönetimi:** (Opsiyonel) Taleplerin durumunu güncelleme, başvuruları filtreleme gibi ek yönetimsel işlemler.


🛠️ Yönetici Paneli

Gelen Talepleri Görüntüleme: Tüm tayin başvurularının detaylı listesi.

Duyuru Yayınlama: Personellere yönelik sistem içi duyuruların oluşturulması.

💡 Ek Özellikler

Responsive Tasarım: Mobil, tablet ve masaüstü cihazlarla tam uyumlu arayüz.

Form Doğrulama: Hataları açıklayıcı mesajlarla kullanıcı yönlendirme.

Akıcı Navigasyon: Hızlı ve kullanıcı dostu sayfa geçişleri.

Örnek Veriler: Test amaçlı örnek kullanıcı ve adliye verileriyle çalışabilme.

🧰 Kullanılan Teknolojiler

React (TypeScript)

Material UI (MUI)

React Router

React Icons

Day.js

CSS Modules

Supabase (Veritabanı & Kimlik Doğrulama)

⚙️ Kurulum ve Çalıştırma

Projeyi Klonlayın:

bash
Kopyala
Düzenle
git clone https://github.com/kullanici-adi/tayin-talep-app.git
cd tayin-talep-app
Bağımlılıkları Yükleyin:

bash
Kopyala
Düzenle
npm install
Supabase Ayarlarını Yapılandırın:

src/supabaseClient.ts dosyasındaki SUPABASE_URL ve SUPABASE_ANON_KEY alanlarını kendi Supabase projenize göre güncelleyin.

Supabase üzerinde şu tabloları oluşturun:

users

Alan	Tip
id	UUID (PK)
sicil_no	Text
ad	Text
soyad	Text
sifre	Text
rol	Text (personel / admin)

talepler

Alan	Tip
id	UUID (PK)
user_id	UUID (FK - users.id)
adliye	Text
talep_tarihi	Timestamp
talep_turu	Text
durum	Text

duyurular

Alan	Tip
id	UUID (PK)
baslik	Text
icerik	Text
yayin_tarihi	Timestamp

Uygulamayı Başlatın:

bash
Kopyala
Düzenle
npm start
Varsayılan olarak uygulama şu adreste çalışacaktır: http://localhost:3000

🗂️ Proje Yapısı

cpp
Kopyala
Düzenle
src/
│
├── components/
│   └── Sidebar          // Navigasyon menüsü
│
├── pages/
│   ├── Anasayfa         // Giriş sonrası yönlendirme sayfası
│   ├── LoginPage        // Kullanıcı giriş ekranı
│   ├── Profile          // Profil görüntüleme
│   ├── Talep            // Tayin talebi oluşturma
│   ├── Taleplerim       // Personel taleplerinin listesi
│   ├── DuyuruYayinlaAdmin  // Admin duyuru ekranı
│   └── GelenTaleplerAdmin // Admin gelen talepler ekranı
│
└── supabaseClient.ts     // Supabase yapılandırması
