import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  X,
  FileText,
  Clock,
  CheckCircle,
  Archive,
  FileSpreadsheet,
  Printer,
  BarChart3,
  Users,
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

const ubahStatus = (status) => STATUS_MAP[status] || { label: status, className: "" };

const aman = (v) => v || "";

function Laporan() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterSifat, setFilterSifat] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showRekap, setShowRekap] = useState(false);
  const [summary, setSummary] = useState(null);

  const fetcher = (page, perPage) =>
    api
      .get("/laporan/surat-masuk", {
        params: {
          page,
          per_page: perPage,
          search,
          status: filterStatus,
          jenis_surat_id: filterJenis,
          sifat_surat_id: filterSifat,
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir,
        },
      })
      .then((res) => {
        const pag = res.data?.data;
        return {
          data: pag?.data || [],
          total: pag?.total || 0,
          last_page: pag?.last_page || 1,
          current_page: pag?.current_page,
          per_page: pag?.per_page,
        };
      });

  const pag = useServerPagination(fetcher, [search, filterStatus, filterJenis, filterSifat, tanggalAwal, tanggalAkhir]);

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
      params: {
        per_page: 1000,
        search,
        status: filterStatus,
        jenis_surat_id: filterJenis,
        sifat_surat_id: filterSifat,
        tanggal_awal: tanggalAwal,
        tanggal_akhir: tanggalAkhir,
      },
    });
    return res.data?.data?.data || [];
  };

  const kolomRekap = (rows = []) => {
    const statusList = ["baru", "didisposisi", "diarsipkan"];
    return statusList
      .map((status) => ({
        status: STATUS_MAP[status].label,
        className: STATUS_MAP[status].className,
        jumlah: rows.filter((r) => r.status === status).length,
      }))
      .filter((r) => r.jumlah > 0);
  };

  const exportLaporan = async () => {
    const rows = await ambilSemua();
    const columns = [
      { key: "no_surat", label: "No. Surat" },
      { key: "perihal", label: "Perihal" },
      { key: "asal_surat", label: "Asal Surat" },
      { key: "tanggal_terima", label: "Tanggal Diterima", render: (r) => formatTanggal(r.tanggal_terima) },
      { key: "status", label: "Status", render: (r) => ubahStatus(r.status).label },
    ];

    exportExcel({
      rows,
      columns,
      filename: "laporan-surat",
    });
  };

  const printLaporan = async () => {
    const rows = await ambilSemua();
    const columns = [
      { key: "no_surat", label: "No. Surat" },
      { key: "perihal", label: "Perihal" },
      { key: "asal_surat", label: "Asal Surat" },
      { key: "tanggal_terima", label: "Tanggal Diterima", render: (r) => formatTanggal(r.tanggal_terima) },
      { key: "status", label: "Status", render: (r) => ubahStatus(r.status).label },
    ];

    buatHTMLPrint({
      title: "Laporan Surat",
      subtitle: `Rekapitulasi data surat masuk - ${filterStatus ? ubahStatus(filterStatus).label : "Semua Status"}`,
      columns,
      rows,
      footer: `Total surat: ${rows.length}`,
    });
  };

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
            <p>Rekapitulasi data surat masuk</p>
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
              <strong>{summary?.total_surat ?? pag.total}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div>
              <span>Baru</span>
              <strong>{summary?.surat_baru ?? 0}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div>
              <span>Didisposisi</span>
              <strong>{summary?.surat_didisposisi ?? 0}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <Archive size={24} />
            </div>
            <div>
              <span>Diarsipkan</span>
              <strong>{summary?.surat_diarsipkan ?? 0}</strong>
            </div>
          </div>

          <div className="laporan-stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div>
              <span>Total User</span>
              <strong>{summary?.total_user ?? 0}</strong>
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
              <p>Data surat masuk berdasarkan status</p>

              <div className="laporan-toolbar">
                <div className="laporan-search">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Cari surat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  className="laporan-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="baru">Baru</option>
                  <option value="didisposisi">Didisposisi</option>
                  <option value="diarsipkan">Diarsipkan</option>
                </select>

                <select
                  className="laporan-filter"
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                >
                  <option value="">Semua Jenis</option>
                  <option value="1">Surat Edaran</option>
                  <option value="2">Surat Undangan</option>
                  <option value="3">Surat Keputusan</option>
                  <option value="4">Surat Tugas</option>
                </select>

                <select
                  className="laporan-filter"
                  value={filterSifat}
                  onChange={(e) => setFilterSifat(e.target.value)}
                >
                  <option value="">Semua Sifat</option>
                  <option value="1">Penting</option>
                  <option value="2">Biasa</option>
                  <option value="3">Rahasia</option>
                </select>

                <input
                  type="date"
                  className="laporan-filter"
                  value={tanggalAwal}
                  onChange={(e) => setTanggalAwal(e.target.value)}
                />
                <input
                  type="date"
                  className="laporan-filter"
                  value={tanggalAkhir}
                  onChange={(e) => setTanggalAkhir(e.target.value)}
                />

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

                <EntriesSelect value={pag.entries} onChange={pag.changeEntries} />
              </div>
            </div>
          </div>

          <div className="table-wrapper">

            <table className="laporan-table">

              <thead>
                <tr>
                  <th>No</th>
                  <th>No. Surat</th>
                  <th>No. Agenda</th>
                  <th>Perihal</th>
                  <th>Asal Surat</th>
                  <th>Jenis</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>

                {pag.pageData.length > 0 ? (
                  pag.pageData.map((surat, index) => {
                    const st = ubahStatus(surat.status);
                    return (
                      <tr key={surat.id}>
                        <td>{(pag.page - 1) * pag.entries + index + 1}</td>
                        <td><strong>{aman(surat.no_surat)}</strong></td>
                        <td>{aman(surat.no_agenda)}</td>
                        <td>{aman(surat.perihal)}</td>
                        <td>{aman(surat.asal_surat)}</td>
                        <td>{surat.jenisSurat?.nama_jenis || "-"}</td>
                        <td>{formatTanggal(surat.tanggal_terima)}</td>
                        <td>
                          <span className={`status-badge ${st.className}`}>
                            {st.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="laporan-btn-view"
                            onClick={() => setSelectedSurat(surat)}
                            title="Lihat Detail"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="laporan-empty">
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
                <p>Informasi lengkap surat masuk</p>
              </div>

              <button
                className="laporan-close"
                onClick={() => setSelectedSurat(null)}
              >
                <X size={22} />
              </button>

            </div>

            <div className="laporan-detail">

              <div className="laporan-detail-item">
                <span>Nomor Surat</span>
                <strong>{aman(selectedSurat.no_surat)}</strong>
              </div>

              <div className="laporan-detail-item">
                <span>No. Agenda</span>
                <strong>{aman(selectedSurat.no_agenda)}</strong>
              </div>

              <div className="laporan-detail-item">
                <span>Perihal</span>
                <strong>{aman(selectedSurat.perihal)}</strong>
              </div>

              <div className="laporan-detail-item">
                <span>Asal Surat</span>
                <strong>{aman(selectedSurat.asal_surat)}</strong>
              </div>

              <div className="laporan-detail-item">
                <span>Jenis Surat</span>
                <strong>{selectedSurat.jenisSurat?.nama_jenis || "-"}</strong>
              </div>

              <div className="laporan-detail-item">
                <span>Sifat Surat</span>
                <strong>{selectedSurat.sifatSurat?.nama_sifat || "-"}</strong>
              </div>

              <div className="laporan-detail-item">
                <span>Tanggal Diterima</span>
                <strong>{formatTanggal(selectedSurat.tanggal_terima)}</strong>
              </div>

              <div className="laporan-detail-item">
                <span>Status</span>
                <strong>
                  <span className={`status-badge ${ubahStatus(selectedSurat.status).className}`}>
                    {ubahStatus(selectedSurat.status).label}
                  </span>
                </strong>
              </div>

            </div>

            <div className="laporan-modal-footer">

              <button
                className="laporan-btn-close"
                onClick={() => setSelectedSurat(null)}
              >
                Tutup
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================
          MODAL REKAP JUMLAH
      ========================= */}
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
                <h2>Rekap Jumlah Surat</h2>
                <p>Jumlah surat berdasarkan status</p>
              </div>

              <button
                className="laporan-close"
                onClick={() => setShowRekap(false)}
              >
                <X size={22} />
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
                  {kolomRekap(pag.pageData).map((r, index) => (
                    <tr key={r.status}>
                      <td>{index + 1}</td>
                      <td>
                        <span className={`status-badge ${r.className}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <strong>{r.jumlah}</strong>
                      </td>
                    </tr>
                  ))}
                  {kolomRekap(pag.pageData).length === 0 && (
                    <tr>
                      <td colSpan="3" className="laporan-empty">
                        Belum ada data surat
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
              <button
                className="laporan-btn-close"
                onClick={() => setShowRekap(false)}
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