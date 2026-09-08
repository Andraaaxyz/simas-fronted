import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  CheckCircle,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

function SuratMasuk() {
  const [search, setSearch] = useState("");
  const [dataSurat, setDataSurat] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);

  const [keputusan, setKeputusan] = useState("");


  // =========================
  // AMBIL DATA SURAT
  // =========================

  const ambilDataSurat = () => {
    const data =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    setDataSurat(data);
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
  // SEARCH
  // =========================

  const filteredData = dataSurat.filter((item) =>
    `${item.noSurat} ${item.isi} ${item.asal}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  // =========================
  // SIMPAN KEPUTUSAN
  // =========================

  const simpanKeputusan = () => {

    if (!keputusan) {
      alert("Silakan pilih keputusan terlebih dahulu!");
      return;
    }

    const dataBaru = dataSurat.map((item) =>
      item.id === selectedSurat.id
        ? {
            ...item,
            keputusan: keputusan,
            status:
              keputusan === "Disetujui"
                ? "Disetujui"
                : "Ditolak",
          }
        : item
    );

    // Simpan ke localStorage
    localStorage.setItem(
      "dataSurat",
      JSON.stringify(dataBaru)
    );

    setDataSurat(dataBaru);

    const suratUpdate = dataBaru.find(
      (item) => item.id === selectedSurat.id
    );

    setSelectedSurat(suratUpdate);

    alert("Keputusan berhasil disimpan!");

    setKeputusan("");
  };


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

        <div className="surat-toolbar">

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

        </div>


        {/* =========================
            TABLE
        ========================= */}

        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>No. Surat</th>
                <th>Isi / Perihal</th>
                <th>Asal Surat</th>
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
                      {item.isi}
                    </td>

                    <td>
                      {item.asal}
                    </td>

                    <td>
                      {item.tanggal}
                    </td>

                    <td>

                      <span className="status">
                        {item.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="btn-eye"
                        title="Lihat Detail"
                        onClick={() => {
                          setSelectedSurat(item);
                          setKeputusan(
                            item.keputusan || ""
                          );
                        }}
                      >
                        <Eye size={17} />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
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
            MODAL DETAIL
        ========================= */}

        {selectedSurat && (

          <div
            className="modal-overlay"
            onClick={() =>
              setSelectedSurat(null)
            }
          >

            <div
              className="detail-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="modal-header">

                <div>

                  <h2>
                    Detail Surat
                  </h2>

                  <p>
                    Informasi dan keputusan surat
                  </p>

                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setSelectedSurat(null)
                  }
                >
                  <X size={18} />
                </button>

              </div>


              {/* DETAIL */}

              <div className="detail-content">

                <div className="detail-row">

                  <span>
                    No. Surat
                  </span>

                  <strong>
                    {selectedSurat.noSurat}
                  </strong>

                </div>


                <div className="detail-row">

                  <span>
                    Perihal
                  </span>

                  <strong>
                    {selectedSurat.isi}
                  </strong>

                </div>


                <div className="detail-row">

                  <span>
                    Asal Surat
                  </span>

                  <strong>
                    {selectedSurat.asal}
                  </strong>

                </div>


                <div className="detail-row">

                  <span>
                    Tanggal
                  </span>

                  <strong>
                    {selectedSurat.tanggal}
                  </strong>

                </div>


                <div className="detail-row">

                  <span>
                    Status
                  </span>

                  <strong>
                    {selectedSurat.status}
                  </strong>

                </div>


                {/* KEPUTUSAN */}

                <div className="form-group">

                  <label>
                    Keputusan Pimpinan
                  </label>

                  <select
                    value={keputusan}
                    onChange={(e) =>
                      setKeputusan(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Pilih Keputusan
                    </option>

                    <option value="Disetujui">
                      Disetujui
                    </option>

                    <option value="Ditolak">
                      Ditolak
                    </option>

                  </select>

                </div>

              </div>


              {/* FOOTER */}

              <div className="modal-footer">

                <button
                  className="btn-tutup"
                  onClick={() =>
                    setSelectedSurat(null)
                  }
                >
                  Tutup
                </button>


                <button
                  className="btn-simpan"
                  onClick={simpanKeputusan}
                >

                  <CheckCircle size={17} />

                  Simpan Keputusan

                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default SuratMasuk;