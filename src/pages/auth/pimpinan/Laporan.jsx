import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  Archive,
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
  useServerPagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

import { api } from "../../../services/apiClient";

const STATUS_MAP = {
  baru: { label: "Baru", className: "baru" },
  didisposisi: { label: "Didisposisi", className: "didisposisikan" },
  diarsipkan: { label: "Diarsipkan", className: "diarsipkan" },
};

const ubahStatus = (status) => STATUS_MAP[status] || { label: status || "-", className: "" };

function Laporan() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showRekap, setShowRekap] = useState(false);
  const [summary, setSummary] = useState(null);

  const fetcher = (page, perPage) =>
    api
      .get("/laporan/surat-masuk", {
        params: { page, per_page: perPage, search, status: filterStatus },
      })
      .then((res) => res.data?.data || { data: [] });

  const pag = useServerPagination(fetcher, [search, filterStatus]);

  useEffect(() => {
    if (summary !== null) return;
    api
      .get("/dashboard")
      .then((r) => setSummary(r.data?.data?.summary || null))
      .catch(() => setSummary(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  const ambilSemua = async () => {
    const res = await api.get("/laporan/surat-masuk", {
      params: { per_page: 1000, search, status: filterStatus },
    });
    return res.data?.data?.data || [];
  };

  const rekapPerStatus = () => {
    const statusList = ["baru", "didisposisi", "diarsipkan"];

    return statusList
      .map((status) => ({
        status: STATUS_MAP[status].label,
        className: STATUS_MAP[status].className,
        jumlah: pag.pageData.filter((r) => r.status === status).length,
      }))
      .filter((r) => r.jumlah > 0);
  };

  const kolomLaporan = [
    { key: "no_surat", label: "No. Surat" },
    { key: "perihal", label: "Perihal" },
    { key: "asal_surat", label: "Asal Surat" },
    { key: "tanggal_terima", label: "Tanggal Diterima", render: (r) => formatTanggal(r.tanggal_terima) },
    { key: "status", label: "Status", render: (r) => ubahStatus(r.status).label },
  ];

  const exportLaporan = async () => {
    const rows = await ambilSemua();

    exportExcel({
      rows,
      columns: kolomLaporan,
      filename: "laporan-pimpinan",
    });
  };

  const printLaporan = async () => {
    const rows = await ambilSemua();

    buatHTMLPrint({
      title: "Laporan Surat",
      subtitle: `Monitoring dan rekapitulasi administrasi surat - ${filterStatus ? ubahStatus(filterStatus).label : "Semua Status"}`,
      columns: kolomLaporan,
      rows,
      footer: `Total surat: ${rows.length}`,
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
              <strong>{summary?.total_surat ?? pag.total}</strong>
              <small>Seluruh surat masuk</small>
            </div>
          </div>

          <div className="laporan-stat-card orange">
            <div className="stat-icon">
              <Clock size={22} />
            </div>

            <div>
              <span>Baru</span>
              <strong>{summary?.surat_baru ?? 0}</strong>
              <small>Belum didisposisi</small>
            </div>
          </div>

          <div className="laporan-stat-card green">
            <div className="stat-icon">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <span>Didisposisi</span>
              <strong>{summary?.surat_didisposisi ?? 0}</strong>
              <small>Sedang diproses</small>
            </div>
          </div>

          <div className="laporan-stat-card purple">
            <div className="stat-icon">
              <Archive size={22} />
            </div>

            <div>
              <span>Diarsipkan</span>
              <strong>{summary?.surat_diarsipkan ?? 0}</strong>
              <small>Surat selesai diarsipkan</small>
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
              {pag.total} Data
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
              <option value="">Semua Status</option>
              <option value="baru">Baru</option>
              <option value="didisposisi">Didisposisi</option>
              <option value="diarsipkan">Diarsipkan</option>
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
                  pag.pageData.map((item, index) => {
                    const st = ubahStatus(item.status);
                    return (
                      <tr key={item.id}>

                        <td>
                          {(pag.page - 1) *
                            pag.entries +
                            index +
                            1}
                        </td>

                        <td>
                          <strong className="nomor-surat">
                            {item.no_surat}
                          </strong>
                        </td>

                        <td>
                          <span className="perihal">
                            {item.perihal}
                          </span>
                        </td>

                        <td>{item.asal_surat}</td>

                        <td>
                          {formatTanggal(
                            item.tanggal_terima
                          )}
                        </td>

                        <td>
                          <span
                            className={`laporan-status ${st.className}`}
                          >
                            {st.label}
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
                    );
                  })
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
                    {selectedSurat.no_surat}
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
                    {selectedSurat.asal_surat}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Tanggal Diterima</span>
                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggal_terima
                    )}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Status</span>

                  <strong>
                    <span
                      className={`laporan-status ${ubahStatus(selectedSurat.status).className}`}
                    >
                      {ubahStatus(selectedSurat.status).label}
                    </span>
                  </strong>
                </div>

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
                            className={`laporan-status ${r.className}`}
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
                  {rekapPerStatus().length === 0 && (
                    <tr>
                      <td colSpan="3" className="laporan-empty">
                        <FileText size={40} />
                        <span>Belum ada data surat</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="laporan-rekap-total">
                <span>Total Surat</span>
                <strong>{pag.total}</strong>
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