import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Step 1: Buat Kategori (dengan enum baru)
  const kategori1 = await prisma.kategori.create({
    data: {
      kategori: "TEKNISI_ELEKTRONIK", // Dari enum baru
    },
  });

  const kategori2 = await prisma.kategori.create({
    data: {
      kategori: "EDUKASI_PELATIHAN", // Dari enum baru
    },
  });

  // Step 2: Buat User (2 user)
  const user1 = await prisma.user.create({
    data: {
      username: "user1",
      email: "user1@example.com",
      password: "password123", // Di produksi harus di-hash
      fullname: "John Doe",
      foto_user: "user1.jpg",
      login_provider: "manual",
      alamat: {
        create: {
          alamat: "Jl. Contoh No. 1",
          provinsi: "Jawa Barat",
          kota: "Bandung",
          kecamatan: "Sukajadi",
          kode_pos: "40161",
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "user2",
      email: "user2@example.com",
      password: "password456",
      fullname: "Jane Smith",
      foto_user: "user2.jpg",
      login_provider: "google",
    },
  });

  console.log("✅ Users created successfully.");

  // Step 3: Buat Seller (2 seller) dan Skill
  const seller1 = await prisma.seller.create({
    data: {
      username: "seller1",
      email: "seller1@example.com",
      password: "sellerpassword1",
      foto_user: "seller1.jpg",
      status: "active",
      skill: "Elektronik dan Teknisi",
      pengalaman: "5 tahun pengalaman di bidang servis elektronik",
      rating_rata_rata: 4.5,
      foto_toko: "toko1.jpg",
      nama_toko: "TeknoFix",
      deskripsi_toko:
        "Spesialis servis elektronik dan perbaikan alat rumah tangga",
      kategori_toko: "TEKNISI_ELEKTRONIK",
      alamat: "Jl. Teknologi No. 10",
      provinsi: "Jawa Timur",
      kota: "Surabaya",
      kecamatan: "Wonokromo",
      kode_pos: "60242",
      skills: {
        create: [{ skill: "WEB" }, { skill: "DATA" }],
      },
    },
  });

  const seller2 = await prisma.seller.create({
    data: {
      username: "seller2",
      email: "seller2@example.com",
      password: "sellerpassword2",
      foto_user: "seller2.jpg",
      status: "active",
      skill: "Pengajaran dan Edukasi",
      pengalaman: "3 tahun sebagai tutor akademik",
      rating_rata_rata: 4.7,
      foto_toko: "toko2.jpg",
      nama_toko: "EduSmart",
      deskripsi_toko: "Kursus privat dan pelatihan keterampilan",
      kategori_toko: "EDUKASI_PELATIHAN",
      alamat: "Jl. Pendidikan No. 20",
      provinsi: "DKI Jakarta",
      kota: "Jakarta Selatan",
      kecamatan: "Kebayoran Baru",
      kode_pos: "12110",
      skills: {
        create: [{ skill: "WRITING" }, { skill: "MARKETING" }],
      },
    },
  });

  console.log("✅ Sellers and Skills created successfully.");

  // Step 4: Buat Services
  // Seller 1 - Teknisi Elektronik
  for (let i = 1; i <= 10; i++) {
    await prisma.service.create({
      data: {
        seller_id: seller1.id,
        nama_jasa: `Servis Elektronik ${i}`,
        deskripsi: `Perbaikan perangkat elektronik ${i}, termasuk AC, kulkas, dan mesin cuci.`,
        base_price: 100 * i,
        top_price: 200 * i,
        foto_product: `elektronik_service${i}.jpg`,
        status: "active",
        kategori_id: kategori1.id, // Kategori: TEKNISI_ELEKTRONIK
      },
    });
  }

  // Seller 2 - Edukasi & Pelatihan
  for (let i = 1; i <= 10; i++) {
    await prisma.service.create({
      data: {
        seller_id: seller2.id,
        nama_jasa: `Kelas Edukasi ${i}`,
        deskripsi: `Pelatihan atau kursus edukasi ${i}, dengan instruktur berpengalaman.`,
        base_price: 150 * i,
        top_price: 300 * i,
        foto_product: `edukasi_service${i}.jpg`,
        status: "active",
        kategori_id: kategori2.id, // Kategori: EDUKASI_PELATIHAN
      },
    });
  }

  console.log("✅ Services created successfully. Total: 20 services.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
