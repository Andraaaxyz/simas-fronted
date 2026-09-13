import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  ClipboardList,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import { formatTanggal } from "../../../utils/tanggal";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function SuratMasuk() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dataSurat, setDataSurat] = useState([]);

  // =========================
  // AMBIL DATA SURAT
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

  const ambilDataSurat = () => {
    const data =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    setDataSurat(migrasiData(data));
  };

  useEffect(() => {
    ambilDataSurat();

    window.addEventListener(
      "storage",
      ambilDataSurat
    );

    return () => {
      window.removeEventListener(
        "storage",
        ambilDataSurat
      );
    };
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredData = dataSurat.filter((item) => {
    const cocokSearch = `${item.noSurat || ""} ${
      item.perihal || ""
    } ${item.asal || ""} ${item.noAgenda || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const cocokStatus =
      !filterStatus ||
      item.status === filterStatus;

    return cocokSearch && cocokStatus;
  });

  // =========================
  // PAGINATION
  // =========================

  const pag = usePagination(filteredData);

  return (
    <DashboardLayout title="Surat Masuk">

      <div className="surat-page">

        {/* =========================
            HEADER
        ========================= */}

        <div className="surat-header">

          <div>

            <h2>
              Surat Masuk
            </h2>

            <p>
              Kelola dan berikan keputusan terhadap surat masuk.
            </p>

          </div>

        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div
          className="surat-toolbar pag-tools"
        >

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

        {/* =========================
            TABLE
        ========================= */}

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
                      <strong>
                        {item.noSurat}
                      </strong>
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
                          flexWrap: "wrap",
                        }}
                      >

                        <button
                          className="btn-eye"
                          title="Lihat Detail"
                          onClick={() =>
                            navigate(`/pimpinan/surat-masuk/lihat/${item.id}`)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        {!item.disposisi && (
                          <button
                            className="btn-disposisi-aksi"
                            title="Buat Disposisi"
                            onClick={() =>
                              navigate(`/pimpinan/surat-masuk/disposisi/${item.id}`)
                            }
                          >
                            <ClipboardList
                              size={17}
                            />
                          </button>
                        )}

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

      </div>

    </DashboardLayout>
  );
}

export default SuratMasuk;
