# Monny - Catatan Keuangan Monokrom & Dompet Digital

<p align="center">
  <strong>Aplikasi pencatatan keuangan pribadi dan manajemen dompet digital yang minimalis, modern, dan berfokus pada pengalaman mobile (Mobile-First).</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Capacitor-8-119eff?style=flat-square&logo=capacitor&logoColor=white" alt="Capacitor 8" />
  <img src="https://img.shields.io/badge/PWA-Ready-success?style=flat-square&logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/Offline-100%25%20Private-09090b?style=flat-square" alt="100% Offline" />
</p>

---

## 📋 Daftar Isi
- [Tentang Monny](#-tentang-monny)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Panduan Memulai](#-panduan-memulai)
  - [Prasyarat](#prasyarat)
  - [Instalasi](#instalasi)
  - [Mode Pengembangan](#mode-pengembangan)
  - [Build Produksi Web](#build-produksi-web)
- [Menjalankan Sebagai Aplikasi HP](#-menjalankan-sebagai-aplikasi-hp)
  - [Metode 1: PWA (Progressive Web App)](#metode-1-pwa-progressive-web-app-paling-praktis)
  - [Metode 2: Native Android APK (Capacitor)](#metode-2-native-android-apk-via-capacitor)
- [Keamanan & Privasi Data](#-keamanan--privasi-data)
- [Lisensi](#-lisensi)

---

## 💡 Tentang Monny

**Monny** dirancang bagi siapa saja yang menginginkan pencatatan keuangan harian tanpa distraksi iklan, tanpa login akun cloud pihak ketiga yang berbelit-belit, dan dengan antarmuka monokrom elegan yang nyaman di mata baik siang maupun malam hari.

Aplikasi ini 100% *offline-first*: semua data keuangan tersimpan aman di perangkat pengguna dan dapat diekspor/diimpor kapan saja menggunakan format JSON standar.

---

## ✨ Fitur Utama

- 🖤 **Desain Monokrom Minimalis & Aksen Terarah**
  - Palet warna hitam, putih, dan abu-abu netral yang modern dan bersih.
  - Aksen fungsional: **Emerald (Hijau)** untuk arus kas masuk & kondisi finansial surplus; **Rose (Merah)** untuk arus kas keluar & defisit.
- 🌓 **Mode Terang & Gelap (Dark / Light Theme)**
  - Tampilan otomatis mengikuti preferensi sistem atau dapat diganti secara instan dengan satu sentuhan.
  - Terintegrasi langsung dengan status bar native HP melalui plugin Capacitor.
- 📅 **In-App Custom Date Picker & Dropdown**
  - Kalender kustom monokrom dengan tombol *shortcut* cepat (*Hari Ini*, *Kemarin*, *2 Hari Lalu*) tanpa mengandalkan input HTML default browser yang kaku.
  - Pemilihan filter bulan dan filter kategori kustom yang halus dan responsif.
- 💳 **Manajemen Dompet & Sumber Dana Fleksibel**
  - Kelola saldo kas tunai, rekening bank, dan dompet digital (e-wallet).
  - Pantau total kekayaan bersih (*net balance*) secara *real-time*.
- 📊 **Rekapan & Analisis Finansial Cerdas**
  - Ringkasan pemasukan, pengeluaran, selisih bersih, dan rata-rata pengeluaran per hari.
  - Persentase alokasi pengeluaran per kategori.
  - Indikator kesehatan finansial otomatis (*Prima*, *Seimbang*, *Defisit*).
  - Fitur **Salin Laporan Rekapan** satu klik untuk dibagikan ke catatan atau pesan teks.
- 🌐 **Multi-Mata Uang & Bilingual**
  - Pilihan mata uang: Rupiah (IDR), Dolar AS (USD), Euro (EUR), Dolar Singapura (SGD), Ringgit Malaysia (MYR), dan Yen Jepang (JPY).
  - Pilihan bahasa: **Bahasa Indonesia** dan **English**.
- 🔒 **Cadangan & Pemulihan Data (Export / Import JSON)**
  - Ekspor seluruh basis data transaksi ke file JSON untuk *backup*.
  - Pulihkan data kapan saja ke perangkat lain dengan mudah.
- 🚫 **100% Bebas Emoji & Ikonik**
  - Semua antarmuka menggunakan ikon SVG tajam dari **Lucide Icons**.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework UI** | [React 19](https://react.dev/) | Library UI komponen terkini |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | Pengetikan statis aman |
| **Bundler & Dev Server** | [Vite 8](https://vite.dev/) | Build super cepat dengan HMR |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Engine CSS performa tinggi |
| **Ikon** | [Lucide React](https://lucide.dev/) | Kumpulan ikon SVG konsisten |
| **Native Bridge** | [Capacitor 8](https://capacitorjs.com/) | Runtime hybrid untuk Android Native |
| **PWA & Offline** | Service Worker & Web App Manifest | Dukungan install dan caching offline |

---

## 📁 Struktur Proyek

```text
Monny/
├── android/                   # Konfigurasi & Source Code Proyek Native Android
│   ├── app/                   # Kode aplikasi Android (Java, Gradle, Resource)
│   └── build.gradle           # Konfigurasi Gradle Android
├── public/                    # Aset statis publik
│   ├── favicon.svg            # Favicon SVG monokrom
│   ├── icon-192.png           # Ikon aplikasi PWA (192px)
│   ├── icon-512.png           # Ikon aplikasi PWA (512px)
│   ├── manifest.json          # Web App Manifest PWA
│   └── sw.js                  # Service Worker untuk caching & offline mode
├── src/                       # Kode sumber aplikasi React
│   ├── assets/                # Aset gambar & ilustrasi
│   ├── components/            # Komponen tampilan UI
│   │   ├── AppSplashScreen.tsx        # Animasi splash screen pembuka
│   │   ├── BalanceCard.tsx            # Kartu ringkasan saldo utama
│   │   ├── BottomNav.tsx              # Navigasi bawah mobile
│   │   ├── CustomDatePicker.tsx       # Kalender pemilih tanggal kustom
│   │   ├── CustomMonthSelect.tsx      # Dropdown pemilih periode bulan
│   │   ├── CustomSelect.tsx           # Dropdown pilihan umum kustom
│   │   ├── DashboardView.tsx          # Halaman beranda
│   │   ├── Header.tsx                 # Header aplikasi & pengubah tema
│   │   ├── RecapView.tsx              # Halaman analisis & rekapan
│   │   ├── SettingsView.tsx           # Pengaturan, mata uang & backup
│   │   ├── TransactionHistoryView.tsx # Riwayat & filter transaksi
│   │   ├── TransactionItem.tsx        # Item baris transaksi
│   │   ├── TransactionModal.tsx       # Modal formulir catat/ubah transaksi
│   │   └── WalletList.tsx             # Daftar kartu dompet sumber dana
│   ├── context/
│   │   └── WalletContext.tsx  # State management terpusat (transaksi, dompet, tema)
│   ├── data/
│   │   └── categories.ts      # Definisi kategori pengeluaran & pemasukan
│   ├── hooks/
│   │   └── usePWAInstall.ts   # Hook penanganan instalasi PWA
│   ├── types/
│   │   └── index.ts           # Definisi tipe data TypeScript
│   ├── utils/
│   │   ├── formatters.ts      # Fungsi format mata uang, tanggal & angka
│   │   └── i18n.ts            # Glosarium multibahasa (ID & EN)
│   ├── App.tsx                # Komponen induk aplikasi
│   ├── index.css              # Setup Tailwind CSS & styling kustom
│   └── main.tsx               # Titik masuk React DOM
├── capacitor.config.ts        # Konfigurasi Capacitor untuk Android
├── index.html                 # HTML entry point aplikasi
├── package.json               # Konfigurasi dependensi & scripts NPM
└── vite.config.ts             # Konfigurasi Vite
```

---

## 🚀 Panduan Memulai

### Prasyarat
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru disarankan)
- [Git](https://git-scm.com/)
- *Opsional untuk build APK Android:* [Android Studio](https://developer.android.com/studio) dengan Android SDK & JDK 17+.

### Instalasi
1. Clone repositori:
   ```bash
   git clone https://github.com/Yenvys/Monny.git
   cd Monny
   ```
2. Pasang semua dependensi:
   ```bash
   npm install
   ```

### Mode Pengembangan
Jalankan server pengembangan lokal:
```bash
npm run dev
```
Buka peramban di `http://localhost:5173`.

### Build Produksi Web
Untuk mengompilasi kode menjadi file web statis optimal di direktori `dist/`:
```bash
npm run build
```

---

## 📱 Menjalankan Sebagai Aplikasi HP

Monny mendukung dua opsi kemudahan penggunaan di perangkat seluler:

### Metode 1: PWA (Progressive Web App) — Paling Praktis
Tidak membutuhkan instalasi Android Studio:
1. Jalankan development server dengan opsi host agar bisa diakses di jaringan lokal (Wi-Fi):
   ```bash
   npm run dev -- --host
   ```
2. Buka URL jaringan lokal (misal: `http://192.168.1.10:5173/`) menggunakan **Google Chrome** di HP Android Anda.
3. Ketuk tombol **"Install"** di bilah notifikasi aplikasi, atau tekan tombol menu titik tiga (`⋮`) di Chrome lalu pilih **"Install aplikasi"** / **"Tambahkan ke Layar Utama"**.
4. Aplikasi akan terpasang di HP layaknya aplikasi native dengan layar penuh (*fullscreen*) dan dapat diakses saat *offline*.

---

### Metode 2: Native Android APK (via Capacitor)
Untuk menghasilkan file `.apk` asli yang siap dipasang langsung di HP mana pun:

1. Sinkronkan kode web terbaru ke proyek Android:
   ```bash
   npm run cap:sync
   ```
2. Buka proyek Android di Android Studio:
   ```bash
   npm run cap:android
   ```
3. Di dalam Android Studio:
   - Hubungkan HP Android melalui kabel USB (USB Debugging aktif) lalu klik tombol **Run ▶**, atau
   - Pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)** untuk membuat file `.apk` siap pasang.

---

## 🔐 Keamanan & Privasi Data

- **Lokal Sepenuhnya**: Semua transaksi, saldo, dan pengaturan disimpan di `localStorage` peramban atau *sandbox* aplikasi lokal perangkat Anda.
- **Tanpa Pelacakan**: Tidak ada pelacak pihak ketiga, iklan, atau telemetri.
- **Kendali Penuh**: Anda memegang kendali penuh melalui menu **Pengaturan** untuk mengekspor cadangan berkas `.json`, memulihkan riwayat, atau menghapus seluruh basis data kapan saja.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi terbuka. Silakan dikembangkan dan digunakan untuk kebutuhan pencatatan keuangan pribadi maupun pembelajaran.

Dibuat dengan ❤️ oleh **[Yenvys](https://github.com/Yenvys)**.
