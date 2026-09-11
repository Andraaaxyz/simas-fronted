import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  Download,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import FileDokumen from "../../../component/FileDokumen";
import { formatTanggal } from "../../../utils/tanggal";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function ArsipDigital() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dataArsip, setDataArsip] = useState([]);
  const [selectedArsip, setSelectedArsip] =
    useState(null);

  // =========================
  // AMBIL SURAT ARSIP
  // =========================
  const ambilData = () => {
    const dataSuratLama =
      JSON.parse(
        localStorage.getItem("dataSurat")
      ) || [];

    const dataSurat = dataSuratLama.map((item) =>
      item.perihal !== undefined
        ? item
        : {
            ...item,
            perihal: item.perihal || item.isi || "",
            tanggalSurat: item.tanggalSurat || "",
            tanggalDiterima:
              item.tanggalDiterima ||
              item.tanggal ||
              "",
            tujuan: item.tujuan || "",
            file: item.file || "",
            lampiran: item.lampiran || "",
          }
    );

    const arsip = dataSurat.filter(
      (item) =>
        item.status === "Selesai" ||
        item.status === "Diarsipkan" ||
        item.status === "Disetujui"
    );

    setDataArsip(arsip);

    setSelectedArsip((prev) => {
      if (!prev) return null;

      const update = arsip.find(
        (item) => item.id === prev.id
      );

      return update || null;
    });
  };

  useEffect(() => {
    ambilData();

    window.addEventListener(
      "storage",
      ambilData
    );

    const interval = setInterval(
      ambilData,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        ambilData
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
          item.perihal || ""
        } ${item.asal || ""} ${
          item.noAgenda || ""
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

      <div className="surat-page">

        {/* HEADER */}
        <div className="surat-header">

          <div>
            <h2>Arsip Digital</h2>

            <p>
              Daftar surat yang telah
              selesai diproses.
            </p>
          </div>

        </div>

        {/* SEARCH + TOOLS */}
        <div className="surat-toolbar pag-tools">

          <div className="search-box">

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
        <div className="table-card">

          <table>

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
                      {item.perihal}
                    </td>

                    <td>
                      {item.asal}
                    </td>

                    <td>
                      {formatTanggal(
                        item.tanggalDiterima
                      )}
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

                      <div className="surat-actions">

                        <button
                          className="btn-eye"
                          title="Lihat Detail"
                          onClick={() =>
                            setSelectedArsip(item)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        {item.file && (
                          <a
                            className="btn-eye btn-download-arsip"
                            title="Download File"
                            href={
                              typeof item.file ===
                              "string"
                                ? item.file
                                : item.file.data
                            }
                            download={
                              typeof item.file ===
                              "string"
                                ? item.file
                                : item.file.nama
                            }
                          >
                            <Download
                              size={17}
                            />
                          </a>
                        )}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="empty"
                  >
                    Belum ada surat yang
                    masuk ke arsip.
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

        {/* =========================
            MODAL DETAIL
        ========================= */}
        {selectedArsip && (

          <div className="modal-overlay">

            <div className="detail-modal">

              {/* HEADER */}
              <div className="modal-header">

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
                  className="close-button"
                  onClick={() =>
                    setSelectedArsip(null)
                  }
                >
                  <X size={18} />
                </button>

              </div>

              <div className="detail-content">

                <div className="detail-row">
                  <span>No. Surat</span>
                  <strong>
                    {selectedArsip.noSurat}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Asal Surat</span>
                  <strong>
                    {selectedArsip.asal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tujuan Surat</span>
                  <strong>
                    {selectedArsip.tujuan || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Perihal</span>
                  <strong>
                    {selectedArsip.perihal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tanggal Diterima</span>
                  <strong>
                    {formatTanggal(
                      selectedArsip.tanggalDiterima
                    )}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>File Surat</span>
                  <strong>
                    <FileDokumen
                      value={selectedArsip.file}
                    />
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Status</span>
                  <strong>
                    {selectedArsip.status}
                  </strong>
                </div>

              </div>

              {/* FOOTER */}
              <div className="modal-footer">

                <button
                  className="btn-tutup"
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

export default ArsipDigital;