import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import FileDokumen from "../../../component/FileDokumen";
import { formatTanggal } from "../../../utils/tanggal";

function PenggunaSuratDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [surat, setSurat] = useState(null);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    const cari = data.find((s) => String(s.id) === String(id));

    if (!cari) {
      alert("Surat tidak ditemukan!");
      navigate("/pengguna/surat-masuk", { replace: true });
      return;
    }

    setSurat(cari);
  }, [id, navigate]);

  if (!surat) return null;

  return (
    <DashboardLayout title="Lihat Surat">

      <div className="surat-page">

        <button
          className="action-page-back"
          onClick={() => navigate("/pengguna/surat-masuk")}
        >
          &larr; Kembali
        </button>

        <div className="action-page-card">

          <div className="modal-header">

            <div>
              <h2>Detail Surat</h2>

              <p>
                Informasi surat masuk
              </p>
            </div>

          </div>

          <div className="detail-content">

            <div className="detail-row">
              <span>No. Agenda</span>
              <strong>
                {surat.noAgenda}
              </strong>
            </div>

            <div className="detail-row">
              <span>No. Surat</span>
              <strong>
                {surat.noSurat}
              </strong>
            </div>

            <div className="detail-row">
              <span>Tanggal Surat</span>
              <strong>
                {formatTanggal(
                  surat.tanggalSurat
                )}
              </strong>
            </div>

            <div className="detail-row">
              <span>Tanggal Diterima</span>
              <strong>
                {formatTanggal(
                  surat.tanggalDiterima
                )}
              </strong>
            </div>

            <div className="detail-row">
              <span>Jenis Surat</span>
              <strong>
                {surat.jenis || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Sifat Surat</span>
              <strong>
                {surat.sifat || "-"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Asal Surat</span>
              <strong>
                {surat.asal}
              </strong>
            </div>

            <div className="detail-row">
              <span>Tujuan Surat</span>
              <strong>
                {surat.tujuan || "-"}
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
                <FileDokumen
                  value={surat.file}
                />
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
                {surat.status}
              </strong>
            </div>

          </div>

          {surat.disposisi && (
            <div className="detail-disposisi-info">
              <h3>Informasi Disposisi</h3>

              <div className="detail-row">
                <span>Tujuan</span>
                <strong>
                  {surat.disposisi
                    .tujuan || "-"}
                </strong>
              </div>

              <div className="detail-row">
                <span>Instruksi</span>
                <strong>
                  {surat.disposisi
                    .instruksi || "-"}
                </strong>
              </div>

              <div className="detail-row">
                <span>Catatan</span>
                <strong>
                  {surat.disposisi
                    .catatan || "-"}
                </strong>
              </div>
            </div>
          )}

          {surat.timeline &&
            surat.timeline.length > 0 && (
              <div className="detail-timeline">
                <h3>Riwayat</h3>

                {surat.timeline.map(
                  (tl, i) => (
                    <div
                      className="timeline-item"
                      key={i}
                    >
                      <div className="timeline-dot" />

                      <div>
                        <strong>{tl.label}</strong>
                        <span>{formatTanggal(tl.tanggal)}</span>
                      </div>
                    </div>
                  )
                )}
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