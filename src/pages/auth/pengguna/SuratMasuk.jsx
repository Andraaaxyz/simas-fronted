import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  ClipboardList,
  X,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

function SuratMasuk() {
  const [search, setSearch] = useState("");
  const [selectedSurat, setSelectedSurat] = useState(null);

  const [showTambah, setShowTambah] = useState(false);
  const [showDisposisi, setShowDisposisi] = useState(false);

  const [dataSurat, setDataSurat] = useState([]);

  const [formSurat, setFormSurat] = useState({
    noSurat: "",
    isi: "",
    asal: "",
    tanggal: "",
  });

  const [disposisiForm, setDisposisiForm] = useState({
    pengguna: "",
    instruksi: "",
  });


  // =========================
  // AMBIL DATA SURAT
  // =========================

  useEffect(() => {
    const dataLama =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    if (dataLama.length > 0) {
      setDataSurat(dataLama);
    } else {

      const dataAwal = [
        {
          id: 1,
          noSurat: "001/089/SK/2026",
          isi: "Undangan Rapat Koordinasi",
          asal: "Dinas Pendidikan",
          tanggal: "20 Agustus 2026",
          status: "Baru",
        },
        {
          id: 2,
          noSurat: "002/090/SK/2026",
          isi: "Pemberitahuan Kegiatan",
          asal: "Dinas Kesehatan",
          tanggal: "21 Agustus 2026",
          status: "Diproses",
        },
        {
          id: 3,
          noSurat: "003/091/SK/2026",
          isi: "Surat Permohonan",
          asal: "Dinas Sosial",
          tanggal: "22 Agustus 2026",
          status: "Selesai",
        },
      ];

      setDataSurat(dataAwal);

      localStorage.setItem(
        "dataSurat",
        JSON.stringify(dataAwal)
      );
    }
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
  // TAMBAH SURAT
  // =========================

  const tambahSurat = () => {

    if (
      !formSurat.noSurat ||
      !formSurat.isi ||
      !formSurat.asal ||
      !formSurat.tanggal
    ) {
      alert("Semua data surat wajib diisi!");
      return;
    }

    const suratBaru = {
      id: Date.now(),
      noSurat: formSurat.noSurat,
      isi: formSurat.isi,
      asal: formSurat.asal,
      tanggal: formSurat.tanggal,
      status: "Baru",
    };

    const dataBaru = [
      ...dataSurat,
      suratBaru,
    ];

    setDataSurat(dataBaru);

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(dataBaru)
    );

    setFormSurat({
      noSurat: "",
      isi: "",
      asal: "",
      tanggal: "",
    });

    setShowTambah(false);

    alert("Surat berhasil ditambahkan!");
  };


  // =========================
  // BUKA DISPOSISI
  // =========================

  const bukaDisposisi = (surat) => {
    setSelectedSurat(surat);
    setShowDisposisi(true);
  };


  // =========================
  // KIRIM DISPOSISI
  // =========================

  const kirimDisposisi = () => {

    if (
      !disposisiForm.pengguna ||
      !disposisiForm.instruksi
    ) {
      alert("Pengguna dan instruksi wajib diisi!");
      return;
    }

    const disposisiBaru = {
      id: Date.now(),

      noSurat: selectedSurat.noSurat,

      asal: selectedSurat.asal,

      tanggal: selectedSurat.tanggal,

      perihal: selectedSurat.isi,

      instruksi: disposisiForm.instruksi,

      pengguna: disposisiForm.pengguna,

      status: "Menunggu",
    };

    const dataLama =
      JSON.parse(
        localStorage.getItem("dataDisposisi")
      ) || [];

    const dataBaru = [
      ...dataLama,
      disposisiBaru,
    ];

    localStorage.setItem(
      "dataDisposisi",
      JSON.stringify(dataBaru)
    );


    // Update status surat
    const suratUpdate = dataSurat.map((item) =>
      item.id === selectedSurat.id
        ? {
            ...item,
            status: "Diproses",
          }
        : item
    );

    setDataSurat(suratUpdate);

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(suratUpdate)
    );


    setShowDisposisi(false);

    setSelectedSurat(null);

    setDisposisiForm({
      pengguna: "",
      instruksi: "",
    });

    alert("Disposisi berhasil dikirim!");
  };


  return (
    <DashboardLayout title="Surat Masuk">

      <div className="surat-page">

        {/* HEADER */}

        <div className="surat-header">

          <div>
            <h2>Surat Masuk</h2>

            <p>
              Kelola surat masuk yang diterima.
            </p>
          </div>

          <button
            className="btn-tambah-surat"
            onClick={() => setShowTambah(true)}
          >
            <Plus size={18} />
            Tambah Surat
          </button>

        </div>


        {/* SEARCH */}

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


        {/* TABLE */}

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

              {filteredData.map((item) => (

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

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >

                      {/* DETAIL */}

                      <button
                        className="btn-eye"
                        title="Lihat Detail"
                        onClick={() =>
                          setSelectedSurat(item)
                        }
                      >
                        <Eye size={17} />
                      </button>


                      {/* DISPOSISI */}

                      <button
                        className="btn-eye"
                        title="Buat Disposisi"
                        onClick={() =>
                          bukaDisposisi(item)
                        }
                      >
                        <ClipboardList size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =========================
            MODAL TAMBAH SURAT
        ========================= */}

        {showTambah && (

          <div className="modal-overlay">

            <div className="detail-modal">

              <div className="modal-header">

                <div>
                  <h2>Tambah Surat</h2>

                  <p>
                    Masukkan data surat masuk
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setShowTambah(false)
                  }
                >
                  <X size={18} />
                </button>

              </div>


              <div className="detail-content">

                <div className="form-group">
                  <label>No. Surat</label>

                  <input
                    type="text"
                    placeholder="Contoh: 004/092/SK/2026"
                    value={formSurat.noSurat}
                    onChange={(e) =>
                      setFormSurat({
                        ...formSurat,
                        noSurat: e.target.value,
                      })
                    }
                  />
                </div>


                <div className="form-group">
                  <label>Isi / Perihal</label>

                  <input
                    type="text"
                    placeholder="Masukkan perihal surat"
                    value={formSurat.isi}
                    onChange={(e) =>
                      setFormSurat({
                        ...formSurat,
                        isi: e.target.value,
                      })
                    }
                  />
                </div>


                <div className="form-group">
                  <label>Asal Surat</label>

                  <input
                    type="text"
                    placeholder="Contoh: Dinas Pendidikan"
                    value={formSurat.asal}
                    onChange={(e) =>
                      setFormSurat({
                        ...formSurat,
                        asal: e.target.value,
                      })
                    }
                  />
                </div>


                <div className="form-group">
                  <label>Tanggal</label>

                  <input
                    type="text"
                    placeholder="Contoh: 25 Agustus 2026"
                    value={formSurat.tanggal}
                    onChange={(e) =>
                      setFormSurat({
                        ...formSurat,
                        tanggal: e.target.value,
                      })
                    }
                  />
                </div>

              </div>


              <div className="modal-footer">

                <button
                  className="btn-tutup"
                  onClick={() =>
                    setShowTambah(false)
                  }
                >
                  Batal
                </button>

                <button
                  className="btn-simpan"
                  onClick={tambahSurat}
                >
                  Simpan Surat
                </button>

              </div>

            </div>

          </div>

        )}


        {/* =========================
            MODAL DETAIL / DISPOSISI
        ========================= */}

        {selectedSurat && !showDisposisi && (

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

              <div className="modal-header">

                <div>
                  <h2>Detail Surat</h2>

                  <p>
                    Informasi surat masuk
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


              <div className="detail-content">

                <div className="detail-row">
                  <span>No. Surat</span>

                  <strong>
                    {selectedSurat.noSurat}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Perihal</span>

                  <strong>
                    {selectedSurat.isi}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Asal Surat</span>

                  <strong>
                    {selectedSurat.asal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tanggal</span>

                  <strong>
                    {selectedSurat.tanggal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Status</span>

                  <strong>
                    {selectedSurat.status}
                  </strong>
                </div>

              </div>


              <div className="modal-footer">

                <button
                  className="btn-tutup"
                  onClick={() =>
                    setSelectedSurat(null)
                  }
                >
                  Tutup
                </button>

              </div>

            </div>

          </div>

        )}


        {/* =========================
            MODAL DISPOSISI
        ========================= */}

        {showDisposisi && selectedSurat && (

          <div className="modal-overlay">

            <div className="detail-modal">

              <div className="modal-header">

                <div>
                  <h2>Disposisi Surat</h2>

                  <p>
                    Kirim surat kepada pengguna
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() => {
                    setShowDisposisi(false);
                    setSelectedSurat(null);
                  }}
                >
                  <X size={18} />
                </button>

              </div>


              <div className="detail-content">

                <div className="form-group">
                  <label>No. Surat</label>

                  <input
                    value={selectedSurat.noSurat}
                    disabled
                  />
                </div>


                <div className="form-group">
                  <label>Asal Surat</label>

                  <input
                    value={selectedSurat.asal}
                    disabled
                  />
                </div>


                <div className="form-group">
                  <label>Pengguna</label>

                  <select
                    value={disposisiForm.pengguna}
                    onChange={(e) =>
                      setDisposisiForm({
                        ...disposisiForm,
                        pengguna: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Pilih Pengguna
                    </option>

                    <option value="Pengguna 1">
                      Pengguna 1
                    </option>

                    <option value="Pengguna 2">
                      Pengguna 2
                    </option>

                    <option value="Pengguna 3">
                      Pengguna 3
                    </option>
                  </select>

                </div>


                <div className="form-group">
                  <label>
                    Instruksi Disposisi
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: Segera ditindaklanjuti"
                    value={disposisiForm.instruksi}
                    onChange={(e) =>
                      setDisposisiForm({
                        ...disposisiForm,
                        instruksi: e.target.value,
                      })
                    }
                  />

                </div>

              </div>


              <div className="modal-footer">

                <button
                  className="btn-tutup"
                  onClick={() => {
                    setShowDisposisi(false);
                    setSelectedSurat(null);
                  }}
                >
                  Batal
                </button>

                <button
                  className="btn-simpan"
                  onClick={kirimDisposisi}
                >
                  Kirim Disposisi
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