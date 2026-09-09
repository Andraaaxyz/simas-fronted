import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Laporan.css";
import { formatTanggal } from "../../../utils/tanggal";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function Laporan() {
  const [dataSurat, setDataSurat] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedSurat, setSelectedSurat] = useState(null);

  // =========================
  // AMBIL DATA SURAT
  // =========================
  useEffect(() => {
    const ambilData = () => {
      const dataLama =
        JSON.parse(localStorage.getItem("dataSurat")) || [];

      const data = dataLama.map((item) =>
        item.perihal !== undefined
          ? item
          : {
              ...item,
              perihal: item.perihal || item.isi || "",
              tanggalDiterima:
                item.tanggalDiterima ||
                item.tanggal ||
                "",
            }
      );

      setDataSurat(data);

      setSelectedSurat((prev) => {
        if (!prev) return null;

        const update = data.find(
          (item) => item.id === prev.id
        );

        return update || null;
      });
    };

    ambilData();

    window.addEventListener("storage", ambilData);

    const interval = setInterval(ambilData, 1000);

    return () => {
      window.removeEventListener("storage", ambilData);
      clearInterval(interval);
    };
  }, []);

  // =========================
  // FILTER DATA
  // =========================
  const filteredData = dataSurat.filter((item) => {
    const cocokSearch =
      `${item.noSurat || ""} ${item.perihal || ""} ${
        item.asal || ""
      } ${item.tanggalDiterima || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const cocokStatus =
      filterStatus === "Semua" ||
      item.status === filterStatus;

    return cocokSearch && cocokStatus;
  });

  // =========================
  // PAGINATION
  // =========================
  const pag = usePagination(filteredData, 10);

  // =========================
  // STATISTIK
  // =========================
  const totalSurat = dataSurat.length;

  const suratDiproses = dataSurat.filter(
    (item) => item.status === "Diproses"
  ).length;

  const suratSelesai = dataSurat.filter(
    (item) => item.status === "Selesai"
  ).length;

  const suratDisetujui = dataSurat.filter(
    (item) => item.status === "Disetujui"
  ).length;

  const suratDitolak = dataSurat.filter(
    (item) => item.status === "Ditolak"
  ).length;

  return (
    <DashboardLayout title="Laporan">

      <div className="laporan-page">

        {/* =========================
            HEADER
        ========================= */}
        <div className="laporan-header">
          <div>
            <div className="laporan-breadcrumb">
              Laporan / Rekap Surat
            </div>

            <h1>Laporan Surat</h1>

            <p>
              Rekapitulasi data surat masuk SIMAS
            </p>
          </div>
        </div>

        {/* =========================
            STATISTIK
        ========================= */}
        <div className="laporan-stats">

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>

            <div>
              <span>Total Surat</span>
              <strong>{totalSurat}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>

            <div>
              <span>Diproses</span>
              <strong>{suratDiproses}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <span>Selesai</span>
              <strong>{suratSelesai}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <Archive size={24} />
            </div>

            <div>
              <span>Disetujui</span>
              <strong>{suratDisetujui}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <XCircle size={24} />
            </div>

            <div>
              <span>Ditolak</span>
              <strong>{suratDitolak}</strong>
            </div>
          </div>

        </div>

        {/* =========================
            TABEL
        ========================= */}
        <div className="laporan-table-card">

          <div className="laporan-table-header">

            <div>
              <h2>Rekap Surat Masuk</h2>
              <p>
                Data surat masuk berdasarkan status
              </p>
            </div>

            <div className="laporan-toolbar">

              {/* SEARCH */}
              <div className="laporan-search">
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

              {/* FILTER */}
              <select
                className="laporan-filter"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
              >
                <option value="Semua">Semua Status</option>
                <option value="Baru">Baru</option>
                <option value="Menunggu Disposisi">
                  Menunggu Disposisi
                </option>
                <option value="Didisposisikan">
                  Didisposisikan
                </option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Diarsipkan">
                  Diarsipkan
                </option>
                <option value="Disetujui">
                  Disetujui
                </option>
                <option value="Ditolak">
                  Ditolak
                </option>
              </select>

              {/* ENTRIES */}
              <EntriesSelect
                value={pag.entries}
                onChange={pag.changeEntries}
              />

            </div>
          </div>

          <div className="table-wrapper">

            <table className="laporan-table">

              <thead>
                <tr>
                  <th>No</th>
                  <th>No. Surat</th>
                  <th>Perihal</th>
                  <th>Asal Surat</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>

                {pag.pageData.length > 0 ? (
                  pag.pageData.map((surat, index) => (
                    <tr key={surat.id}>

                      <td>
                        {(pag.page - 1) *
                          pag.entries +
                          index +
                          1}
                      </td>

                      <td>
                        <strong>
                          {surat.noSurat}
                        </strong>
                      </td>

                      <td>
                        {surat.perihal}
                      </td>

                      <td>
                        {surat.asal}
                      </td>

                      <td>
                        {formatTanggal(
                          surat.tanggalDiterima
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            surat.status
                              ?.toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >
                          {surat.status || "Baru"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="laporan-btn-view"
                          onClick={() =>
                            setSelectedSurat(surat)
                          }
                          title="Lihat Detail"
                        >
                          <Eye size={17} />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="laporan-empty"
                    >
                      Tidak ada data surat
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

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

      </div>

      {/* =========================
          MODAL DETAIL
      ========================= */}
      {selectedSurat && (
        <div className="laporan-modal-overlay">

          <div className="laporan-modal">

            <div className="laporan-modal-header">

              <div>
                <h2>Detail Surat</h2>
                <p>
                  Informasi lengkap surat masuk
                </p>
              </div>

              <button
                className="laporan-close"
                onClick={() =>
                  setSelectedSurat(null)
                }
              >
                <X size={22} />
              </button>

            </div>

            <div className="laporan-detail">

              <div className="laporan-detail-item">
                <span>Nomor Surat</span>
                <strong>
                  {selectedSurat.noSurat}
                </strong>
              </div>

              <div className="laporan-detail-item">
                <span>Perihal</span>
                <strong>
                  {selectedSurat.perihal}
                </strong>
              </div>

              <div className="laporan-detail-item">
                <span>Asal Surat</span>
                <strong>
                  {selectedSurat.asal}
                </strong>
              </div>

              <div className="laporan-detail-item">
                <span>Tanggal Diterima</span>
                <strong>
                  {formatTanggal(
                    selectedSurat.tanggalDiterima
                  )}
                </strong>
              </div>

              <div className="laporan-detail-item">
                <span>Status</span>

                <strong>
                  <span
                    className={`status-badge ${
                      selectedSurat.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {selectedSurat.status ||
                      "Baru"}
                  </span>
                </strong>
              </div>

            </div>

            <div className="laporan-modal-footer">

              <button
                className="laporan-btn-close"
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

    </DashboardLayout>
  );
}

export default Laporan;