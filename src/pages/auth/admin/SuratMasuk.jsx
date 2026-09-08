import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  ClipboardList,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

function SuratMasuk() {
  const [search, setSearch] = useState("");
  const [dataSurat, setDataSurat] = useState([]);

  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDisposisi, setShowDisposisi] = useState(false);

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
    const ambilData = () => {
      const data =
        JSON.parse(localStorage.getItem("dataSurat")) || [];

      if (data.length === 0) {
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

        localStorage.setItem(
          "dataSurat",
          JSON.stringify(dataAwal)
        );

        setDataSurat(dataAwal);
      } else {
        setDataSurat(data);
      }
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
  // SEARCH
  // =========================
  const filteredData = dataSurat.filter((item) =>
    `${item.noSurat || ""} ${item.isi || ""} ${
      item.asal || ""
    }`
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

    const dataBaru = [...dataSurat, suratBaru];

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
  // BUKA EDIT
  // =========================
  const bukaEdit = (surat) => {
    setSelectedSurat(surat);

    setFormSurat({
      noSurat: surat.noSurat || "",
      isi: surat.isi || "",
      asal: surat.asal || "",
      tanggal: surat.tanggal || "",
    });

    setShowEdit(true);
  };

  // =========================
  // SIMPAN EDIT
  // =========================
  const simpanEdit = () => {
    if (
      !formSurat.noSurat ||
      !formSurat.isi ||
      !formSurat.asal ||
      !formSurat.tanggal
    ) {
      alert("Semua data surat wajib diisi!");
      return;
    }

    const dataBaru = dataSurat.map((item) =>
      item.id === selectedSurat.id
        ? {
            ...item,
            noSurat: formSurat.noSurat,
            isi: formSurat.isi,
            asal: formSurat.asal,
            tanggal: formSurat.tanggal,
          }
        : item
    );

    setDataSurat(dataBaru);

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(dataBaru)
    );

    setShowEdit(false);
    setSelectedSurat(null);

    setFormSurat({
      noSurat: "",
      isi: "",
      asal: "",
      tanggal: "",
    });

    alert("Surat berhasil diperbarui!");
  };

  // =========================
  // HAPUS SURAT
  // =========================
  const hapusSurat = (id) => {
    const yakin = window.confirm(
      "Yakin ingin menghapus surat ini?"
    );

    if (!yakin) return;

    const dataBaru = dataSurat.filter(
      (item) => item.id !== id
    );

    setDataSurat(dataBaru);

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(dataBaru)
    );

    alert("Surat berhasil dihapus!");
  };

  // =========================
  // DETAIL
  // =========================
  const bukaDetail = (surat) => {
    setSelectedSurat(surat);
    setShowDetail(true);
  };

  // =========================
  // DISPOSISI
  // =========================
  const bukaDisposisi = (surat) => {
    setSelectedSurat(surat);

    setDisposisiForm({
      pengguna: "",
      instruksi: "",
    });

    setShowDisposisi(true);
  };

  const kirimDisposisi = () => {
    if (
      !disposisiForm.pengguna ||
      !disposisiForm.instruksi
    ) {
      alert("Pengguna dan instruksi wajib diisi!");
      return;
    }

    const dataLama =
      JSON.parse(
        localStorage.getItem("dataDisposisi")
      ) || [];

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

    const dataBaru = [
      ...dataLama,
      disposisiBaru,
    ];

    localStorage.setItem(
      "dataDisposisi",
      JSON.stringify(dataBaru)
    );

    // Ubah status surat
    const suratUpdate = dataSurat.map(
      (item) =>
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
              Kelola data surat masuk pada
              sistem administrasi.
            </p>
          </div>

          <button
            className="btn-tambah-surat"
            onClick={() => {
              setFormSurat({
                noSurat: "",
                isi: "",
                asal: "",
                tanggal: "",
              });

              setShowTambah(true);
            }}
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
                <th>Perihal</th>
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
                      <span
                        className={`status ${
                          item.status === "Selesai"
                            ? "selesai"
                            : item.status === "Diproses"
                            ? "proses"
                            : "baru"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>

                      <div className="surat-actions">

                        {/* DETAIL */}
                        <button
                          className="btn-eye"
                          title="Lihat Detail"
                          onClick={() =>
                            bukaDetail(item)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        {/* EDIT */}
                        <button
                          className="btn-edit"
                          title="Edit Surat"
                          onClick={() =>
                            bukaEdit(item)
                          }
                        >
                          <Pencil size={17} />
                        </button>

                        {/* HAPUS */}
                        <button
                          className="btn-delete"
                          title="Hapus Surat"
                          onClick={() =>
                            hapusSurat(item.id)
                          }
                        >
                          <Trash2 size={17} />
                        </button>

                        {/* DISPOSISI */}
                        <button
                          className="btn-disposisi"
                          title="Kirim Disposisi"
                          onClick={() =>
                            bukaDisposisi(item)
                          }
                        >
                          <ClipboardList size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="empty"
                  >
                    Belum ada data surat.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =========================
            MODAL TAMBAH / EDIT
        ========================= */}
        {(showTambah || showEdit) && (

          <div className="modal-overlay">

            <div className="detail-modal">

              <div className="modal-header">

                <div>
                  <h2>
                    {showEdit
                      ? "Edit Surat"
                      : "Tambah Surat"}
                  </h2>

                  <p>
                    {showEdit
                      ? "Perbarui data surat"
                      : "Masukkan data surat baru"}
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() => {
                    setShowTambah(false);
                    setShowEdit(false);
                  }}
                >
                  <X size={18} />
                </button>

              </div>

              <div className="form-content">

                <div className="form-group">

                  <label>
                    No. Surat
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: 001/089/SK/2026"
                    value={formSurat.noSurat}
                    onChange={(e) =>
                      setFormSurat({
                        ...formSurat,
                        noSurat:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Perihal
                  </label>

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

                  <label>
                    Asal Surat
                  </label>

                  <input
                    type="text"
                    placeholder="Masukkan asal surat"
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

                  <label>
                    Tanggal
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: 26 Agustus 2026"
                    value={formSurat.tanggal}
                    onChange={(e) =>
                      setFormSurat({
                        ...formSurat,
                        tanggal:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn-tutup"
                  onClick={() => {
                    setShowTambah(false);
                    setShowEdit(false);
                  }}
                >
                  Batal
                </button>

                <button
                  className="btn-simpan"
                  onClick={
                    showEdit
                      ? simpanEdit
                      : tambahSurat
                  }
                >
                  {showEdit
                    ? "Simpan Perubahan"
                    : "Tambah Surat"}
                </button>

              </div>

            </div>

          </div>

        )}

        {/* =========================
            MODAL DETAIL
        ========================= */}
        {showDetail && selectedSurat && (

          <div className="modal-overlay">

            <div className="detail-modal">

              <div className="modal-header">

                <div>
                  <h2>
                    Detail Surat
                  </h2>

                  <p>
                    Informasi lengkap surat masuk
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() => {
                    setShowDetail(false);
                    setSelectedSurat(null);
                  }}
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
                  onClick={() => {
                    setShowDetail(false);
                    setSelectedSurat(null);
                  }}
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
                  <h2>
                    Kirim Disposisi
                  </h2>

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

              <div className="form-content">

                <div className="form-group">

                  <label>
                    No. Surat
                  </label>

                  <input
                    type="text"
                    value={selectedSurat.noSurat}
                    disabled
                  />

                </div>

                <div className="form-group">

                  <label>
                    Asal Surat
                  </label>

                  <input
                    type="text"
                    value={selectedSurat.asal}
                    disabled
                  />

                </div>

                <div className="form-group">

                  <label>
                    Pengguna
                  </label>

                  <select
                    value={
                      disposisiForm.pengguna
                    }
                    onChange={(e) =>
                      setDisposisiForm({
                        ...disposisiForm,
                        pengguna:
                          e.target.value,
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
                    value={
                      disposisiForm.instruksi
                    }
                    onChange={(e) =>
                      setDisposisiForm({
                        ...disposisiForm,
                        instruksi:
                          e.target.value,
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