import { useEffect, useState } from "react";
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

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function Disposisi() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dataDisposisi, setDataDisposisi] = useState([]);
  const [selectedDisposisi, setSelectedDisposisi] =
    useState(null);

  // =========================
  // AMBIL DATA DISPOSISI
  // =========================
  useEffect(() => {
    const ambilData = () => {
      const data =
        JSON.parse(
          localStorage.getItem("dataDisposisi")
        ) || [];

      setDataDisposisi(data);
    };

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
  const filteredData = dataDisposisi.filter(
    (item) => {
      const cocokSearch =
        item.noSurat
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.asal
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.pengguna
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.perihal
          ?.toLowerCase()
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

  // =========================
  // PROSES DISPOSISI
  // =========================
  const prosesDisposisi = () => {
    if (!selectedDisposisi) return;

    // =========================
    // UPDATE DISPOSISI
    // =========================
    const dataBaru = dataDisposisi.map(
      (item) =>
        item.id === selectedDisposisi.id
          ? {
              ...item,
              status: "Diproses",
            }
          : item
    );

    localStorage.setItem(
      "dataDisposisi",
      JSON.stringify(dataBaru)
    );

    setDataDisposisi(dataBaru);

    // =========================
    // UPDATE STATUS SURAT
    // =========================
    const dataSurat =
      JSON.parse(
        localStorage.getItem("dataSurat")
      ) || [];

    const suratUpdate = dataSurat.map(
      (surat) =>
        surat.noSurat ===
        selectedDisposisi.noSurat
          ? {
              ...surat,
              status: "Diproses",
            }
          : surat
    );

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(suratUpdate)
    );

    // =========================
    // UPDATE MODAL
    // =========================
    setSelectedDisposisi({
      ...selectedDisposisi,
      status: "Diproses",
    });

    alert("Disposisi berhasil diproses!");
  };

  // =========================
  // SELESAIKAN DISPOSISI
  // =========================
  const selesaikanDisposisi = () => {
    if (!selectedDisposisi) return;

    // =========================
    // UPDATE DISPOSISI
    // =========================
    const dataBaru = dataDisposisi.map(
      (item) =>
        item.id === selectedDisposisi.id
          ? {
              ...item,
              status: "Selesai",
            }
          : item
    );

    localStorage.setItem(
      "dataDisposisi",
      JSON.stringify(dataBaru)
    );

    setDataDisposisi(dataBaru);

    // =========================
    // UPDATE STATUS SURAT
    // =========================
    const dataSurat =
      JSON.parse(
        localStorage.getItem("dataSurat")
      ) || [];

    const suratUpdate = dataSurat.map(
      (surat) =>
        surat.noSurat ===
        selectedDisposisi.noSurat
          ? {
              ...surat,
              status: "Selesai",
            }
          : surat
    );

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(suratUpdate)
    );

    // =========================
    // UPDATE MODAL
    // =========================
    setSelectedDisposisi({
      ...selectedDisposisi,
      status: "Selesai",
    });

    alert(
      "Disposisi berhasil diselesaikan!"
    );
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

            {[
              ...new Set(
                dataDisposisi
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
        <div className="disposisi-card">

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>No. Surat</th>
                <th>Asal Surat</th>
                <th>Perihal</th>
                <th>Pengguna</th>
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
                      {item.asal}
                    </td>

                    <td>
                      {item.perihal}
                    </td>

                    <td>
                      {item.pengguna}
                    </td>

                    <td>
                      {item.tanggal}
                    </td>

                    <td>

                      <span
                        className={
                          item.status ===
                          "Selesai"
                            ? "status-selesai"
                            : item.status ===
                              "Diproses"
                            ? "status-diproses"
                            : "status-menunggu"
                        }
                      >

                        {item.status ===
                        "Selesai" ? (
                          <CheckCircle
                            size={14}
                          />
                        ) : (
                          <Clock
                            size={14}
                          />
                        )}

                        {item.status}

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
        {selectedDisposisi && (

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
                    {selectedDisposisi.noSurat}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Asal Surat</span>
                  <strong>
                    {selectedDisposisi.asal}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Perihal</span>
                  <strong>
                    {selectedDisposisi.perihal}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Pengguna</span>
                  <strong>
                    {selectedDisposisi.pengguna}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Instruksi</span>
                  <strong>
                    {selectedDisposisi.instruksi}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Catatan</span>
                  <strong>
                    {selectedDisposisi.catatan ||
                      "-"}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Tanggal</span>
                  <strong>
                    {selectedDisposisi.tanggal}
                  </strong>
                </div>

                <div className="detail-row-disposisi">
                  <span>Status</span>
                  <strong>
                    {selectedDisposisi.status}
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

                {selectedDisposisi.status ===
                  "Menunggu" && (

                  <button
                    className="btn-proses-disposisi"
                    onClick={prosesDisposisi}
                  >
                    <Clock size={16} />
                    Proses Disposisi
                  </button>

                )}

                {selectedDisposisi.status ===
                  "Diproses" && (

                  <button
                    className="btn-selesai-disposisi"
                    onClick={
                      selesaikanDisposisi
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