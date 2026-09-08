import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  Archive,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./ArsipDigital.css";

function ArsipDigital() {
  const [dataArsip, setDataArsip] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedArsip, setSelectedArsip] = useState(null);

  // =========================
  // AMBIL DATA SURAT
  // =========================
  useEffect(() => {
    const ambilData = () => {
      const dataSurat =
        JSON.parse(localStorage.getItem("dataSurat")) || [];

      const arsip = dataSurat.filter(
        (item) =>
          item.status === "Selesai" ||
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

    ambilData();

    window.addEventListener("storage", ambilData);

    const interval = setInterval(ambilData, 1000);

    return () => {
      window.removeEventListener("storage", ambilData);
      clearInterval(interval);
    };
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredData = dataArsip.filter((item) => {
    const keyword = search.toLowerCase();

    const cocokSearch =
      `${item.noSurat || ""} ${item.isi || ""} ${
        item.asal || ""
      } ${item.tanggal || ""}`
        .toLowerCase()
        .includes(keyword);

    const cocokStatus =
      filterStatus === "Semua" ||
      item.status === filterStatus;

    return cocokSearch && cocokStatus;
  });

  return (
    <DashboardLayout title="Arsip Digital">

      <div className="arsip-digital-page">

        {/* HEADER */}
        <div className="arsip-digital-header">

          <div>
            <div className="arsip-breadcrumb">
              Arsip / Arsip Digital
            </div>

            <h1>Arsip Digital</h1>

            <p>
              Daftar surat yang telah selesai diproses
            </p>
          </div>

          <div className="arsip-total">

            <Archive size={21} />

            <div>
              <span>Total Arsip</span>
              <strong>{dataArsip.length}</strong>
            </div>

          </div>

        </div>

        {/* TOOLBAR */}
        <div className="arsip-digital-toolbar">

          <div className="arsip-digital-search">

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
            className="arsip-digital-filter"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
          >
            <option value="Semua">
              Semua Status
            </option>

            <option value="Selesai">
              Selesai
            </option>

            <option value="Disetujui">
              Disetujui
            </option>
          </select>

        </div>

        {/* TABLE */}
        <div className="arsip-digital-card">

          <div className="arsip-digital-card-header">

            <div>
              <h2>Daftar Arsip Surat</h2>

              <p>
                Surat yang sudah selesai diproses
                tersimpan di arsip digital.
              </p>
            </div>

          </div>

          <div className="arsip-table-wrapper">

            <table className="arsip-digital-table">

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

                  filteredData.map((arsip, index) => (

                    <tr key={arsip.id}>

                      <td>{index + 1}</td>

                      <td>
                        <strong>
                          {arsip.noSurat}
                        </strong>
                      </td>

                      <td>
                        {arsip.isi}
                      </td>

                      <td>
                        {arsip.asal}
                      </td>

                      <td>
                        {arsip.tanggal}
                      </td>

                      <td>

                        <span
                          className={`arsip-status ${
                            arsip.status
                              ?.toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >
                          {arsip.status}
                        </span>

                      </td>

                      <td>

                        <button
                          className="arsip-view-btn"
                          onClick={() =>
                            setSelectedArsip(arsip)
                          }
                          title="Lihat Detail"
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
                      className="arsip-empty"
                    >

                      <Archive size={38} />

                      <strong>
                        Belum Ada Arsip
                      </strong>

                      <span>
                        Surat yang selesai diproses
                        akan muncul di sini.
                      </span>

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL DETAIL */}
      {selectedArsip && (

        <div className="arsip-modal-overlay">

          <div className="arsip-modal">

            <div className="arsip-modal-header">

              <div>
                <h2>Detail Arsip</h2>

                <p>
                  Informasi lengkap surat
                </p>
              </div>

              <button
                className="arsip-close"
                onClick={() =>
                  setSelectedArsip(null)
                }
              >
                <X size={21} />
              </button>

            </div>

            <div className="arsip-detail">

              <div className="arsip-detail-item">
                <span>Nomor Surat</span>

                <strong>
                  {selectedArsip.noSurat}
                </strong>
              </div>

              <div className="arsip-detail-item">
                <span>Perihal</span>

                <strong>
                  {selectedArsip.isi}
                </strong>
              </div>

              <div className="arsip-detail-item">
                <span>Asal Surat</span>

                <strong>
                  {selectedArsip.asal}
                </strong>
              </div>

              <div className="arsip-detail-item">
                <span>Tanggal</span>

                <strong>
                  {selectedArsip.tanggal}
                </strong>
              </div>

              <div className="arsip-detail-item">
                <span>Status</span>

                <span
                  className={`arsip-status ${
                    selectedArsip.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")
                  }`}
                >
                  {selectedArsip.status}
                </span>
              </div>

              <div className="arsip-detail-item">
                <span>Keterangan</span>

                <strong>
                  Surat telah selesai diproses
                  dan masuk ke arsip digital.
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

    </DashboardLayout>
  );
}

export default ArsipDigital;