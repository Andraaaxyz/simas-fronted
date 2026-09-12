import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import { useToast } from "../../../component/Toast";
import { ubahKeISO } from "../../../utils/tanggal";

// =========================
// BACA FILE JADI BASE64
// =========================

const bacaFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () =>
      resolve({
        nama: file.name,
        tipe: file.type,
        data: reader.result,
      });

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// =========================
// HELPER OPSI MASTER
// =========================

function opsiJenisSurat() {
  const data =
    JSON.parse(
      localStorage.getItem("masterJenisSurat")
    ) || [];

  return data;
}

function opsiSifatSurat() {
  const data =
    JSON.parse(
      localStorage.getItem("masterSifatSurat")
    ) || [];

  return data;
}

function opsiTujuan() {
  const pimpinan =
    JSON.parse(localStorage.getItem("masterPimpinan")) || [];
  const bidang =
    JSON.parse(localStorage.getItem("masterBidang")) || [];

  const daftar = [
    ...pimpinan.map((p) => p.nama),
    ...bidang.map((b) => b.nama),
  ];

  const unik = [...new Set(daftar.filter(Boolean))];

  if (unik.length > 0) {
    return unik;
  }

  return [
    "Ir. Ahmad Fauzi, M.Si",
    "Dra. Siti Rahayu, M.M",
    "Tata Usaha",
    "Kepegawaian",
    "Umum",
    "Keuangan",
  ];
}

function SuratFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const isEdit = Boolean(id);

  const [formSurat, setFormSurat] = useState({
    noSurat: "",
    tanggalSurat: "",
    tanggalDiterima: "",
    jenis: "",
    sifat: "",
    asal: "",
    tujuan: "",
    perihal: "",
    file: "",
    lampiran: "",
  });

  const [selectedSurat, setSelectedSurat] = useState(null);

  // =========================
  // AMBIL DATA SURAT (UTK EDIT)
  // =========================

  useEffect(() => {
    if (!isEdit) return;

    const data =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    const cari = data.find((s) => String(s.id) === String(id));

    if (!cari) {
      showToast("error", "Surat tidak ditemukan!");
      navigate("/admin/surat-masuk", { replace: true });
      return;
    }

    setSelectedSurat(cari);

    setFormSurat({
      noSurat: cari.noSurat || "",
      tanggalSurat: ubahKeISO(cari.tanggalSurat) || "",
      tanggalDiterima: ubahKeISO(cari.tanggalDiterima) || "",
      jenis: cari.jenis || "",
      sifat: cari.sifat || "",
      asal: cari.asal || "",
      tujuan: cari.tujuan || "",
      perihal: cari.perihal || "",
      file: "",
      lampiran: cari.lampiran || "",
    });
  }, [id, isEdit, navigate, showToast]);

  // =========================
  // GENERATE NO AGENDA
  // =========================

  const generateNoAgenda = (data) => {
    const max = data.reduce((acc, item) => {
      const n = parseInt(item.noAgenda, 10) || 0;
      return n > acc ? n : acc;
    }, 0);

    return String(max + 1).padStart(3, "0");
  };

  // =========================
  // TAMBAH SURAT
  // =========================

  const tambahSurat = async () => {
    if (
      !formSurat.noSurat ||
      !formSurat.tanggalSurat ||
      !formSurat.tanggalDiterima ||
      !formSurat.jenis ||
      !formSurat.sifat ||
      !formSurat.asal ||
      !formSurat.tujuan ||
      !formSurat.perihal ||
      !formSurat.file ||
      !formSurat.lampiran
    ) {
      showToast("warning", "Semua data surat wajib diisi!");
      return;
    }

    const dataSurat =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    const fileSimpan = await bacaFile(formSurat.file);

    const suratBaru = {
      id: Date.now(),
      noAgenda: generateNoAgenda(dataSurat),
      noSurat: formSurat.noSurat,
      tanggalSurat: formSurat.tanggalSurat,
      tanggalDiterima: formSurat.tanggalDiterima,
      jenis: formSurat.jenis,
      sifat: formSurat.sifat,
      asal: formSurat.asal,
      tujuan: formSurat.tujuan,
      perihal: formSurat.perihal,
      file: fileSimpan,
      lampiran: formSurat.lampiran,
      status: "Baru",
      disposisi: null,
      timeline: [
        {
          label: "Surat diterima",
          tanggal: formSurat.tanggalDiterima,
        },
      ],
    };

    const dataBaru = [...dataSurat, suratBaru];

    try {
      localStorage.setItem(
        "dataSurat",
        JSON.stringify(dataBaru)
      );
    } catch {
      showToast("error", "Gagal menyimpan: file terlalu besar untuk penyimpanan lokal.");
      return;
    }

    showToast("success", "Surat berhasil ditambahkan!");
    navigate("/admin/surat-masuk");
  };

  // =========================
  // SIMPAN EDIT
  // =========================

  const simpanEdit = async () => {
    if (
      !formSurat.noSurat ||
      !formSurat.tanggalSurat ||
      !formSurat.tanggalDiterima ||
      !formSurat.jenis ||
      !formSurat.sifat ||
      !formSurat.asal ||
      !formSurat.tujuan ||
      !formSurat.perihal ||
      (!formSurat.file && !selectedSurat.file) ||
      !formSurat.lampiran
    ) {
      showToast("warning", "Semua data surat wajib diisi!");
      return;
    }

    const dataSurat =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    const fileSimpan = formSurat.file
      ? await bacaFile(formSurat.file)
      : selectedSurat.file;

    const dataBaru = dataSurat.map((item) =>
      String(item.id) === String(selectedSurat.id)
        ? {
            ...item,
            noSurat: formSurat.noSurat,
            tanggalSurat: formSurat.tanggalSurat,
            tanggalDiterima: formSurat.tanggalDiterima,
            jenis: formSurat.jenis,
            sifat: formSurat.sifat,
            asal: formSurat.asal,
            tujuan: formSurat.tujuan,
            perihal: formSurat.perihal,
            file: fileSimpan,
            lampiran: formSurat.lampiran,
          }
        : item
    );

    try {
      localStorage.setItem(
        "dataSurat",
        JSON.stringify(dataBaru)
      );
    } catch {
      showToast("error", "Gagal menyimpan: file terlalu besar untuk penyimpanan lokal.");
      return;
    }

    showToast("success", "Surat berhasil diperbarui!");
    navigate("/admin/surat-masuk");
  };

  return (
    <DashboardLayout title={isEdit ? "Edit Surat" : "Tambah Surat"}>

      <div className="surat-page">

        <div className="surat-header">

          <div>

            <h2>
              {isEdit ? "Edit Surat" : "Tambah Surat"}
            </h2>

            <p>
              {isEdit
                ? "Perbarui data surat"
                : "Masukkan data surat baru"}
            </p>

          </div>

          <button
            className="action-page-back"
            onClick={() => navigate("/admin/surat-masuk")}
          >
            &larr; Kembali
          </button>

        </div>

        <div className="action-page-card">

          <div className="form-content form-2kolom">

            <div className="form-grid">

              <div className="form-group">

                <label>
                  No. Surat
                </label>

                <input
                  type="text"
                  placeholder="Contoh: 001/089/SK/2026"
                  value={formSurat.noSurat}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      noSurat:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Jenis Surat
                </label>

                <select
                  value={formSurat.jenis}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      jenis: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Pilih Jenis Surat
                  </option>

                  {opsiJenisSurat().length > 0
                    ? opsiJenisSurat().map((j) => (
                        <option
                          key={j.id}
                          value={j.nama}
                        >
                          {j.nama}
                        </option>
                      ))
                    : [
                        "Surat Edaran",
                        "Surat Undangan",
                        "Surat Keputusan",
                        "Surat Permohonan",
                      ].map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                </select>

              </div>

              <div className="form-group">

                <label>
                  Tanggal Surat
                </label>

                <input
                  type="date"
                  value={formSurat.tanggalSurat}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      tanggalSurat:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Tanggal Diterima
                </label>

                <input
                  type="date"
                  value={formSurat.tanggalDiterima}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      tanggalDiterima:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Sifat Surat
                </label>

                <select
                  value={formSurat.sifat}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      sifat: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Pilih Sifat Surat
                  </option>

                  {opsiSifatSurat().length > 0
                    ? opsiSifatSurat().map((s) => (
                        <option
                          key={s.id}
                          value={s.nama}
                        >
                          {s.nama}
                        </option>
                      ))
                    : [
                        "Biasa",
                        "Penting",
                        "Segera",
                        "Rahasia",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                </select>

              </div>

              <div className="form-group">

                <label>
                  Asal Surat
                </label>

                <input
                  type="text"
                  placeholder="Contoh: Dinas Pendidikan"
                  value={formSurat.asal}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      asal: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Tujuan Surat
                </label>

                <select
                  value={formSurat.tujuan}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      tujuan: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Pilih Tujuan
                  </option>

                  {opsiTujuan().map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group form-span-2">

                <label>
                  Perihal
                </label>

                <input
                  type="text"
                  placeholder="Masukkan perihal surat"
                  value={formSurat.perihal}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      perihal: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  File Surat
                </label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const f =
                      e.target.files &&
                      e.target.files[0];

                    if (
                      f &&
                      f.size > 2 * 1024 * 1024
                    ) {
                      showToast(
                        "warning",
                        "Ukuran file maksimal 2MB."
                      );

                      e.target.value = "";
                      return;
                    }

                    setFormSurat({
                      ...formSurat,
                      file: f || "",
                    });
                  }}
                />

                {formSurat.file ? (
                  <span className="file-terpilih">
                    File dipilih:{" "}
                    {formSurat.file.name}
                  </span>
                ) : (
                  isEdit &&
                  selectedSurat &&
                  selectedSurat.file && (
                    <span className="file-terpilih">
                      File saat ini:{" "}
                      {typeof selectedSurat.file ===
                      "string"
                        ? selectedSurat.file
                        : selectedSurat.file.nama}
                    </span>
                  )
                )}

              </div>

              <div className="form-group">

                <label>
                  Lampiran
                </label>

                <input
                  type="text"
                  placeholder="Lampiran surat"
                  value={formSurat.lampiran}
                  onChange={(e) =>
                    setFormSurat({
                      ...formSurat,
                      lampiran:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn-tutup"
              onClick={() => navigate("/admin/surat-masuk")}
            >
              Batal
            </button>

            <button
              className="btn-simpan"
              onClick={isEdit ? simpanEdit : tambahSurat}
            >
              {isEdit
                ? "Simpan Perubahan"
                : "Tambah Surat"}
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default SuratFormPage;