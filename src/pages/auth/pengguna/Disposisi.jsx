import { useState } from "react";
import {
  Eye,
  X,
  Search,
  CheckCircle,
  Clock,
  Check,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Disposisi.css";
import { formatTanggal } from "../../../utils/tanggal";

import {
  useServerPagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

import { useToast } from "../../../component/Toast";

import { api } from "../../../services/apiClient";

const STATUS_META = {
  menunggu: { label: "Menunggu", className: "status-menunggu" },
  dibaca: { label: "Dibaca", className: "status-menunggu" },
  diproses: { label: "Diproses", className: "status-diproses" },
  selesai: { label: "Selesai", className: "status-selesai" },
};

const ubahStatus = (status) =>
  STATUS_META[status] || { label: status || "-", className: "" };

function Disposisi() {
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedDisposisi, setSelectedDisposisi] =
    useState(null);

  const fetcher = (page, perPage) =>
    api
      .get("/disposisi", {
        params: { page, per_page: perPage },
      })
      .then((res) => res.data?.data || { data: [] });

  const pag = useServerPagination(fetcher, [filterStatus]);

  const listDisposisi = pag.pageData.map((item) => ({
    id: item.id,
    noSurat: item.surat_masuk?.no_surat || "-",
    asal: item.surat_masuk?.asal_surat || "-",
    perihal: item.surat_masuk?.perihal || "-",
    penerima: item.penerima?.nama || "-",
    pengirim: item.pengirim?.nama || "-",
    tanggalDisposisi: item.tanggal_disposisi,
    instruksi: item.instruksi || "-",
    catatan: item.catatan || "-",
    status: item.status || "menunggu",
  }));

  const cocokSearch = (item) =>
    `${item.noSurat} ${item.asal} ${item.perihal} ${item.penerima}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const filteredData = listDisposisi.filter(cocokSearch);

  const detail =
    selectedDisposisi &&
    filteredData.find((d) => d.id === selectedDisposisi.id);

  const ubahStatusDisposisi = async (statusBaru) => {
    if (!detail) return;

    try {
      const res = await api.put(`/disposisi/${detail.id}`, {
        status: statusBaru,
      });

      const update = res.data?.data;
      const statusAkhir = update?.status || statusBaru;

      setSelectedDisposisi({
        ...detail,
        status: statusAkhir,
      });

      showToast(
        "success",
        statusAkhir === "selesai"
          ? "Disposisi berhasil diselesaikan!"
          : statusAkhir === "diproses"
          ? "Disposisi berhasil diproses!"
          : "Disposisi berhasil diperbarui!"
      );

      pag.reload();
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Gagal memperbarui disposisi!"
      );
    }
  };

  return (
    <DashboardLayout title="Disposisi">

      <div className="disposisi-page">

        {/* HEADER */}
        <div className="disposisi-header">

          <div>
            <h2>Disposisi</h2>

            <p>
              Daftar disposisi surat yang
              diberikan kepada pengguna.
            </p>
          </div>

        </div>

        {/* SEARCH + TOOLS */}
        <div
          className="disposisi-toolbar pag-tools"
        >

          <div className="search-box-disposisi">

            <Search size={18} />

            <input
              type="text"
              placeholder="Cari disposisi..."
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
            <option value="menunggu">Menunggu</option>
            <option value="dibaca">Dibaca</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>

          <EntriesSelect
            value={pag.entries}
            onChange={pag.changeEntries}
          />

        </div>

        {/* TABLE */}
        <div className="disposisi-card">

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>No. Surat</th>
                <th>Asal Surat</th>
                <th>Perihal</th>
                <th>Penerima Disposisi</th>
                <th>Tanggal Disposisi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item, index) => {
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
                        <strong>
                          {item.noSurat}
                        </strong>
                      </td>

                      <td>
                        {item.asal}
                      </td>

                      <td>
                        {item.perihal}
                      </td>

                      <td>
                        {item.penerima}
                      </td>

                      <td>
                        {formatTanggal(item.tanggalDisposisi)}
                      </td>

                      <td>

                        <span
                          className={st.className}
                        >

                          {item.status === "selesai" ? (
                            <CheckCircle
                              size={14}
                            />
                          ) : (
                            <Clock
                              size={14}
                            />
                          )}

                          {st.label}

                        </span>

                      </td>

                      <td>

                        <div className="aksi-disposisi">

                          <button
                            title="Lihat Detail"
                            onClick={() =>
                              setSelectedDisposisi(
                                item
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="empty-disposisi"
                  >
                    Belum ada data disposisi.
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
        {detail && (

          <div className="modal-overlay">

            <div className="detail-modal-disposisi">

              <div className="modal-header-disposisi">

                <div>

                  <h2>
                    Detail Disposisi
                  </h2>

                  <p>
                    Informasi disposisi surat
                  </p>

                </div>

                <button
                  className="close-button-disposisi"
                  onClick={() =>
                    setSelectedDisposisi(null)
                  }
                >
                  <X size={18} />
                </button>

              </div>

              <div className="detail-content-disposisi">

                <div className="detail-row-disposisi">
                  <span>No. Surat</span>
                  <strong>
                    {detail.noSurat}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Asal Surat</span>
                  <strong>
                    {detail.asal}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Perihal</span>
                  <strong>
                    {detail.perihal}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Pengirim</span>
                  <strong>
                    {detail.pengirim}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Instruksi</span>
                  <strong>
                    {detail.instruksi}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Catatan</span>
                  <strong>
                    {detail.catatan}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Tanggal Disposisi</span>
                  <strong>
                    {formatTanggal(detail.tanggalDisposisi)}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Status</span>
                  <strong>
                    {ubahStatus(detail.status).label}
                  </strong>
                </div>

              </div>

              <div className="modal-footer-disposisi">

                <button
                  className="btn-tutup-disposisi"
                  onClick={() =>
                    setSelectedDisposisi(null)
                  }
                >
                  Tutup
                </button>

                {detail.status ===
                  "menunggu" && (

                  <button
                    className="btn-proses-disposisi"
                    onClick={() =>
                      ubahStatusDisposisi("dibaca")
                    }
                  >
                    <Clock size={16} />
                    Tandai Dibaca
                  </button>

                )}

                {detail.status ===
                  "dibaca" && (

                  <button
                    className="btn-proses-disposisi"
                    onClick={() =>
                      ubahStatusDisposisi("diproses")
                    }
                  >
                    <Clock size={16} />
                    Proses Disposisi
                  </button>

                )}

                {detail.status ===
                  "diproses" && (

                  <button
                    className="btn-selesai-disposisi"
                    onClick={() =>
                      ubahStatusDisposisi("selesai")
                    }
                  >
                    <Check size={16} />
                    Selesaikan Disposisi
                  </button>

                )}

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Disposisi;