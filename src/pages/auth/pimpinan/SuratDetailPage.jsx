import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import FileDokumen from "../../../component/FileDokumen";
import { formatTanggal, hariIniISO } from "../../../utils/tanggal";

function PimpinanSuratDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [surat, setSurat] = useState(null);
  const [keputusan, setKeputusan] = useState("");

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
    setKeputusan(cari.keputusan || "");
  }, [id, navigate]);

  const simpanKeputusan = () => {
    if (!keputusan) {
      alert("Silakan pilih keputusan terlebih dahulu!");
      return;
    }

    const data = JSON.parse(localStorage.getItem("dataSurat")) || [];

    const dataBaru = data.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            keputusan: keputusan,
            status:
              keputusan === "Disetujui"
                ? "Disetujui"
                : "Ditolak",
            timeline: [
              ...(item.timeline || []),
              {
                label:
                  keputusan === "Disetujui"
                    ? "Surat disetujui"
                    : "Surat ditolak",
                tanggal: hariIniISO(),
              },
            ],
          }
        : item
    );

    localStorage.setItem("dataSurat", JSON.stringify(dataBaru));

    setSurat(dataBaru.find((s) => String(s.id) === String(id)));
    setKeputusan("");

    alert("Keputusan berhasil disimpan!");
  };

  if (!surat) return null;

  return (
    <DashboardLayout title="Lihat Surat">

      <div className="surat-page">

        <button
          className="action-page-back"
          onClick={() => navigate("/pimpinan/surat-masuk")}
        >
          &larr; Kembali
        </button>

        <div className="action-page-card">

          <div className="modal-header">

            <div>
              <h2>Detail Surat</h2>

              <p>
                Informasi dan keputusan surat
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

            {/* KEPUTUSAN */}

            <div className="form-group">

              <label>
                Keputusan Pimpinan
              </label>

              <select
                value={keputusan}
                onChange={(e) =>
                  setKeputusan(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Pilih Keputusan
                </option>

                <option value="Disetujui">
                  Disetujui
                </option>

                <option value="Ditolak">
                  Ditolak
                </option>

              </select>

            </div>

            {/* INFO DISPOSISI */}

            {surat.disposisi && (
              <div className="detail-disposisi-info">

                <h3>
                  Informasi Disposisi
                </h3>

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

            {/* TIMELINE */}

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
                        <div
                          className="timeline-dot"
                        />

                        <div>
                          <strong>
                            {tl.label}
                          </strong>

                          <span>
                            {formatTanggal(tl.tanggal)}
                          </span>
                        </div>
                      </div>
                    )
                  )}

                </div>
              )}

          </div>

          <div className="modal-footer">

            <button
              className="btn-tutup"
              onClick={() => navigate("/pimpinan/surat-masuk")}
            >
              Kembali
            </button>

            <button
              className="btn-simpan"
              onClick={simpanKeputusan}
            >

              <CheckCircle size={17} />

              Simpan Keputusan

            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default PimpinanSuratDetailPage;