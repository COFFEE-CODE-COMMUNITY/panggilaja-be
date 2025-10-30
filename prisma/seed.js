import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  //
  // STEP 1: Buat kategori
  //
  const kategori1 = await prisma.kategori.create({
    data: { kategori: "TEKNISI_ELEKTRONIK" },
  });
  const kategori2 = await prisma.kategori.create({
    data: { kategori: "EDUKASI_PELATIHAN" },
  });
  console.log("✅ Kategori created.");

  //
  // STEP 2: Buat user buyer + buyerProfile
  //
  const buyer1 = await prisma.user.create({
    data: {
      username: "buyer1",
      email: "buyer1@example.com",
      password: "password123",
      login_provider: "manual",
      roles: { create: { role: "USER" } },
      buyerProfile: {
        create: {
          fullname: "John Doe",
          foto_buyer: "john.jpg",
          alamat: "Jl. Merdeka No. 1",
          provinsi: "Jawa Barat",
          kota: "Bandung",
          kecamatan: "Cicendo",
          kode_pos: "40111",
        },
      },
    },
    include: { buyerProfile: true },
  });

  const buyer2 = await prisma.user.create({
    data: {
      username: "buyer2",
      email: "buyer2@example.com",
      password: "password456",
      login_provider: "manual",
      roles: { create: { role: "USER" } },
      buyerProfile: {
        create: {
          fullname: "Jane Smith",
          foto_buyer: "jane.jpg",
          alamat: "Jl. Pendidikan No. 45",
          provinsi: "Jawa Tengah",
          kota: "Semarang",
          kecamatan: "Candisari",
          kode_pos: "50252",
        },
      },
    },
    include: { buyerProfile: true },
  });

  console.log("✅ Buyers created.");

  //
  // STEP 3: Buat user seller + sellerProfile + skill
  //
  const seller1 = await prisma.user.create({
    data: {
      username: "seller1",
      email: "seller1@example.com",
      password: "sellerpass1",
      login_provider: "manual",
      roles: { create: { role: "SELLER" } },
      sellerProfile: {
        create: {
          deskripsi_toko: "Spesialis servis elektronik dan alat rumah tangga",
          foto_toko: "toko1.jpg",
          kategori_toko: "TEKNISI_ELEKTRONIK",
          pengalaman: "5 tahun di bidang elektronik",
          rating_rata_rata: 4.6,
          skill: {
            create: [
              { skill: "Servis Elektronik" },
              { skill: "Instalasi Listrik" },
            ],
          },
        },
      },
    },
    include: { sellerProfile: { include: { skill: true } } },
  });

  const seller2 = await prisma.user.create({
    data: {
      username: "seller2",
      email: "seller2@example.com",
      password: "sellerpass2",
      login_provider: "manual",
      roles: { create: { role: "SELLER" } },
      sellerProfile: {
        create: {
          deskripsi_toko: "Kursus dan pelatihan profesional",
          foto_toko: "toko2.jpg",
          kategori_toko: "EDUKASI_PELATIHAN",
          pengalaman: "3 tahun pengalaman mengajar",
          rating_rata_rata: 4.8,
          skill: {
            create: [{ skill: "Mengajar" }, { skill: "Public Speaking" }],
          },
        },
      },
    },
    include: { sellerProfile: { include: { skill: true } } },
  });

  console.log("✅ Sellers created with profiles and skills.");

  //
  // STEP 4: Buat services untuk masing-masing seller
  //
  const sellerProfile1 = seller1.sellerProfile;
  const sellerProfile2 = seller2.sellerProfile;

  for (let i = 1; i <= 5; i++) {
    await prisma.service.create({
      data: {
        seller_id: sellerProfile1.id, // ✅ pakai ID dari SellerProfile, bukan User
        nama_jasa: `Servis Elektronik ${i}`,
        deskripsi: `Perbaikan perangkat elektronik ${i} seperti AC, kulkas, dan mesin cuci.`,
        base_price: 100 * i,
        top_price: 200 * i,
        foto_product: `elektronik_${i}.jpg`,
        status: "active",
        kategori_id: kategori1.id,
      },
    });
  }

  for (let i = 1; i <= 5; i++) {
    await prisma.service.create({
      data: {
        seller_id: sellerProfile2.id, // ✅ pakai ID dari SellerProfile
        nama_jasa: `Kelas Edukasi ${i}`,
        deskripsi: `Pelatihan atau kursus edukasi ${i}, dengan mentor berpengalaman.`,
        base_price: 150 * i,
        top_price: 300 * i,
        foto_product: `edukasi_${i}.jpg`,
        status: "active",
        kategori_id: kategori2.id,
      },
    });
  }

  console.log("✅ Services created for both sellers.");

  //
  // STEP 5: Buat orders (Buyer membeli dari Seller)
  //
  const allServicesSeller1 = await prisma.service.findMany({
    where: { seller_id: sellerProfile1.id },
  });

  const allServicesSeller2 = await prisma.service.findMany({
    where: { seller_id: sellerProfile2.id },
  });

  await prisma.order.createMany({
    data: [
      {
        service_id: allServicesSeller1[0].id,
        buyer_id: buyer1.buyerProfile.id, // ✅ pakai ID BuyerProfile
        seller_id: sellerProfile1.id, // ✅ pakai ID SellerProfile
        pesan_tambahan: "Tolong cepat ya, kulkas saya rusak parah.",
        status: "completed",
        total_harga: 300,
      },
      {
        service_id: allServicesSeller2[0].id,
        buyer_id: buyer2.buyerProfile.id, // ✅ pakai ID BuyerProfile
        seller_id: sellerProfile2.id, // ✅ pakai ID SellerProfile
        pesan_tambahan: "Butuh sesi tambahan untuk latihan public speaking.",
        status: "completed",
        total_harga: 450,
      },
    ],
  });

  console.log("✅ Orders created successfully.");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
