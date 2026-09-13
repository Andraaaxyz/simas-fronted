import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download } from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import { formatTanggal } from "../../../utils/tanggal";
import { useToast } from "../../../component/Toast";

import { api } from "../../../services/apiClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const labelStatus = (status) =>
  status === "baru"
    ? "Baru"
    : status === "didisposisi"
    ? "Didisposisi"
    : status === "diarsipkan"
    ? "Diarsipkan"
    : status || "-";

function PenggunaSuratDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [surat, setSurat] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [disposisi, setDisposisi] = useState(null);

  useEffect(() => {
    let aktif = true;

    api
      .get(`/surat-masuk/${id}`)
      .then((res) => {
        if (aktif) setSurat(res.data.data || res.data);
      })
      .catch(() => {
        showToast("error", "Surat tidak ditemukan!");
        navigate("/pengguna/surat-masuk", { replace: true });
      });

    api
      .get(`/surat-masuk/${id}/timeline`)
      .then((res) => {
        if (aktif) setTimeline(res.data.data || []);
      })
      .catch(() => setTimeline([]));

    api
      .get("/disposisi", { params: { per_page: 50 } })
      .then((res) => {
        const list = res.data?.data?.data || res.data?.data || [];

        const cari = list.find(
          (d) => String(d.surat_masuk_id) === String(id)
        );

        if (aktif) setDisposisi(cari || null);
      })
      .catch(() => setDisposisi(null));

    return () => {
      aktif = false;
    };
  }, [id, navigate, showToast]);

  if (!surat) return null;

  const baseStorage = API_BASE.replace(/\/api\/?$/, "");

  const urlFile = surat.file_surat
    ? `${baseStorage}/storage/${surat.file_surat}`
    : "";

  const namaFile = surat.file_surat
    ? surat.file_surat.split("/").pop()
    : "";

  return (
    <DashboardLayout title="Lihat Surat">

      <div className="surat-page">

        <div className="surat-header">

          <div>

            <h2>Detail Surat</h2>

            <p>
              Informasi surat masuk
            </p>

          </div>

          <button
            className="action-page-back"
            onClick={() => navigate("/pengguna/surat-masuk")}
          >
            &larr; Kembali
          </button>

        </div>

        <div className="action-page-card">

          <div className="detail-content detail-grid">

            <div className="detail-row">
              <span>No. Agenda</span>
              <strong>
                {surat.no_agenda}
              </strong>
            </div>

            <div className="detail-row">
              <span>No. Surat</span>
              <strong>
                {surat.no_surat}
              </strong>
            </div>

            <div className="detail-row">
              <span>Tanggal Surat</span>
              <strong>
                {formatTanggal(
                  surat.tanggal_surat
                )}
              </strong>
            </div>

            <div className="detail-row">
              <span>Tanggal Diterima</span>
              <strong>
                {formatTanggal(
                  surat.tanggal_terima
                )}
              </strong>
            </div>

            <div className="detail-row">
              <span>Jenis Surat</span>
              <strong>
                {surat.jenis_surat?.nama_jenis || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Sifat Surat</span>
              <strong>
                {surat.sifat_surat?.nama_sifat || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Asal Surat</span>
              <strong>
                {surat.asal_surat}
              </strong>
            </div>

            <div className="detail-row">
              <span>Tujuan Surat</span>
              <strong>
                {surat.tujuan_surat || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Perihal</span>
              <strong>
                {surat.perihal}
              </strong>
            </div>

            <div className="detail-row">
              <span>File Surat</span>
              <strong>
                {urlFile ? (
                  <a
                    className="file-download-link"
                    href={urlFile}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download size={15} />
                    {namaFile}
                  </a>
                ) : (
                  "-"
                )}
              </strong>
            </div>

            <div className="detail-row">
              <span>Lampiran</span>
              <strong>
                {surat.lampiran || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Status</span>
              <strong>
                {labelStatus(surat.status)}
              </strong>
            </div>

          </div>

          {disposisi && (
            <div className="detail-disposisi-info">
              <h3>Informasi Disposisi</h3>

              <div className="detail-row">
                <span>Tujuan</span>
                <strong>
                  {disposisi.penerima?.nama ||
                    disposisi.kepada_user ||
                    "-"}
                </strong>
              </div>

              <div className="detail-row">
                <span>Instruksi</span>
                <strong>
                  {disposisi.instruksi || "-"}
                </strong>
              </div>

              <div className="detail-row">
                <span>Catatan</span>
                <strong>
                  {disposisi.catatan || "-"}
                </strong>
              </div>
            </div>
          )}

          {timeline.length > 0 && (
            <div className="detail-timeline">
              <h3>Riwayat</h3>

              {timeline.map((tl, i) => (
                <div
                  className="timeline-item"
                  key={i}
                >
                  <div className="timeline-dot" />

                  <div>
                    <strong>{tl.aktivitas}</strong>
                    <span>{formatTanggal(tl.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="modal-footer">

            <button
              className="btn-tutup"
              onClick={() => navigate("/pengguna/surat-masuk")}
            >
              Kembali
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default PenggunaSuratDetailPage;