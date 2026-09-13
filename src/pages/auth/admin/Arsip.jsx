import { useState } from "react";
import {
  Search,
  Eye,
  X,
  Archive,
  Download,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Arsip.css";
import { formatTanggal } from "../../../utils/tanggal";

import {
  useServerPagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

import { api } from "../../../services/apiClient";

function Arsip() {
  const [search, setSearch] = useState("");
  const [selectedArsip, setSelectedArsip] =
    useState(null);

  const fetcher = (page, perPage) =>
    api
      .get("/arsip-digital", {
        params: {
          page,
          per_page: perPage,
        },
      })
      .then((res) => res.data.data);

  const pag = useServerPagination(fetcher, []);

  const listArsip = pag.pageData.map((item) => ({
    id: item.id,
    noSurat: item.surat_masuk?.no_surat || "-",
    perihal: item.surat_masuk?.perihal || "-",
    asal: item.surat_masuk?.asal_surat || "-",
    tanggalDiterima: item.surat_masuk?.tanggal_terima,
    namaFile: item.nama_file,
    status: "Diarsipkan",
  }));

  const cocokSearch = (item) =>
    `${item.noSurat} ${item.perihal} ${item.asal} ${item.tanggalDiterima}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const filteredData = listArsip.filter(cocokSearch);

  const detail =
    selectedArsip &&
    filteredData.find((d) => d.id === selectedArsip.id);

  const unduhFile = async (arsipId) => {
    try {
      const res = await api.get(
        `/arsip-digital/${arsipId}/download`,
        { responseType: "blob" }
      );

      const disposition = res.headers["content-disposition"] || "";
      const nama =
        disposition.match(/filename="?([^";]+)"?/i)?.[1] ||
        "arsip-file";

      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = nama;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // abaikan kesalahan download
    }
  };

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
                      {item.perihal}
                    </td>

                    <td>
                      {item.asal}
                    </td>

                    <td>
                      {formatTanggal(item.tanggalDiterima)}
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

                        <button
                          className="arsip-btn arsip-btn-download"
                          title="Download File"
                          onClick={() => unduhFile(item.id)}
                        >
                          <Download
                            size={17}
                          />
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
        {detail && (

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
                    {detail.noSurat}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Perihal
                  </span>

                  <strong>
                    {detail.perihal}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Asal Surat
                  </span>

                  <strong>
                    {detail.asal}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Tanggal Diterima
                  </span>

                  <strong>
                    {formatTanggal(detail.tanggalDiterima)}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    Status
                  </span>

                  <strong>
                    {detail.status}
                  </strong>
                </div>

                <div className="arsip-detail-item">
                  <span>
                    File Surat
                  </span>

                  <strong>
                    {detail.namaFile || "-"}
                  </strong>
                </div>

              </div>

              <div className="arsip-modal-footer">

                <button
                  className="arsip-btn arsip-btn-download"
                  onClick={() => unduhFile(detail.id)}
                >
                  <Download size={16} />
                  Download
                </button>

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