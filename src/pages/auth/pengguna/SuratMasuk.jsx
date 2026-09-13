import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import { formatTanggal } from "../../../utils/tanggal";

import {
  useServerPagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

import { api } from "../../../services/apiClient";

const STATUS_MAP = {
  baru: { label: "Baru", className: "status-baru" },
  didisposisi: { label: "Didisposisi", className: "status-didisposisikan" },
  diarsipkan: { label: "Diarsipkan", className: "status-diarsipkan" },
};

function SuratMasuk() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetcher = (page, perPage) =>
    api
      .get("/surat-masuk", {
        params: { page, per_page: perPage, search, status: filterStatus },
      })
      .then((res) => res.data?.data || { data: [] });

  const pag = useServerPagination(fetcher, [search, filterStatus]);

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
            <option value="baru">Baru</option>
            <option value="didisposisi">Didisposisi</option>
            <option value="diarsipkan">Diarsipkan</option>
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

                pag.pageData.map((item, index) => {
                  const st = STATUS_MAP[item.status] || { label: item.status || "-", className: "" };

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
                          {item.no_agenda}
                        </strong>
                      </td>

                      <td>
                        {item.no_surat}
                      </td>

                      <td>
                        {formatTanggal(
                          item.tanggal_surat
                        )}
                      </td>

                      <td>
                        {item.sifat_surat?.nama_sifat || "-"}
                      </td>

                      <td>
                        {item.asal_surat}
                      </td>

                      <td>
                        {item.tujuan_surat || "-"}
                      </td>

                      <td>
                        {item.perihal}
                      </td>

                      <td>
                        <span
                          className={`status ${st.className}`}
                        >
                          {st.label}
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
                              navigate(`/pengguna/surat-masuk/lihat/${item.id}`)
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

      </div>

    </DashboardLayout>
  );
}

export default SuratMasuk;