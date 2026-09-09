const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const POLA_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatTanggal(tgl) {
  if (!tgl) return "-";

  const m = String(tgl).match(POLA_ISO);

  if (m) {
    return `${parseInt(m[3], 10)} ${
      BULAN[parseInt(m[2], 10) - 1]
    } ${m[1]}`;
  }

  return tgl;
}

export const ubahKeISO = (tgl) => {
  if (!tgl) return tgl;

  if (POLA_ISO.test(String(tgl))) return tgl;

  const m = String(tgl).match(/^(\d{1,2}) (\w+) (\d{4})$/);

  if (!m) return tgl;

  const i = BULAN.indexOf(m[2]);

  if (i === -1) return tgl;

  return `${m[3]}-${String(i + 1).padStart(2, "0")}-${String(
    parseInt(m[1], 10)
  ).padStart(2, "0")}`;
};

export const hariIniISO = () => {
  const d = new Date();

  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const tgl = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${bulan}-${tgl}`;
};