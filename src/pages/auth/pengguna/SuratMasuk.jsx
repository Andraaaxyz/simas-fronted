import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import FileDokumen from "../../../component/FileDokumen";
import { formatTanggal } from "../../../utils/tanggal";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function SuratMasuk() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedSurat, setSelectedSurat] = useState(null);

  const [dataSurat, setDataSurat] = useState([]);

  // =========================
  // MIGRASI DATA LAMA
  // =========================

  const migrasiData = (data) =>
    data.map((item) => {
      if (item.perihal !== undefined) return item;

      return {
        ...item,
        noAgenda: item.noAgenda || "",
        tanggalSurat: item.tanggalSurat || "",
        tanggalDiterima: item.tanggalDiterima || item.tanggal || "",
        jenis: item.jenis || "",
        sifat: item.sifat || "",
        tujuan: item.tujuan || "",
        perihal: item.perihal || item.isi || "",
        file: item.file || "",
        lampiran: item.lampiran || "",
      };
    });

  // =========================
  // AMBIL DATA SURAT
  // =========================

  useEffect(() => {
    const dataLama =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    if (dataLama.length > 0) {
      setDataSurat(migrasiData(dataLama));
    } else {
      const dataAwal = [
        {
          id: 1,
          noAgenda: "001",
          noSurat: "001/089/SK/2026",
          tanggalSurat: "2026-08-19",
          tanggalDiterima: "2026-08-20",
          jenis: "Surat Undangan",
          sifat: "Penting",
asal: "Dinas Pendidikan",
            tujuan: "Bidang Tata Usaha",
            perihal: "Undangan Rapat Koordinasi",
          file: "undangan-rapat.pdf",
          lampiran: "Agenda rapat",
          status: "Baru",
          disposisi: null,
          timeline: [
            {
              label: "Surat diterima",
              tanggal: "2026-08-20",
            },
          ],
        },
        {
          id: 2,
          noAgenda: "002",
          noSurat: "002/090/SK/2026",
          tanggalSurat: "2026-08-20",
          tanggalDiterima: "2026-08-21",
          jenis: "Surat Edaran",
          sifat: "Biasa",
asal: "Dinas Kesehatan",
            tujuan: "Ir. Ahmad Fauzi, M.Si",
            perihal: "Pemberitahuan Kegiatan Senam",
          file: "edaran-kegiatan.pdf",
          lampiran: "-",
          status: "Didisposisikan",
          disposisi: {
            tujuan: "Budi Santoso, S.E",
            instruksi: "Segera ditindaklanjuti",
            catatan: "Mohon diproses dengan baik.",
            tanggalDisposisi: "2026-08-22",
          },
          timeline: [
            {
              label: "Surat diterima",
              tanggal: "2026-08-21",
            },
            {
              label: "Disposisi dibuat",
              tanggal: "2026-08-22",
            },
          ],
        },
        {
          id: 3,
          noAgenda: "003",
          noSurat: "003/091/SK/2026",
          tanggalSurat: "2026-08-21",
          tanggalDiterima: "2026-08-22",
          jenis: "Surat Permohonan",
          sifat: "Biasa",
asal: "Dinas Sosial",
            tujuan: "Bidang Umum",
            perihal: "Surat Permohonan Bantuan",
          file: "permohonan-bantuan.pdf",
          lampiran: "Proposal bantuan",
          status: "Selesai",
          disposisi: {
            tujuan: "Siti Aminah",
            instruksi: "Dilaporkan ke pimpinan",
            catatan: "Sudah diproses.",
            tanggalDisposisi: "2026-08-23",
          },
          timeline: [
            {
              label: "Surat diterima",
              tanggal: "2026-08-22",
            },
            {
              label: "Disposisi dibuat",
              tanggal: "2026-08-23",
            },
            {
              label: "Diproses pegawai",
              tanggal: "2026-08-24",
            },
            {
              label: "Selesai diproses",
              tanggal: "2026-08-25",
            },
          ],
        },
      ];

      setDataSurat(dataAwal);

      localStorage.setItem(
        "dataSurat",
        JSON.stringify(dataAwal)
      );
    }
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredData = dataSurat.filter((item) => {
    const cocokSearch =
      `${item.noAgenda || ""} ${item.noSurat || ""} ${
        item.perihal || ""
      } ${item.asal || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const cocokStatus =
      !filterStatus || item.status === filterStatus;

    return cocokSearch && cocokStatus;
  });

  // =========================
  // PAGINATION
  // =========================

  const pag = usePagination(filteredData);

  return (
    <DashboardLayout title="Surat Masuk">

      <div className="surat-page">

        {/* HEADER */}

        <div className="surat-header">

          <div>
            <h2>Surat Masuk</h2>

            <p>
              Lihat daftar surat masuk dan status pengelolaannya.
            </p>
          </div>

        </div>

        {/* SEARCH + TOOLS */}

        <div className="surat-toolbar pag-tools">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Cari surat..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            className="pag-filter"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
          >
            <option value="">
              Semua Status
            </option>

            {[
              ...new Set(
                dataSurat
                  .map((d) => d.status)
                  .filter(Boolean)
              ),
            ].map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <EntriesSelect
            value={pag.entries}
            onChange={pag.changeEntries}
          />

        </div>

        {/* TABLE */}

        <div className="table-card">

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>No. Agenda</th>
                <th>No. Surat</th>
                <th>Tanggal Surat</th>
                <th>Sifat Surat</th>
                <th>Asal Surat</th>
                <th>Tujuan Surat</th>
                <th>Perihal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {pag.pageData.length > 0 ? (

                pag.pageData.map((item, index) => (

                  <tr key={item.id}>

                    <td>
                      {(pag.page - 1) *
                        pag.entries +
                        index +
                        1}
                    </td>

                    <td>
                      <strong>
                        {item.noAgenda}
                      </strong>
                    </td>

                    <td>
                      {item.noSurat}
                    </td>

                    <td>
                      {formatTanggal(
                        item.tanggalSurat
                      )}
                    </td>

                    <td>
                      {item.sifat || "-"}
                    </td>

                    <td>
                      {item.asal}
                    </td>

                    <td>
                      {item.tujuan || "-"}
                    </td>

                    <td>
                      {item.perihal}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          item.status
                            ?.toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >

                        <button
                          className="btn-eye"
                          title="Lihat Detail"
                          onClick={() =>
                            setSelectedSurat(item)
                          }
                        >
                          <Eye size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="10"
                    className="empty"
                  >
                    Belum ada surat masuk.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =========================
            PAGINATION
        ========================= */}

        <PaginationBar
          page={pag.page}
          totalPages={pag.totalPages}
          onPageChange={pag.goToPage}
          start={pag.start}
          end={pag.end}
          total={pag.total}
        />

                        {/* =========================
            MODAL DETAIL
        ========================= */}

        {selectedSurat && (

          <div
            className="modal-overlay"
            onClick={() =>
              setSelectedSurat(null)
            }
          >

            <div
              className="detail-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>
                  <h2>Detail Surat</h2>

                  <p>
                    Informasi surat masuk
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setSelectedSurat(null)
                  }
                >
                  <X size={18} />
                </button>

              </div>

              <div className="detail-content">

                <div className="detail-row">
                  <span>No. Agenda</span>

                  <strong>
                    {selectedSurat.noAgenda}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>No. Surat</span>

                  <strong>
                    {selectedSurat.noSurat}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tanggal Surat</span>

                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggalSurat
                    )}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tanggal Diterima</span>

                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggalDiterima
                    )}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Jenis Surat</span>

                  <strong>
                    {selectedSurat.jenis || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Sifat Surat</span>

                  <strong>
                    {selectedSurat.sifat || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Asal Surat</span>

                  <strong>
                    {selectedSurat.asal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tujuan Surat</span>

                  <strong>
                    {selectedSurat.tujuan || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Perihal</span>

                  <strong>
                    {selectedSurat.perihal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>File Surat</span>

                  <strong>
                    <FileDokumen
                      value={selectedSurat.file}
                    />
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Lampiran</span>

                  <strong>
                    {selectedSurat.lampiran || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Status</span>

                  <strong>
                    {selectedSurat.status}
                  </strong>
                </div>

              </div>

              {selectedSurat.disposisi && (
                <div className="detail-disposisi-info">
                  <h3>Informasi Disposisi</h3>

                  <div className="detail-row">
                    <span>Tujuan</span>
                    <strong>
                      {selectedSurat.disposisi
                        .tujuan || "-"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Instruksi</span>
                    <strong>
                      {selectedSurat.disposisi
                        .instruksi || "-"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Catatan</span>
                    <strong>
                      {selectedSurat.disposisi
                        .catatan || "-"}
                    </strong>
                  </div>
                </div>
              )}

              {selectedSurat.timeline &&
                selectedSurat.timeline.length > 0 && (
                  <div className="detail-timeline">
                    <h3>Riwayat</h3>

                    {selectedSurat.timeline.map(
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
                  onClick={() =>
                    setSelectedSurat(null)
                  }
                >
                  Tutup
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default SuratMasuk;
