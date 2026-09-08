// =========================
// MASTER DATA SERVICE
// =========================
// Menyediakan helper untuk mengelola data
// master (pimpinan, user, jenis surat,
// sifat surat, bidang) di localStorage.

const KEYS = {
  pimpinan: "masterPimpinan",
  user: "masterUser",
  jenisSurat: "masterJenisSurat",
  sifatSurat: "masterSifatSurat",
  bidang: "masterBidang",
};

// =========================
// SEED DATA AWAL
// =========================
function seedData() {
  const seeds = {
    pimpinan: [
      {
        id: 1,
        nama: "Ir. Ahmad Fauzi, M.Si",
        nip: "197501012005011002",
        email: "ahmad.fauzi@simas.com",
        username: "pimpinan",
        password: "pimpinan123",
        status: "Aktif",
      },
      {
        id: 2,
        nama: "Dra. Siti Rahayu, M.M",
        nip: "196803122000032001",
        email: "siti.rahayu@simas.com",
        username: "pimpinan2",
        password: "pimpinan123",
        status: "Aktif",
      },
    ],
    user: [
      {
        id: 1,
        nama: "Rina Wulandari, S.Kom",
        nip: "199001152020012001",
        bidang: "Tata Usaha",
        email: "rina@simas.com",
        password: "pengguna123",
        status: "Aktif",
      },
      {
        id: 2,
        nama: "Budi Santoso, S.E",
        nip: "199203102020012002",
        bidang: "Kepegawaian",
        email: "budi@simas.com",
        password: "pengguna123",
        status: "Aktif",
      },
      {
        id: 3,
        nama: "Dewi Lestari, S.Sos",
        nip: "199502202020012003",
        bidang: "Umum",
        email: "dewi@simas.com",
        password: "pengguna123",
        status: "Nonaktif",
      },
    ],
    jenisSurat: [
      { id: 1, nama: "Surat Edaran" },
      { id: 2, nama: "Surat Undangan" },
      { id: 3, nama: "Surat Keputusan" },
      { id: 4, nama: "Surat Permohonan" },
    ],
    sifatSurat: [
      { id: 1, nama: "Biasa" },
      { id: 2, nama: "Penting" },
      { id: 3, nama: "Rahasia" },
      { id: 4, nama: "Sangat Rahasia" },
    ],
    bidang: [
      { id: 1, nama: "Tata Usaha" },
      { id: 2, nama: "Kepegawaian" },
      { id: 3, nama: "Umum" },
      { id: 4, nama: "Keuangan" },
    ],
  };

  Object.keys(KEYS).forEach((key) => {
    const existing = localStorage.getItem(KEYS[key]);

    if (!existing || existing === "null") {
      localStorage.setItem(
        KEYS[key],
        JSON.stringify(seeds[key])
      );
    }
  });
}

seedData();

// Bersihkan sisa data yang tertulis pada key
// "undefined" akibat bug pemakaian key di versi lama.
localStorage.removeItem("undefined");

// =========================
// GET DATA
// =========================
export const getMasterData = (key) => {
  const data = localStorage.getItem(key);

  return data ? JSON.parse(data) : [];
};

// =========================
// TAMBAH DATA
// =========================
export const tambahMasterData = (key, item) => {
  const list = getMasterData(key);
  const baru = {
    id: Date.now(),
    ...item,
  };

  const data = [...list, baru];

  localStorage.setItem(key, JSON.stringify(data));

  return data;
};

// =========================
// UPDATE DATA
// =========================
export const updateMasterData = (key, id, item) => {
  const list = getMasterData(key);

  const data = list.map((it) =>
    it.id === id ? { ...it, ...item } : it
  );

  localStorage.setItem(key, JSON.stringify(data));

  return data;
};

// =========================
// HAPUS DATA
// =========================
export const hapusMasterData = (key, id) => {
  const list = getMasterData(key);

  const data = list.filter((it) => it.id !== id);

  localStorage.setItem(key, JSON.stringify(data));

  return data;
};

// =========================
// EXPORT KEYS
// =========================
export const MASTER_KEYS = KEYS;
