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
  FileSpreadsheet,
  Printer,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Laporan.css";
import { formatTanggal } from "../../../utils/tanggal";
import {
  exportExcel,
  buatHTMLPrint,
} from "../../../utils/report";

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
  const [showRekap, setShowRekap] = useState(false);

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
  // REKAP PER STATUS
  // =========================
  const rekapPerStatus = () => {
    const statusList = [
      "Baru",
      "Menunggu Disposisi",
      "Didisposisikan",
      "Diproses",
      "Selesai",
      "Diarsipkan",
      "Disetujui",
      "Ditolak",
    ];

    return statusList
      .map((status) => ({
        status,
        jumlah: dataSurat.filter(
          (item) => item.status === status
        ).length,
      }))
      .filter((r) => r.jumlah > 0);
  };

  // =========================
  // EXPORT EXCEL
  // =========================
  const exportLaporan = () => {
    const columns = [
      { key: "noSurat", label: "No. Surat" },
      { key: "perihal", label: "Perihal" },
      { key: "asal", label: "Asal Surat" },
      { key: "tanggalDiterima", label: "Tanggal Diterima", render: (r) => formatTanggal(r.tanggalDiterima) },
      { key: "status", label: "Status" },
    ];

    exportExcel({
      rows: filteredData,
      columns,
      filename: "laporan-pimpinan",
    });
  };

  // =========================
  // PRINT LAPORAN
  // =========================
  const printLaporan = () => {
    const columns = [
      { key: "noSurat", label: "No. Surat" },
      { key: "perihal", label: "Perihal" },
      { key: "asal", label: "Asal Surat" },
      { key: "tanggalDiterima", label: "Tanggal Diterima", render: (r) => formatTanggal(r.tanggalDiterima) },
      { key: "status", label: "Status" },
    ];

    buatHTMLPrint({
      title: "Laporan Surat",
      subtitle: `Monitoring dan rekapitulasi administrasi surat - ${filterStatus === "Semua" ? "Semua Status" : filterStatus}`,
      columns,
      rows: filteredData,
      footer: `Total surat: ${filteredData.length}`,
    });
  };

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
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            <div className="laporan-actions">

              <button
                className="btn-laporan-rekap"
                onClick={() => setShowRekap(true)}
                title="Rekap Jumlah"
              >
                <BarChart3 size={19} />
                Rekap
              </button>

              <button
                className="btn-laporan-excel"
                onClick={exportLaporan}
                title="Export Excel"
              >
                <FileSpreadsheet size={19} />
                Excel
              </button>

              <button
                className="btn-laporan-print"
                onClick={printLaporan}
                title="Print Laporan"
              >
                <Printer size={19} />
                Print
              </button>

            </div>

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
                          {item.perihal}
                        </span>
                      </td>

                      <td>{item.asal}</td>

                      <td>
                        {formatTanggal(
                          item.tanggalDiterima
                        )}
                      </td>

                      <td>
                        <span
                          className={`laporan-status ${
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
                    {selectedSurat.perihal}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Asal Surat</span>
                  <strong>
                    {selectedSurat.asal}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Tanggal Diterima</span>
                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggalDiterima
                    )}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Status</span>

                  <strong>
                    <span
                      className={`laporan-status ${
                        selectedSurat.status
                          ?.toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )
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

      {/* REKAP JUMLAH MODAL */}
      {showRekap && (
        <div
          className="laporan-modal-overlay"
          onClick={() => setShowRekap(false)}
        >
          <div
            className="laporan-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="laporan-modal-header">
              <div>
                <span>Rekap Jumlah</span>
                <h2>Surat per Status</h2>
              </div>

              <button
                className="laporan-close"
                onClick={() => setShowRekap(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="laporan-rekap-body">
              <table className="laporan-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Status</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>

                <tbody>
                  {rekapPerStatus().map(
                    (r, index) => (
                      <tr key={r.status}>
                        <td>{index + 1}</td>
                        <td>
                          <span
                            className={`laporan-status ${
                              r.status
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <strong>{r.jumlah}</strong>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <div className="laporan-rekap-total">
                <span>Total Surat</span>
                <strong>{dataSurat.length}</strong>
              </div>
            </div>

            <div className="laporan-modal-footer">
              <button onClick={() => setShowRekap(false)}>
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