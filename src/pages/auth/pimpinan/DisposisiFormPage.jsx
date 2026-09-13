import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import {
  formatTanggal,
  hariIniISO,
} from "../../../utils/tanggal";
import { useToast } from "../../../component/Toast";
import { api } from "../../../services/apiClient";

function PimpinanDisposisiFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [surat, setSurat] = useState(null);
  const [daftarUser, setDaftarUser] = useState([]);

  const [formDisposisi, setFormDisposisi] = useState({
    kepada_user: "",
    instruksi: "",
    catatan: "",
  });

  useEffect(() => {
    api
      .get(`/surat-masuk/${id}`)
      .then((res) => setSurat(res.data.data || res.data))
      .catch(() => {
        showToast("error", "Surat tidak ditemukan!");
        navigate("/pimpinan/surat-masuk", { replace: true });
      });

    api
      .get("/users/opsi-disposisi")
      .then((res) => {
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : res.data?.data?.data || [];
        setDaftarUser(list);
      })
      .catch(() => setDaftarUser([]));
  }, [id, navigate, showToast]);

  const kirimDisposisi = async () => {
    if (!formDisposisi.kepada_user || !formDisposisi.instruksi) {
      showToast("warning", "Tujuan dan instruksi wajib diisi!");
      return;
    }

    try {
      await api.post("/disposisi", {
        surat_masuk_id: surat.id,
        kepada_user: formDisposisi.kepada_user,
        tanggal_disposisi: hariIniISO(),
        instruksi: formDisposisi.instruksi,
        catatan: formDisposisi.catatan,
      });

      showToast("success", "Disposisi berhasil dikirim!");
      navigate("/pimpinan/surat-masuk");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message ||
          Object.values(err.response?.data?.errors || {}).flat()[0] ||
          "Gagal mengirim disposisi!"
      );
    }
  };

  if (!surat) return null;

  return (
    <DashboardLayout title="Buat Disposisi">

      <div className="surat-page">

        <div className="surat-header">

          <div>

            <h2>Buat Disposisi</h2>

            <p>
              Distribusikan surat kepada pegawai
              terkait
            </p>

          </div>

          <button
            className="action-page-back"
            onClick={() => navigate("/pimpinan/surat-masuk")}
          >
            &larr; Kembali
          </button>

        </div>

        <div className="action-page-card">

          <div className="disposisi-form-grid">

            {/* KOLOM INFO SURAT */}

            <div className="disposisi-form-info">

              <h3>Informasi Surat</h3>

              <div className="detail-row">
                <span>No. Agenda</span>
                <strong>{surat.no_agenda}</strong>
              </div>

              <div className="detail-row">
                <span>No. Surat</span>
                <strong>{surat.no_surat}</strong>
              </div>

              <div className="detail-row">
                <span>Perihal</span>
                <strong>{surat.perihal}</strong>
              </div>

              <div className="detail-row">
                <span>Asal Surat</span>
                <strong>{surat.asal_surat}</strong>
              </div>

              <div className="detail-row">
                <span>Jenis Surat</span>
                <strong>{surat.jenis_surat?.nama_jenis || "-"}</strong>
              </div>

              <div className="detail-row">
                <span>Sifat Surat</span>
                <strong>{surat.sifat_surat?.nama_sifat || "-"}</strong>
              </div>

              <div className="detail-row">
                <span>Tanggal Diterima</span>
                <strong>{formatTanggal(surat.tanggal_terima)}</strong>
              </div>

            </div>

            {/* KOLOM FORM */}

            <div className="disposisi-form-inputs">

              <div className="form-group">

                <label>Tujuan Kepada</label>

                <select
                  value={formDisposisi.kepada_user}
                  onChange={(e) =>
                    setFormDisposisi({
                      ...formDisposisi,
                      kepada_user: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Pilih penerima
                  </option>

                  {daftarUser.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">

                <label>Tanggal Disposisi</label>

                <input
                  type="date"
                  value={hariIniISO()}
                  disabled
                />

              </div>

              <div className="form-group">

                <label>Instruksi</label>

                <textarea
                  rows="4"
                  placeholder="Contoh: Segera ditindaklanjuti"
                  value={formDisposisi.instruksi}
                  onChange={(e) =>
                    setFormDisposisi({
                      ...formDisposisi,
                      instruksi: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>Catatan</label>

                <textarea
                  rows="3"
                  placeholder="Contoh: Mohon diproses dengan baik"
                  value={formDisposisi.catatan}
                  onChange={(e) =>
                    setFormDisposisi({
                      ...formDisposisi,
                      catatan: e.target.value,
                    })
                  }
                />

              </div>

            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn-tutup"
              onClick={() => navigate("/pimpinan/surat-masuk")}
            >
              Batal
            </button>

            <button
              className="btn-simpan"
              onClick={kirimDisposisi}
            >
              Kirim Disposisi
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default PimpinanDisposisiFormPage;