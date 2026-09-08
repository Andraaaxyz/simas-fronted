import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  X,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function SuratMasuk() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedSurat, setSelectedSurat] = useState(null);

  const [showTambah, setShowTambah] = useState(false);

  const [dataSurat, setDataSurat] = useState([]);

  const [formSurat, setFormSurat] = useState({
    noSurat: "",
    isi: "",
    asal: "",
    tanggal: "",
    sifat: "",
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
          sifat: "Segera",
          status: "Baru",
          disposisi: null,
          timeline: [
            {
              label: "Surat diterima",
              tanggal: "20 Agustus 2026",
            },
          ],
        },
        {
          id: 2,
          noSurat: "002/090/SK/2026",
          isi: "Pemberitahuan Kegiatan",
          asal: "Dinas Kesehatan",
          tanggal: "21 Agustus 2026",
          sifat: "Biasa",
          status: "Didisposisikan",
          disposisi: {
            tujuan: "Budi Santoso",
            instruksi: "Segera ditindaklanjuti",
            catatan: "Mohon diproses dengan baik.",
            tanggalDisposisi: "22 Agustus 2026",
          },
          timeline: [
            {
              label: "Surat diterima",
              tanggal: "21 Agustus 2026",
            },
            {
              label: "Disposisi dibuat",
              tanggal: "22 Agustus 2026",
            },
          ],
        },
        {
          id: 3,
          noSurat: "003/091/SK/2026",
          isi: "Surat Permohonan",
          asal: "Dinas Sosial",
          tanggal: "22 Agustus 2026",
          sifat: "Biasa",
          status: "Selesai",
          disposisi: {
            tujuan: "Siti Aminah",
            instruksi: "Dilaporkan ke pimpinan",
            catatan: "Sudah diproses.",
            tanggalDisposisi: "23 Agustus 2026",
          },
          timeline: [
            {
              label: "Surat diterima",
              tanggal: "22 Agustus 2026",
            },
            {
              label: "Disposisi dibuat",
              tanggal: "23 Agustus 2026",
            },
            {
              label: "Diproses pegawai",
              tanggal: "24 Agustus 2026",
            },
            {
              label: "Selesai diproses",
              tanggal: "25 Agustus 2026",
            },
          ],
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
  // SEARCH + FILTER
  // =========================

  const filteredData = dataSurat.filter((item) => {
    const cocokSearch =
      `${item.noSurat} ${item.isi} ${item.asal}`
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


  // =========================
  // TAMBAH SURAT
  // =========================

  const tambahSurat = () => {

    if (
      !formSurat.noSurat ||
      !formSurat.isi ||
      !formSurat.asal ||
      !formSurat.tanggal ||
      !formSurat.sifat
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
      sifat: formSurat.sifat,
      status: "Baru",
      disposisi: null,
      timeline: [
        {
          label: "Surat diterima",
          tanggal: formSurat.tanggal,
        },
      ],
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
      sifat: "",
    });

    setShowTambah(false);

    alert("Surat berhasil ditambahkan!");
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


        {/* SEARCH + TOOLS */}

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


        {/* TABLE */}

        <div className="table-card">

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>No. Surat</th>
                <th>Isi / Perihal</th>
                <th>Asal Surat</th>
                <th>Sifat</th>
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
                    {item.sifat || "-"}
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

                    </div>

                  </td>

                </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
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

                <div className="form-group">
                  <label>Sifat Surat</label>

                  <select
                    value={formSurat.sifat}
                    onChange={(e) =>
                      setFormSurat({
                        ...formSurat,
                        sifat: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Pilih Sifat Surat
                    </option>

                    {(
                      JSON.parse(
                        localStorage.getItem(
                          "masterSifatSurat"
                        )
                      ) || []
                    ).length > 0
                      ? JSON.parse(
                          localStorage.getItem(
                            "masterSifatSurat"
                          )
                        ).map((s) => (
                          <option
                            key={s.id}
                            value={s.nama}
                          >
                            {s.nama}
                          </option>
                        ))
                      : [
                          "Sangat Segera",
                          "Segera",
                          "Biasa",
                        ].map((s) => (
                          <option
                            key={s}
                            value={s}
                          >
                            {s}
                          </option>
                        ))}
                  </select>
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
                  <span>Sifat Surat</span>

                  <strong>
                    {selectedSurat.sifat || "-"}
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

              {selectedSurat.disposisi && (
                <div
                  className="detail-disposisi-info"
                >
                  <h3>Informasi Disposisi</h3>

                  <div className="detail-row">
                    <span>Tujuan</span>
                    <strong>
                      {selectedSurat.disposisi
                        .tujuan || "-"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Instruksi</span>
                    <strong>
                      {selectedSurat.disposisi
                        .instruksi || "-"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Catatan</span>
                    <strong>
                      {selectedSurat.disposisi
                        .catatan || "-"}
                    </strong>
                  </div>
                </div>
              )}

              {selectedSurat.timeline &&
                selectedSurat.timeline.length >
                  0 && (
                  <div className="detail-timeline">
                    <h3>Riwayat</h3>

                    {selectedSurat.timeline.map(
                      (tl, i) => (
                        <div
                          className="timeline-item"
                          key={i}
                        >
                          <div className="timeline-dot" />

                          <div>
                            <strong>
                              {tl.label}
                            </strong>
                            <span>
                              {tl.tanggal}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}


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

      </div>

    </DashboardLayout>
  );
}

export default SuratMasuk;
