import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import { useToast } from "../../../component/Toast";
import { ubahKeISO } from "../../../utils/tanggal";

import { api } from "../../../services/apiClient";

function SuratFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const isEdit = Boolean(id);

  const [formSurat, setFormSurat] = useState({
    noAgenda: "",
    noSurat: "",
    tanggalSurat: "",
    tanggalDiterima: "",
    jenisId: "",
    sifatId: "",
    asal: "",
    tujuan: "",
    perihal: "",
    file: null,
    lampiran: "",
  });

  const [jenisOptions, setJenisOptions] = useState([]);
  const [sifatOptions, setSifatOptions] = useState([]);
  const [tujuanOptions, setTujuanOptions] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [saving, setSaving] = useState(false);

  // =========================
  // AMBIL MASTER TERKAIT
  // =========================
  useEffect(() => {
    Promise.all([
      api.get("/jenis-surat"),
      api.get("/sifat-surat"),
      api.get("/bidangs"),
    ])
      .then(([jenisRes, sifatRes, bidangRes]) => {
        const jenis =
          jenisRes.data?.data ||
          jenisRes.data ||
          [];
        const sifat =
          sifatRes.data?.data ||
          sifatRes.data ||
          [];
        const bidang =
          bidangRes.data?.data ||
          bidangRes.data ||
          [];

        setJenisOptions(jenis);
        setSifatOptions(sifat);

        const namaBidang = bidang.map(
          (b) => b.nama_bidang
        );

        setTujuanOptions(namaBidang);
      })
      .catch(() => {
        showToast("error", "Gagal memuat data master!");
      });
  }, []);

  // =========================
  // AMBIL DATA SURAT (UTK EDIT)
  // =========================
  const ambilSurat = async (suratId) => {
    try {
      const { data } = await api.get(
        `/surat-masuk/${suratId}`
      );
      const cari = data.data || data;

      setSelectedSurat(cari);

      setFormSurat({
        noAgenda: cari.no_agenda || "",
        noSurat: cari.no_surat || "",
        tanggalSurat:
          ubahKeISO(cari.tanggal_surat) || "",
        tanggalDiterima:
          ubahKeISO(cari.tanggal_terima) || "",
        jenisId: cari.jenis_surat_id || "",
        sifatId: cari.sifat_surat_id || "",
        asal: cari.asal_surat || "",
        tujuan: cari.tujuan_surat || "",
        perihal: cari.perihal || "",
        file: null,
        lampiran: cari.lampiran || "",
      });
    } catch {
      showToast("error", "Surat tidak ditemukan!");
      navigate("/admin/surat-masuk", { replace: true });
    }
  };

  useEffect(() => {
    if (isEdit && id) {
      ambilSurat(id);
    }
  }, [id, isEdit]);

  // =========================
  // GENERATE NO AGENDA (BARU)
  // =========================
  const generateNoAgenda = () => {
    api
      .get("/surat-masuk", { params: { page: 1, per_page: 50 } })
      .then((res) => {
        const meta = res.data?.data;
        const total = meta?.total || 0;

        setFormSurat((prev) => ({
          ...prev,
          noAgenda: String(total + 1).padStart(3, "0"),
        }));
      })
      .catch(() => {
        setFormSurat((prev) => ({
          ...prev,
          noAgenda: "001",
        }));
      });
  };

  useEffect(() => {
    if (!isEdit) generateNoAgenda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validasi = () => {
    if (
      !formSurat.noAgenda.trim() ||
      !formSurat.noSurat.trim() ||
      !formSurat.tanggalSurat ||
      !formSurat.tanggalDiterima ||
      !formSurat.jenisId ||
      !formSurat.sifatId ||
      !formSurat.asal.trim() ||
      !formSurat.tujuan.trim() ||
      !formSurat.perihal.trim() ||
      (!formSurat.file && !isEdit) ||
      !formSurat.lampiran.trim()
    ) {
      showToast("warning", "Semua data surat wajib diisi!");
      return false;
    }

    if (formSurat.file && formSurat.file.size > 5 * 1024 * 1024) {
      showToast("warning", "Ukuran file maksimal 5MB.");
      return false;
    }

    return true;
  };

  // =========================
  // TAMBAH SURAT
  // =========================
  const tambahSurat = async () => {
    if (!validasi()) return;

    setSaving(true);

    const body = new FormData();
    body.append("jenis_surat_id", formSurat.jenisId);
    body.append("sifat_surat_id", formSurat.sifatId);
    body.append("no_agenda", formSurat.noAgenda.trim());
    body.append("no_surat", formSurat.noSurat.trim());
    body.append("asal_surat", formSurat.asal.trim());
    body.append("tujuan_surat", formSurat.tujuan.trim());
    body.append("perihal", formSurat.perihal.trim());
    body.append("tanggal_surat", formSurat.tanggalSurat);
    body.append("tanggal_terima", formSurat.tanggalDiterima);
    body.append("lampiran", formSurat.lampiran.trim());
    body.append("file_surat", formSurat.file);

    try {
      await api.post("/surat-masuk", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Surat berhasil ditambahkan!");
      navigate("/admin/surat-masuk");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.file_surat?.[0] ||
        err.response?.data?.errors?.no_agenda?.[0] ||
        err.response?.data?.errors?.no_surat?.[0] ||
        err.response?.data?.message ||
        "Gagal menambahkan surat!";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SIMPAN EDIT
  // =========================
  const simpanEdit = async () => {
    if (!validasi()) return;

    setSaving(true);

    const body = new FormData();
    body.append("jenis_surat_id", formSurat.jenisId);
    body.append("sifat_surat_id", formSurat.sifatId);
    body.append("no_agenda", formSurat.noAgenda.trim());
    body.append("no_surat", formSurat.noSurat.trim());
    body.append("asal_surat", formSurat.asal.trim());
    body.append("tujuan_surat", formSurat.tujuan.trim());
    body.append("perihal", formSurat.perihal.trim());
    body.append("tanggal_surat", formSurat.tanggalSurat);
    body.append("tanggal_terima", formSurat.tanggalDiterima);
    body.append("lampiran", formSurat.lampiran.trim());
    body.append("_method", "PUT");

    if (formSurat.file) {
      body.append("file_surat", formSurat.file);
    }

    try {
      await api.post(`/surat-masuk/${selectedSurat.id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Surat berhasil diperbarui!");
      navigate("/admin/surat-masuk");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.file_surat?.[0] ||
        err.response?.data?.errors?.no_agenda?.[0] ||
        err.response?.data?.errors?.no_surat?.[0] ||
        err.response?.data?.message ||
        "Gagal memperbarui surat!";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const ubah = (field, value) => {
    setFormSurat((prev) => ({ ...prev, [field]: value }));
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
                  No. Agenda
                </label>

                <input
                  type="text"
                  placeholder="Contoh: 001"
                  value={formSurat.noAgenda}
                  onChange={(e) =>
                    ubah("noAgenda", e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  No. Surat
                </label>

                <input
                  type="text"
                  placeholder="Contoh: 001/089/SK/2026"
                  value={formSurat.noSurat}
                  onChange={(e) =>
                    ubah("noSurat", e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Jenis Surat
                </label>

                <select
                  value={formSurat.jenisId}
                  onChange={(e) =>
                    ubah("jenisId", e.target.value)
                  }
                >
                  <option value="">
                    Pilih Jenis Surat
                  </option>

                  {jenisOptions.map((j) => (
                    <option
                      key={j.id}
                      value={j.id}
                    >
                      {j.nama_jenis}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">

                <label>
                  Sifat Surat
                </label>

                <select
                  value={formSurat.sifatId}
                  onChange={(e) =>
                    ubah("sifatId", e.target.value)
                  }
                >
                  <option value="">
                    Pilih Sifat Surat
                  </option>

                  {sifatOptions.map((s) => (
                    <option
                      key={s.id}
                      value={s.id}
                    >
                      {s.nama_sifat}
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
                    ubah("tanggalSurat", e.target.value)
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
                    ubah("tanggalDiterima", e.target.value)
                  }
                />

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
                    ubah("asal", e.target.value)
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
                    ubah("tujuan", e.target.value)
                  }
                >
                  <option value="">
                    Pilih Tujuan
                  </option>

                  {tujuanOptions.map((t) => (
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
                    ubah("perihal", e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  File Surat
                </label>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const f =
                      e.target.files &&
                      e.target.files[0];

                    if (f && f.size > 5 * 1024 * 1024) {
                      showToast(
                        "warning",
                        "Ukuran file maksimal 5MB."
                      );

                      e.target.value = "";
                      return;
                    }

                    ubah("file", f || null);
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
                  selectedSurat.file_surat && (
                    <span className="file-terpilih">
                      File saat ini:{" "}
                      {selectedSurat.file_surat}
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
                    ubah("lampiran", e.target.value)
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
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : isEdit
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