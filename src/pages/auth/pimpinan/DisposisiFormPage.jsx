import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import {
  formatTanggal,
  hariIniISO,
} from "../../../utils/tanggal";

function PimpinanDisposisiFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [surat, setSurat] = useState(null);

  const [formDisposisi, setFormDisposisi] = useState({
    tujuan: "",
    instruksi: "",
    catatan: "",
  });

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    const cari =
      data.find((s) => String(s.id) === String(id)) || null;

    if (!cari) {
      alert("Surat tidak ditemukan!");
      navigate("/pimpinan/surat-masuk", { replace: true });
      return;
    }

    setSurat(cari);
  }, [id, navigate]);

  // =========================
  // OPSI TUJUAN (DARI MASTER USER)
  // =========================

  const opsiTujuan = () => {
    const data =
      JSON.parse(
        localStorage.getItem("masterUser")
      ) || [];

    if (data.length > 0) {
      return data.map((u) => u.nama);
    }

    return [
      "Pengguna 1",
      "Pengguna 2",
      "Pengguna 3",
    ];
  };

  // =========================
  // KIRIM DISPOSISI
  // =========================

  const kirimDisposisi = () => {
    if (!formDisposisi.tujuan || !formDisposisi.instruksi) {
      alert("Tujuan dan instruksi wajib diisi!");
      return;
    }

    const tanggalISO = hariIniISO();

    const disposisiBaru = {
      id: Date.now(),
      noAgenda: surat.noAgenda,
      noSurat: surat.noSurat,
      asal: surat.asal,
      perihal: surat.perihal,
      tanggal: surat.tanggalDiterima,
      pengguna: formDisposisi.tujuan,
      instruksi: formDisposisi.instruksi,
      catatan: formDisposisi.catatan,
      tanggalDisposisi: tanggalISO,
      status: "Menunggu",
    };

    // =========================
    // SIMPAN KE DATA DISPOSISI
    // =========================

    const dataDisposisiLama =
      JSON.parse(
        localStorage.getItem("dataDisposisi")
      ) || [];

    localStorage.setItem(
      "dataDisposisi",
      JSON.stringify([
        ...dataDisposisiLama,
        disposisiBaru,
      ])
    );

    // =========================
    // UPDATE SURAT
    // =========================

    const dataSurat =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    const suratUpdate = dataSurat.map((item) =>
      item.id === surat.id
        ? {
            ...item,
            status: "Didisposisikan",
            keputusan: "",

            disposisi: {
              tujuan: formDisposisi.tujuan,
              instruksi: formDisposisi.instruksi,
              catatan: formDisposisi.catatan,
              tanggalDisposisi: tanggalISO,
            },

            timeline: [
              ...(item.timeline || []),
              {
                label: "Disposisi dibuat",
                tanggal: tanggalISO,
              },
            ],
          }
        : item
    );

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(suratUpdate)
    );

    alert("Disposisi berhasil dikirim!");
    navigate("/pimpinan/surat-masuk");
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
                <strong>{surat.noAgenda}</strong>
              </div>

              <div className="detail-row">
                <span>No. Surat</span>
                <strong>{surat.noSurat}</strong>
              </div>

              <div className="detail-row">
                <span>Perihal</span>
                <strong>{surat.perihal}</strong>
              </div>

              <div className="detail-row">
                <span>Asal Surat</span>
                <strong>{surat.asal}</strong>
              </div>

              <div className="detail-row">
                <span>Jenis Surat</span>
                <strong>{surat.jenis || "-"}</strong>
              </div>

              <div className="detail-row">
                <span>Sifat Surat</span>
                <strong>{surat.sifat || "-"}</strong>
              </div>

              <div className="detail-row">
                <span>Tanggal Diterima</span>
                <strong>{formatTanggal(surat.tanggalDiterima)}</strong>
              </div>

            </div>

            {/* KOLOM FORM */}

            <div className="disposisi-form-inputs">

              <div className="form-group">

                <label>Tujuan Kepada</label>

                <select
                  value={formDisposisi.tujuan}
                  onChange={(e) =>
                    setFormDisposisi({
                      ...formDisposisi,
                      tujuan: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Pilih penerima
                  </option>

                  {opsiTujuan().map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>

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