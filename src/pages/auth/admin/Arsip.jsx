import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  Archive,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Arsip.css";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function Arsip() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dataArsip, setDataArsip] = useState([]);
  const [selectedArsip, setSelectedArsip] =
    useState(null);

  // =========================
  // AMBIL SURAT SELESAI
  // =========================
  const ambilArsip = () => {
    const dataSurat =
      JSON.parse(
        localStorage.getItem("dataSurat")
      ) || [];

    const arsip = dataSurat.filter(
      (item) =>
        item.status === "Selesai" ||
        item.status === "Disetujui"
    );

    setDataArsip(arsip);
  };

  useEffect(() => {
    ambilArsip();

    window.addEventListener(
      "storage",
      ambilArsip
    );

    const interval = setInterval(
      ambilArsip,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        ambilArsip
      );

      clearInterval(interval);
    };
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredData = dataArsip.filter(
    (item) => {
      const cocokSearch =
        `${item.noSurat || ""} ${
          item.isi || ""
        } ${item.asal || ""} ${
          item.tanggal || ""
        }`
          .toLowerCase()
          .includes(search.toLowerCase());

      const cocokStatus =
        !filterStatus ||
        item.status === filterStatus;

      return cocokSearch && cocokStatus;
    }
  );

  // =========================
  // PAGINATION
  // =========================
  const pag = usePagination(filteredData);

  return (
    <DashboardLayout title="Arsip Digital">

      <div className="arsip-page">

        {/* HEADER */}
        <div className="arsip-header">

          <div>

            <h2>
              Arsip Digital
            </h2>

            <p>
              Daftar surat yang telah
              selesai diproses.
            </p>

          </div>

        </div>

        {/* TOOLBAR */}
        <div
          className="arsip-toolbar pag-tools"
        >

          <div className="arsip-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Cari arsip..."
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
                dataArsip
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
        <div className="arsip-table-card">

          <table className="arsip-table">

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
                        {item.noSurat}
                      </strong>
                    </td>

                    <td>
                      {item.isi}
                    </td>

                    <td>
                      {item.asal}
                    </td>

                    <td>
                      {item.tanggal}
                    </td>

                    <td>

                      <span className="jenis-arsip">
                        <Archive size={14} />
                        {item.status}
                      </span>

                    </td>

                    <td>

                      <div className="arsip-actions">

                        <button
                          className="arsip-btn arsip-btn-view"
                          title="Lihat Detail"
                          onClick={() =>
                            setSelectedArsip(item)
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
                    colSpan="7"
                    className="arsip-empty"
                  >
                    Belum ada surat yang
                    masuk ke arsip.
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
        {selectedArsip && (

          <div className="arsip-modal-overlay">

            <div className="arsip-modal">

              <div className="arsip-modal-header">

                <div>

                  <h2>
                    Detail Arsip
                  </h2>

                  <p>
                    Informasi surat yang
                    telah diarsipkan
                  </p>

                </div>

                <button
                  className="arsip-close"
                  onClick={() =>
                    setSelectedArsip(null)
                  }
                >
                  <X size={18} />
                </button>

              </div>

              <div className="arsip-detail">

                <div className="arsip-detail-item">
                  <span>
                    No. Surat
                  </span>

                  <strong>
                    {selectedArsip.noSurat}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Perihal
                  </span>

                  <strong>
                    {selectedArsip.isi}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Asal Surat
                  </span>

                  <strong>
                    {selectedArsip.asal}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Tanggal
                  </span>

                  <strong>
                    {selectedArsip.tanggal}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Status
                  </span>

                  <strong>
                    {selectedArsip.status}
                  </strong>
                </div>

              </div>

              <div className="arsip-modal-footer">

                <button
                  className="arsip-close-large"
                  onClick={() =>
                    setSelectedArsip(null)
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

export default Arsip;