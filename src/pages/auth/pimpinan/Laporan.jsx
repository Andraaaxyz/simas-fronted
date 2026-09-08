import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  X,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Laporan.css";

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

  useEffect(() => {
    const ambilData = () => {
      const data =
        JSON.parse(localStorage.getItem("dataSurat")) || [];

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

  const totalSurat = dataSurat.length;

  const jumlahDiproses = dataSurat.filter(
    (item) => item.status === "Diproses"
  ).length;

  const jumlahSelesai = dataSurat.filter(
    (item) => item.status === "Selesai"
  ).length;

  const jumlahDisetujui = dataSurat.filter(
    (item) => item.status === "Disetujui"
  ).length;

  const jumlahDitolak = dataSurat.filter(
    (item) => item.status === "Ditolak"
  ).length;

  const filteredData = dataSurat.filter((item) => {
    const cocokSearch =
      `${item.noSurat || ""} ${item.isi || ""} ${
        item.asal || ""
      } ${item.tanggal || ""}`
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

  return (
    <DashboardLayout>
      <div className="laporan-pimpinan-page">

        {/* HEADER */}
        <div className="laporan-header">
          <div>
            <span className="laporan-breadcrumb">
              Laporan / Pimpinan
            </span>

            <h1>Laporan Surat</h1>

            <p>
              Monitoring dan rekapitulasi administrasi surat
            </p>
          </div>

          <div className="laporan-header-icon">
            <BarChart3 size={25} />
          </div>
        </div>

        {/* STATISTIK */}
        <div className="laporan-stats">

          <div className="laporan-stat-card blue">
            <div className="stat-icon">
              <FileText size={22} />
            </div>

            <div>
              <span>Total Surat</span>
              <strong>{totalSurat}</strong>
              <small>Seluruh surat masuk</small>
            </div>
          </div>

          <div className="laporan-stat-card orange">
            <div className="stat-icon">
              <Clock size={22} />
            </div>

            <div>
              <span>Diproses</span>
              <strong>{jumlahDiproses}</strong>
              <small>Sedang diproses</small>
            </div>
          </div>

          <div className="laporan-stat-card green">
            <div className="stat-icon">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <span>Selesai</span>
              <strong>{jumlahSelesai}</strong>
              <small>Surat selesai</small>
            </div>
          </div>

          <div className="laporan-stat-card purple">
            <div className="stat-icon">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <span>Disetujui</span>
              <strong>{jumlahDisetujui}</strong>
              <small>Keputusan pimpinan</small>
            </div>
          </div>

          <div className="laporan-stat-card red">
            <div className="stat-icon">
              <XCircle size={22} />
            </div>

            <div>
              <span>Ditolak</span>
              <strong>{jumlahDitolak}</strong>
              <small>Keputusan pimpinan</small>
            </div>
          </div>

        </div>

        {/* TABLE CARD */}
        <div className="laporan-card">

          <div className="laporan-card-header">

            <div>
              <h3>Rekapitulasi Surat</h3>
              <p>
                Daftar seluruh surat yang tercatat di sistem
              </p>
            </div>

            <div className="laporan-total">
              {filteredData.length} Data
            </div>

          </div>

          {/* TOOLBAR */}
          <div className="laporan-toolbar">

            <div className="laporan-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Cari nomor surat, perihal, asal..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <select
              className="laporan-filter"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="Semua">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            <EntriesSelect
              value={pag.entries}
              onChange={pag.changeEntries}
            />

          </div>

          {/* TABLE */}
          <div className="laporan-table-wrapper">

            <table className="laporan-table">

              <thead>
                <tr>
                  <th>No</th>
                  <th>No. Surat</th>
                  <th>Perihal</th>
                  <th>Asal</th>
                  <th>Tanggal</th>
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
                        <strong className="nomor-surat">
                          {item.noSurat}
                        </strong>
                      </td>

                      <td>
                        <span className="perihal">
                          {item.isi}
                        </span>
                      </td>

                      <td>{item.asal}</td>

                      <td>{item.tanggal}</td>

                      <td>
                        <span
                          className={`laporan-status ${
                            item.status === "Selesai"
                              ? "selesai"
                              : item.status === "Disetujui"
                              ? "disetujui"
                              : item.status === "Ditolak"
                              ? "ditolak"
                              : item.status === "Diproses"
                              ? "diproses"
                              : "baru"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="laporan-eye"
                          onClick={() =>
                            setSelectedSurat(item)
                          }
                          title="Lihat detail"
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
                      <FileText size={40} />
                      <strong>Data tidak ditemukan</strong>
                      <span>
                        Belum ada surat yang sesuai dengan
                        pencarian.
                      </span>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}
          <PaginationBar
            page={pag.page}
            totalPages={pag.totalPages}
            onPageChange={pag.goToPage}
            start={pag.start}
            end={pag.end}
            total={pag.total}
          />

        </div>

        {/* DETAIL MODAL */}
        {selectedSurat && (
          <div
            className="laporan-modal-overlay"
            onClick={() => setSelectedSurat(null)}
          >
            <div
              className="laporan-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="laporan-modal-header">

                <div>
                  <span>Detail Laporan</span>
                  <h2>Informasi Surat</h2>
                </div>

                <button
                  className="laporan-close"
                  onClick={() =>
                    setSelectedSurat(null)
                  }
                >
                  <X size={20} />
                </button>

              </div>

              <div className="laporan-detail">

                <div className="detail-box">
                  <span>Nomor Surat</span>
                  <strong>
                    {selectedSurat.noSurat}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Perihal</span>
                  <strong>
                    {selectedSurat.isi}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Asal Surat</span>
                  <strong>
                    {selectedSurat.asal}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Tanggal</span>
                  <strong>
                    {selectedSurat.tanggal}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Status</span>

                  <strong>
                    <span
                      className={`laporan-status ${
                        selectedSurat.status === "Selesai"
                          ? "selesai"
                          : selectedSurat.status ===
                            "Disetujui"
                          ? "disetujui"
                          : selectedSurat.status ===
                            "Ditolak"
                          ? "ditolak"
                          : selectedSurat.status ===
                            "Diproses"
                          ? "diproses"
                          : "baru"
                      }`}
                    >
                      {selectedSurat.status}
                    </span>
                  </strong>
                </div>

                {selectedSurat.keputusan && (
                  <div className="detail-box keputusan-box">
                    <span>Keputusan Pimpinan</span>
                    <strong>
                      {selectedSurat.keputusan}
                    </strong>
                  </div>
                )}

              </div>

              <div className="laporan-modal-footer">
                <button
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

export default Laporan;