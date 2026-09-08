import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Archive,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import FileDokumen from "../../../component/FileDokumen";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

// =========================
// BACA FILE JADI BASE64
// =========================

const bacaFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () =>
      resolve({
        nama: file.name,
        tipe: file.type,
        data: reader.result,
      });

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// =========================
// HELPER OPSI MASTER
// =========================

function opsiJenisSurat() {
  const data =
    JSON.parse(
      localStorage.getItem("masterJenisSurat")
    ) || [];

  return data;
}

function opsiSifatSurat() {
  const data =
    JSON.parse(
      localStorage.getItem("masterSifatSurat")
    ) || [];

  return data;
}

function opsiTujuan() {
  const data =
    JSON.parse(localStorage.getItem("masterUser")) ||
    [];

  if (data.length > 0) {
    return data.map((u) => u.nama);
  }

  return ["Pengguna 1", "Pengguna 2", "Pengguna 3"];
}

function SuratMasuk() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dataSurat, setDataSurat] = useState([]);

  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [formSurat, setFormSurat] = useState({
    noSurat: "",
    tanggalSurat: "",
    tanggalDiterima: "",
    jenis: "",
    sifat: "",
    asal: "",
    tujuan: "",
    perihal: "",
    file: "",
    lampiran: "",
  });

  const formKosong = () => ({
    noSurat: "",
    tanggalSurat: "",
    tanggalDiterima: "",
    jenis: "",
    sifat: "",
    asal: "",
    tujuan: "",
    perihal: "",
    file: "",
    lampiran: "",
  });

  // =========================
  // MIGRASI DATA LAMA
  // =========================

  const migrasiData = (data) =>
    data.map((item) => {
      if (item.perihal !== undefined) return item;

      return {
        ...item,
        noAgenda: item.noAgenda || "",
        tanggalSurat: item.tanggalSurat || "",
        tanggalDiterima: item.tanggalDiterima || item.tanggal || "",
        jenis: item.jenis || "",
        sifat: item.sifat || "",
        tujuan: item.tujuan || "",
        perihal: item.perihal || item.isi || "",
        file: item.file || "",
        lampiran: item.lampiran || "",
      };
    });

  // =========================
  // GENERATE NO AGENDA
  // =========================

  const generateNoAgenda = (data) => {
    const max = data.reduce((acc, item) => {
      const n = parseInt(item.noAgenda, 10) || 0;
      return n > acc ? n : acc;
    }, 0);

    return String(max + 1).padStart(3, "0");
  };

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
            noAgenda: "001",
            noSurat: "001/089/SK/2026",
            tanggalSurat: "2026-08-19",
            tanggalDiterima: "2026-08-20",
            jenis: "Surat Undangan",
            sifat: "Penting",
            asal: "Dinas Pendidikan",
            tujuan: "Rina Wulandari, S.Kom",
            perihal: "Undangan Rapat Koordinasi",
            file: "undangan-rapat.pdf",
            lampiran: "Agenda rapat",
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
            noAgenda: "002",
            noSurat: "002/090/SK/2026",
            tanggalSurat: "2026-08-20",
            tanggalDiterima: "2026-08-21",
            jenis: "Surat Edaran",
            sifat: "Biasa",
            asal: "Dinas Kesehatan",
            tujuan: "Budi Santoso, S.E",
            perihal: "Pemberitahuan Kegiatan Senam",
            file: "edaran-kegiatan.pdf",
            lampiran: "-",
            status: "Didisposisikan",
            disposisi: {
              tujuan: "Budi Santoso, S.E",
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
            noAgenda: "003",
            noSurat: "003/091/SK/2026",
            tanggalSurat: "2026-08-21",
            tanggalDiterima: "2026-08-22",
            jenis: "Surat Permohonan",
            sifat: "Biasa",
            asal: "Dinas Sosial",
            tujuan: "Siti Aminah",
            perihal: "Surat Permohonan Bantuan",
            file: "permohonan-bantuan.pdf",
            lampiran: "Proposal bantuan",
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

        localStorage.setItem(
          "dataSurat",
          JSON.stringify(dataAwal)
        );

        setDataSurat(dataAwal);
      } else {
        setDataSurat(migrasiData(data));
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
  // SEARCH + FILTER
  // =========================
  const filteredData = dataSurat.filter((item) => {
    const cocokSearch = `${item.noSurat || ""} ${
      item.perihal || ""
    } ${item.asal || ""} ${item.noAgenda || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const cocokStatus =
      !filterStatus || item.status === filterStatus;

    return cocokSearch && cocokStatus;
  });

  // =========================
  // PAGINATION
  // =========================
  const pag = usePagination(filteredData);

  // =========================
  // TAMBAH SURAT
  // =========================
  const tambahSurat = async () => {
    if (
      !formSurat.noSurat ||
      !formSurat.tanggalSurat ||
      !formSurat.tanggalDiterima ||
      !formSurat.jenis ||
      !formSurat.sifat ||
      !formSurat.asal ||
      !formSurat.tujuan ||
      !formSurat.perihal ||
      !formSurat.file ||
      !formSurat.lampiran
    ) {
      alert("Semua data surat wajib diisi!");
      return;
    }

    const fileSimpan = await bacaFile(formSurat.file);

    const suratBaru = {
      id: Date.now(),
      noAgenda: generateNoAgenda(dataSurat),
      noSurat: formSurat.noSurat,
      tanggalSurat: formSurat.tanggalSurat,
      tanggalDiterima: formSurat.tanggalDiterima,
      jenis: formSurat.jenis,
      sifat: formSurat.sifat,
      asal: formSurat.asal,
      tujuan: formSurat.tujuan,
      perihal: formSurat.perihal,
      file: fileSimpan,
      lampiran: formSurat.lampiran,
      status: "Baru",
      disposisi: null,
      timeline: [
        {
          label: "Surat diterima",
          tanggal: formSurat.tanggalDiterima,
        },
      ],
    };

    const dataBaru = [...dataSurat, suratBaru];

    try {
      setDataSurat(dataBaru);

      localStorage.setItem(
        "dataSurat",
        JSON.stringify(dataBaru)
      );
    } catch {
      alert("Gagal menyimpan: file terlalu besar untuk penyimpanan lokal.");
      return;
    }

    setFormSurat(formKosong());

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
      tanggalSurat: surat.tanggalSurat || "",
      tanggalDiterima: surat.tanggalDiterima || "",
      jenis: surat.jenis || "",
      sifat: surat.sifat || "",
      asal: surat.asal || "",
      tujuan: surat.tujuan || "",
      perihal: surat.perihal || "",
      file: "",
      lampiran: surat.lampiran || "",
    });

    setShowEdit(true);
  };

  // =========================
  // SIMPAN EDIT
  // =========================
  const simpanEdit = async () => {
    if (
      !formSurat.noSurat ||
      !formSurat.tanggalSurat ||
      !formSurat.tanggalDiterima ||
      !formSurat.jenis ||
      !formSurat.sifat ||
      !formSurat.asal ||
      !formSurat.tujuan ||
      !formSurat.perihal ||
      (!formSurat.file && !selectedSurat.file) ||
      !formSurat.lampiran
    ) {
      alert("Semua data surat wajib diisi!");
      return;
    }

    const fileSimpan = formSurat.file
      ? await bacaFile(formSurat.file)
      : selectedSurat.file;

    const dataBaru = dataSurat.map((item) =>
      item.id === selectedSurat.id
        ? {
            ...item,
            noSurat: formSurat.noSurat,
            tanggalSurat: formSurat.tanggalSurat,
            tanggalDiterima: formSurat.tanggalDiterima,
            jenis: formSurat.jenis,
            sifat: formSurat.sifat,
            asal: formSurat.asal,
            tujuan: formSurat.tujuan,
            perihal: formSurat.perihal,
            file: fileSimpan,
            lampiran: formSurat.lampiran,
          }
        : item
    );

    try {
      setDataSurat(dataBaru);

      localStorage.setItem(
        "dataSurat",
        JSON.stringify(dataBaru)
      );
    } catch {
      alert("Gagal menyimpan: file terlalu besar untuk penyimpanan lokal.");
      return;
    }

    setShowEdit(false);
    setSelectedSurat(null);

    setFormSurat(formKosong());

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
  // ARSIPKAN LANGSUNG
  // =========================
  const arsipkanSurat = (id) => {
    const yakin = window.confirm(
      "Arsipkan surat ini langsung ke arsip?"
    );

    if (!yakin) return;

    const tanggalSekarang = new Date();
    const tanggalTeks = tanggalSekarang.toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    const dataBaru = dataSurat.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "Diarsipkan",
            timeline: [
              ...(item.timeline || []),
              {
                label: "Surat diarsipkan",
                tanggal: tanggalTeks,
              },
            ],
          }
        : item
    );

    setDataSurat(dataBaru);

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(dataBaru)
    );

    alert("Surat berhasil diarsipkan!");
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
              setFormSurat(formKosong());
              setShowTambah(true);
            }}
          >
            <Plus size={18} />
            Tambah Surat
          </button>

        </div>

        {/* SEARCH + TOOLS */}
        <div className="surat-toolbar pag-tools">

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
                <th>No. Agenda</th>
                <th>No. Surat</th>
                <th>Tanggal Diterima</th>
                <th>Sifat</th>
                <th>Asal Surat</th>
                <th>Perihal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {pag.pageData.length > 0 ? (

                pag.pageData.map((item, index) => (

                  <tr key={item.id}>

                    <td>
                      {(pag.page - 1) * pag.entries +
                        index +
                        1}
                    </td>

                    <td>
                      <strong>
                        {item.noAgenda}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {item.noSurat}
                      </strong>
                    </td>

                    <td>
                      {formatTanggal(
                        item.tanggalDiterima
                      )}
                    </td>

                    <td>
                      {item.sifat || "-"}
                    </td>

                    <td>
                      {item.asal}
                    </td>

                    <td>
                      {item.perihal}
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

                        {/* ARSIPKAN LANGSUNG */}
                        {item.status === "Baru" && (
                          <button
                            className="btn-arsipkan"
                            title="Arsipkan Langsung"
                            onClick={() =>
                              arsipkanSurat(
                                item.id
                              )
                            }
                          >
                            <Archive size={17} />
                          </button>
                        )}

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

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="empty"
                  >
                    Belum ada data surat.
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

              <div className="form-content form-2kolom">

                <div className="form-grid">

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
                      Jenis Surat
                    </label>

                    <select
                      value={formSurat.jenis}
                      onChange={(e) =>
                        setFormSurat({
                          ...formSurat,
                          jenis: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Pilih Jenis Surat
                      </option>

                      {opsiJenisSurat().length > 0
                        ? opsiJenisSurat().map((j) => (
                            <option
                              key={j.id}
                              value={j.nama}
                            >
                              {j.nama}
                            </option>
                          ))
                        : [
                            "Surat Edaran",
                            "Surat Undangan",
                            "Surat Keputusan",
                            "Surat Permohonan",
                          ].map((j) => (
                            <option key={j} value={j}>
                              {j}
                            </option>
                          ))}
                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Tanggal Surat
                    </label>

                    <input
                      type="date"
                      value={formSurat.tanggalSurat}
                      onChange={(e) =>
                        setFormSurat({
                          ...formSurat,
                          tanggalSurat:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Tanggal Diterima
                    </label>

                    <input
                      type="date"
                      value={formSurat.tanggalDiterima}
                      onChange={(e) =>
                        setFormSurat({
                          ...formSurat,
                          tanggalDiterima:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Sifat Surat
                    </label>

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

                      {opsiSifatSurat().length > 0
                        ? opsiSifatSurat().map((s) => (
                            <option
                              key={s.id}
                              value={s.nama}
                            >
                              {s.nama}
                            </option>
                          ))
                        : [
                            "Biasa",
                            "Penting",
                            "Segera",
                            "Rahasia",
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Asal Surat
                    </label>

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

                    <label>
                      Tujuan Surat
                    </label>

                    <select
                      value={formSurat.tujuan}
                      onChange={(e) =>
                        setFormSurat({
                          ...formSurat,
                          tujuan: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Pilih Tujuan
                      </option>

                      {opsiTujuan().map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="form-group form-span-2">

                    <label>
                      Perihal
                    </label>

                    <input
                      type="text"
                      placeholder="Masukkan perihal surat"
                      value={formSurat.perihal}
                      onChange={(e) =>
                        setFormSurat({
                          ...formSurat,
                          perihal: e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      File Surat
                    </label>

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const f =
                          e.target.files &&
                          e.target.files[0];

                        if (
                          f &&
                          f.size > 2 * 1024 * 1024
                        ) {
                          alert(
                            "Ukuran file maksimal 2MB."
                          );

                          e.target.value = "";
                          return;
                        }

                        setFormSurat({
                          ...formSurat,
                          file: f || "",
                        });
                      }}
                    />

                    {formSurat.file ? (
                      <span className="file-terpilih">
                        File dipilih:{" "}
                        {formSurat.file.name}
                      </span>
                    ) : (
                      showEdit &&
                      selectedSurat.file && (
                        <span className="file-terpilih">
                          File saat ini:{" "}
                          {typeof selectedSurat.file ===
                          "string"
                            ? selectedSurat.file
                            : selectedSurat.file.nama}
                        </span>
                      )
                    )}

                  </div>

                  <div className="form-group">

                    <label>
                      Lampiran
                    </label>

                    <input
                      type="text"
                      placeholder="Lampiran surat"
                      value={formSurat.lampiran}
                      onChange={(e) =>
                        setFormSurat({
                          ...formSurat,
                          lampiran:
                            e.target.value,
                        })
                      }
                    />

                  </div>

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
                  <span>No. Agenda</span>
                  <strong>
                    {selectedSurat.noAgenda}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>No. Surat</span>
                  <strong>
                    {selectedSurat.noSurat}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tanggal Surat</span>
                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggalSurat
                    )}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tanggal Diterima</span>
                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggalDiterima
                    )}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Jenis Surat</span>
                  <strong>
                    {selectedSurat.jenis || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Sifat Surat</span>
                  <strong>
                    {selectedSurat.sifat || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Asal Surat</span>
                  <strong>
                    {selectedSurat.asal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tujuan Surat</span>
                  <strong>
                    {selectedSurat.tujuan || "-"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Perihal</span>
                  <strong>
                    {selectedSurat.perihal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>File Surat</span>
                  <strong>
                    <FileDokumen
                      value={selectedSurat.file}
                    />
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Lampiran</span>
                  <strong>
                    {selectedSurat.lampiran || "-"}
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
                <div className="detail-disposisi-info">
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
                selectedSurat.timeline.length > 0 && (
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
                            <strong>{tl.label}</strong>
                            <span>{tl.tanggal}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

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

      </div>

    </DashboardLayout>
  );
}

// =========================
// FORMAT TGL ke id-ID
// =========================

function formatTanggal(tgl) {
  if (!tgl) return "-";

  const m = String(tgl).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (m) {
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${parseInt(m[3], 10)} ${
      bulan[parseInt(m[2], 10) - 1]
    } ${m[1]}`;
  }

  return tgl;
}

export default SuratMasuk;
