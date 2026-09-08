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

function Disposisi() {
  const [search, setSearch] = useState("");
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
  // SEARCH
  // =========================
  const filteredData = dataDisposisi.filter(
    (item) =>
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
        .includes(search.toLowerCase())
  );

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

        {/* SEARCH */}
        <div className="disposisi-toolbar">

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

        </div>

        {/* TABLE */}
        <div className="disposisi-card">

          <table>

            <thead>
              <tr>
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

              {filteredData.length > 0 ? (

                filteredData.map((item) => (

                  <tr key={item.id}>

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
                    colSpan="7"
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