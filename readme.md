# 🧩 PanggilAja! Backend

Backend API untuk platform **PanggilAja!**, sebuah marketplace jasa lokal yang menghubungkan penyedia layanan dan pelanggan.  
Project ini dikembangkan menggunakan **Node.js**, **Express**, dan **Prisma ORM** dengan **PostgreSQL Cloud Database** sebagai penyimpanan utama.

---

## 🚀 Tech Stack

- **Node.js** – Runtime JavaScript untuk backend  
- **Express.js** – Web framework minimalis  
- **Prisma ORM** – ORM modern untuk PostgreSQL  
- **JWT** – Autentikasi berbasis token  
- **Bcrypt** – Hashing password  
- **Brevo API (Sendinblue)** – Layanan email transactional  
- **ESM Modules** – Menggunakan syntax `import/export` modern  

---

## 🌿 Branch Workflow

Repositori ini memiliki dua branch utama:

| Branch | Deskripsi |
|---------|------------|
| `main` | Branch **stabil** untuk versi production |
| `development` | Branch **aktif** tempat seluruh fitur dikembangkan dan diuji sebelum merge ke `main` |

### 🧭 Petunjuk untuk Kontributor
Jika ingin mencoba versi terbaru atau berkontribusi, pastikan menggunakan branch `development`:

```bash
git clone https://github.com/<username>/<nama-project>.git
cd <nama-project>
git checkout development
````

> ⚠️ **Penting:** Semua pengembangan aktif dilakukan di `development`.
> Jangan melakukan push langsung ke `main` kecuali untuk rilis final.

---

## 🧭 Cara Cepat Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project ini di local environment kamu:

---

### 1️⃣ Clone Project dan Masuk ke Branch Development

```bash
git clone https://github.com/<username>/<nama-project>.git
cd <nama-project>
git checkout development
```

---

### 2️⃣ Instal Dependensi

Pastikan sudah menginstal [Node.js](https://nodejs.org/) minimal versi 18.

```bash
npm install
```

---

### 3️⃣ Siapkan File Environment

Buat file `.env` di root folder dengan template dari `.env.example`:

```bash
cp .env.example .env
```

Kemudian isi nilai sesuai konfigurasi kamu, contoh:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (gunakan URL dari cloud PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db_name>?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<db_name>"

# JWT
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
JWT_EXPIRED_IN=1d

# Bcrypt
SALT=10

# Brevo
BREVO_API_KEY=your_brevo_api_key
```

> 💡 Tips: Pastikan `?pgbouncer=true` jika menggunakan Supabase.

---

### 4️⃣ Generate Prisma Client

Karena database sudah berada di cloud, **tidak perlu menjalankan migrasi (`migrate dev`)**.
Cukup generate Prisma client agar project bisa berinteraksi dengan database:

```bash
npx prisma generate
```

Jika ingin melihat data di database secara visual:

```bash
npx prisma studio
```

> ⚠️ **Catatan:** Prisma Studio menampilkan data *live* dari cloud DB. Jangan ubah data production secara langsung.

---

### 5️⃣ Jalankan Server

Setelah semua siap, jalankan project dengan:

```bash
npm run dev
```

Server akan berjalan di:
👉 [http://localhost:3000](http://localhost:3000)

---

### ✅ Tes Endpoint

Gunakan Postman / Thunder Client / curl untuk menguji koneksi:

```bash
curl http://localhost:3000/api/health
```

Response:

```json
{
  "status": "success",
  "message": "Server is running"
}
```

---

## 🧠 Troubleshooting

| Masalah                               | Penyebab                       | Solusi                                                       |
| ------------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| `PrismaClientInitializationError`     | Prisma Client belum digenerate | Jalankan `npx prisma generate`                               |
| `PORT already in use`                 | Port sudah digunakan           | Ubah nilai `PORT` di `.env`                                  |
| `Error: Missing env variable`         | `.env` tidak ditemukan         | Pastikan file `.env` ada dan lengkap                         |

---

## 📂 Struktur Folder

```
.
├── prisma/
│   ├── schema.prisma       # Skema database Prisma, berisi definisi model dan relasi tabel
│
├── src/
│   ├── config/             # Konfigurasi global seperti environment, Brevo API, JWT, dll
│   ├── controllers/        # Menangani request dan response dari setiap endpoint
│   ├── database/           # Inisialisasi dan koneksi Prisma Client ke database
│   ├── exceptions/         # Kumpulan custom error class (BadRequestError, UnauthorizedError, dll)
│   ├── middleware/         # Middleware Express (validasi token, error handler, dsb)
│   ├── routes/             # Definisi routing API dan pemetaan controller
│   ├── services/           # Business logic utama aplikasi (terpisah dari controller)
│   ├── utils/              # Fungsi helper seperti format response, generate kode, dll
│   ├── validator/          # Validasi schema input menggunakan Joi atau library lain
│   ├── app.js              # Inisialisasi Express App dan middleware global
│   └── server.js           # Entry point utama untuk menjalankan server
│
├── .env.example            # Template environment variable
├── package.json            # Informasi dependensi dan script project
└── README.md               # Dokumentasi project ini

```

---

## 🤝 Kontribusi

1. Fork repositori ini
2. Buat branch baru dari `development`:

   ```bash
   git checkout development
   git pull origin development
   git checkout -b feat/nama-fitur
   ```
3. Commit perubahan:

   ```bash
   git commit -m "feat: tambah fitur baru"
   ```
4. Push ke remote branch:

   ```bash
   git push origin feat/nama-fitur
   ```
5. Buat Pull Request ke `development` branch 🚀

---

## 🪪 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).

---

### ✨ Author

**Aido Nayaka**


📧 Email: [aidonayaka4@gmail.com](mailto:aidonayaka4@gmail.com)


🌐 Website: [naycaaido.site](https://naycaaido.site)




**Ryan Handhika**


📧 Email: [ryanhandhika@gmail.com](ryanhandhika@gmail.com)


🌐 Website: [ryanhandika.site](https://ryanhandika.site)


---

> 🧠 *"Code is more than logic — it's collaboration, learning, and persistence."*

```
