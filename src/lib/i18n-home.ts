// Indonesian translations for the homepage + header/nav.
// Keep keys mirroring the English source in src/lib/store.ts so we can swap
// them in `_site.index.tsx` and `Header.tsx` when language === "id".

export const idNavLabels: Record<string, string> = {
  "/": "Beranda",
  "/services": "Layanan",
  "/products": "Produk",
  "/about": "Tentang",
  "/careers": "Karier",
  "/contact": "Kontak",
};

export const idHeader = {
  signIn: "Masuk",
  getStarted: "Mulai sekarang",
};

export const idHero = {
  eyebrow: "Perangkat lunak & sistem untuk bisnis Anda",
  title: "Kami merancang dan membangun perangkat lunak yang menjalankan bisnis Anda.",
  subtitle:
    "Zanscode bermitra dengan pemilik bisnis dan perusahaan menengah untuk merancang, membangun, dan mengoperasikan sistem khusus — web, mobile, cloud, dan ERP.",
  primaryCta: "Mulai proyek",
  secondaryCta: "Jelajahi layanan",
};

export const idHeroBadges = {
  operationalLift: "Peningkatan operasional",
  operationalLiftSub: "rata-rata seluruh deployment",
  timeToShip: "Waktu rilis pertama",
  timeToShipSub: "dari diskusi hingga peluncuran",
  security: "Keamanan tertanam dalam setiap rilis",
};

export const idStatsLabels: Record<string, string> = {
  "Systems delivered": "Sistem dikirim",
  "Enterprise clients": "Klien enterprise",
  "Industries served": "Industri dilayani",
  "Platform uptime": "Uptime platform",
};

export const idSections: Record<string, { eyebrow?: string; title: string; subtitle: string; cards: Record<string, { title: string; description: string }> }> = {
  "sec-capabilities": {
    eyebrow: "Yang kami bangun",
    title: "Perangkat lunak khusus, dari ujung ke ujung",
    subtitle: "Dari arsitektur sistem hingga pixel terakhir — satu mitra rekayasa.",
    cards: {
      c1: { title: "Perangkat lunak bisnis khusus", description: "Sistem yang dirancang sesuai cara bisnis Anda benar-benar beroperasi." },
      c2: { title: "Sistem ERP & operasional", description: "Inventori, penjualan, keuangan, HR, dan pelaporan dalam satu sumber data." },
      c3: { title: "Aplikasi web & mobile", description: "Aplikasi pelanggan dan internal untuk web, iOS, dan Android." },
    },
  },
  "sec-process": {
    eyebrow: "Cara kami bekerja",
    title: "Jalur jelas dari ide hingga skala",
    subtitle: "Proses rekayasa yang terbukti menjaga semua orang selaras dan terus mengirim.",
    cards: {
      p1: { title: "Telusuri", description: "Workshop untuk memetakan tujuan, pengguna, alur kerja, dan batasan." },
      p2: { title: "Rancang", description: "Arsitektur sistem, UX, dan rencana keberhasilan yang terukur." },
      p3: { title: "Bangun", description: "Pengiriman iteratif dengan demo mingguan dan umpan balik cepat." },
      p4: { title: "Skala", description: "Operasikan, optimalkan, dan kembangkan sistem jangka panjang." },
    },
  },
};

export const idHome = {
  trustedHeadline: "Dipercaya oleh tim di seluruh kawasan",
  industriesEyebrow: "Industri",
  industriesTitle: "Dipercaya lintas industri",
  industriesSubtitle:
    "Dari pemilik bisnis tunggal hingga perusahaan menengah multi-cabang — Zanscode menyesuaikan diri dengan cara industri Anda bekerja.",
  industryNames: {
    "Retail & F&B": "Retail & F&B",
    Logistics: "Logistik",
    "Real Estate": "Properti",
    Healthcare: "Kesehatan",
    Education: "Pendidikan",
    Finance: "Keuangan",
  } as Record<string, string>,
  pullQuote: "Zanscode bukan sekadar menulis kode — mereka merancang cara bisnis berjalan.",
  pullQuoteRole: "COO, RetailCo (12 outlet)",
  saasEyebrow: "SaaS siap pakai",
  saasTitle: "Jalankan bisnis Anda dengan produk Zanscode, sejak hari pertama.",
  saasSubtitle:
    "Selain sistem khusus, kami menghadirkan lini produk SaaS untuk berbagai industri — mulai dari POS, manajemen klinik, hingga aplikasi sekolah dan layanan lapangan.",
  saasBullets: [
    "25+ produk SaaS siap industri",
    "Live, ter-hosting, dan terus diperbarui",
    "Bisa dikustomisasi untuk alur kerja unik Anda",
    "Tim engineering yang sama di balik setiap rilis",
  ],
  saasPrimaryCta: "Lihat produk SaaS",
  saasSecondaryCta: "Bicara dengan tim kami",
  saasCards: {
    launch: { title: "Tayang dalam hitungan hari", body: "Aktifkan tenant kerja dalam kurang dari seminggu — tanpa mengurus infrastruktur atau integrasi." },
    enterprise: { title: "Siap enterprise", body: "SSO, akses berbasis peran, audit log, dan ekspor data penuh — termasuk sejak hari pertama." },
    scale: { title: "Dibangun untuk skala", body: "Arsitektur multi-tenant teruji dari tim kecil hingga 10.000+ pengguna." },
    modular: { title: "Modular sejak awal", body: "Mulai dari satu modul, tambah sesuai pertumbuhan. Bayar hanya untuk yang tim Anda pakai." },
  },
  testimonialsEyebrow: "Kisah pelanggan",
  testimonialsTitle: "Disukai pemilik dan operator.",
  testimonials: [
    "Zanscode membangun ulang operasi kami dari nol. Empat alat menjadi satu — dan tim akhirnya percaya pada datanya.",
    "Mereka mengirim platform logistik kami dalam 14 minggu. Kualitas, komunikasi, engineering — luar biasa.",
    "Mitra software sejati — mereka berpikir bersama kami, bukan hanya untuk kami. Sistem terus membaik dari kuartal ke kuartal.",
  ],
  closingTitle: "Punya sistem dalam pikiran?",
  closingHighlight: "Mari kita bangun.",
  closingDescription:
    "Ceritakan apa yang ingin Anda pecahkan — kami akan menawarkan arsitektur, tim, dan timeline untuk merilisnya.",
};
