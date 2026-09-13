import { useState } from "react";
import {
  Eye,
  X,
  Search,
  CheckCircle,
  Clock,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Disposisi.css";
import { formatTanggal } from "../../../utils/tanggal";

import {
  useServerPagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

import { api } from "../../../services/apiClient";

const STATUS_DISPOSISI = [
  "menunggu",
  "dibaca",
  "diproses",
  "selesai",
];

const labelStatus = (status) =>
  status === "menunggu"
    ? "Menunggu"
    : status === "dibaca"
    ? "Dibaca"
    : status === "diproses"
    ? "Diproses"
    : status === "selesai"
    ? "Selesai"
    : status || "-";

function Disposisi() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedDisposisi, setSelectedDisposisi] =
    useState(null);

  const fetcher = (page, perPage) =>
    api
      .get("/disposisi", {
        params: {
          page,
          per_page: perPage,
        },
      })
      .then((res) => res.data.data);

  const pag = useServerPagination(fetcher, [filterStatus]);

  const listDisposisi = pag.pageData.map((item) => ({
    id: item.id,
    noSurat: item.surat_masuk?.no_surat || "-",
    asal: item.surat_masuk?.asal_surat || "-",
    perihal: item.surat_masuk?.perihal || "-",
    pengguna: item.penerima?.nama || "-",
    tanggalDisposisi: item.tanggal_disposisi,
    status: item.status,
    instruksi: item.instruksi,
    catatan: item.catatan,
  }));

  const cocokSearch = (item) =>
    `${item.noSurat} ${item.asal} ${item.pengguna} ${item.perihal}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const filteredData = listDisposisi.filter(
    (item) =>
      cocokSearch(item) &&
      (!filterStatus || item.status === filterStatus)
  );

  const detail =
    selectedDisposisi &&
    filteredData.find((d) => d.id === selectedDisposisi.id);

  return (
    <DashboardLayout title="Disposisi">

      <div className="disposisi-page">

        {/* =========================
            HEADER
        ========================= */}
        <div className="disposisi-header">

          <div>
            <h2>Disposisi</h2>

            <p>
              Daftar disposisi surat yang
              dikirim kepada pengguna.
            </p>
          </div>

        </div>

        {/* =========================
            SEARCH + TOOLS
        ========================= */}
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

            {STATUS_DISPOSISI.map((st) => (
              <option key={st} value={st}>
                {labelStatus(st)}
              </option>
            ))}
          </select>

          <EntriesSelect
            value={pag.entries}
            onChange={pag.changeEntries}
          />

        </div>

        {/* =========================
            TABLE
        ========================= */}
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

                filteredData.map((item, index) => (

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
                      {item.pengguna}
                    </td>

                    <td>
                      {formatTanggal(item.tanggalDisposisi)}
                    </td>

                    {/* STATUS */}
                    <td>

                      <span
                        className={
                          item.status ===
                          "selesai"
                            ? "status-selesai"
                            : "status-menunggu"
                        }
                      >

                        {item.status ===
                        "selesai" ? (

                          <CheckCircle
                            size={14}
                          />

                        ) : (

                          <Clock
                            size={14}
                          />

                        )}

                        {labelStatus(item.status)}

                      </span>

                    </td>

                    {/* AKSI */}
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

                ))

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

              {/* HEADER MODAL */}
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

              {/* CONTENT */}
              <div className="detail-content-disposisi">

                <div className="detail-row-disposisi">

                  <span>
                    No. Surat
                  </span>

                  <strong>
                    {detail.noSurat}
                  </strong>

                </div>

                <div className="detail-row-disposisi">

                  <span>
                    Asal Surat
                  </span>

                  <strong>
                    {detail.asal}
                  </strong>

                </div>

                <div className="detail-row-disposisi">

                  <span>
                    Perihal
                  </span>

                  <strong>
                    {detail.perihal}
                  </strong>

                </div>

                <div className="detail-row-disposisi">

                  <span>
                    Penerima Disposisi
                  </span>

                  <strong>
                    {detail.pengguna}
                  </strong>

                </div>

                <div className="detail-row-disposisi">

                  <span>
                    Instruksi
                  </span>

                  <strong>
                    {detail.instruksi}
                  </strong>

                </div>

                <div className="detail-row-disposisi">

                  <span>
                    Catatan
                  </span>

                  <strong>
                    {detail.catatan || "-"}
                  </strong>

                </div>

                <div className="detail-row-disposisi">

                  <span>
                    Tanggal Disposisi
                  </span>

                  <strong>
                    {formatTanggal(detail.tanggalDisposisi)}
                  </strong>

                </div>

                <div className="detail-row-disposisi">

                  <span>
                    Status
                  </span>

                  <strong>
                    {labelStatus(detail.status)}
                  </strong>

                </div>

              </div>

              {/* FOOTER */}
              <div className="modal-footer-disposisi">

                <button
                  className="btn-tutup-disposisi"
                  onClick={() =>
                    setSelectedDisposisi(null)
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

export default Disposisi;