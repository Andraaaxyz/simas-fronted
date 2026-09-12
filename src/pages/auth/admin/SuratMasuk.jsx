import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Archive,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import ConfirmDialog from "../../../component/ConfirmDialog";
import { useToast } from "../../../component/Toast";
import {
  formatTanggal,
  hariIniISO,
} from "../../../utils/tanggal";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function SuratMasuk() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dataSurat, setDataSurat] = useState([]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [arsipTarget, setArsipTarget] = useState(null);

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
            tujuan: "Bidang Tata Usaha",
            perihal: "Undangan Rapat Koordinasi",
            file: "undangan-rapat.pdf",
            lampiran: "Agenda rapat",
            status: "Baru",
            disposisi: null,
            timeline: [
              {
                label: "Surat diterima",
                tanggal: "2026-08-20",
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
            tujuan: "Ir. Ahmad Fauzi, M.Si",
            perihal: "Pemberitahuan Kegiatan Senam",
            file: "edaran-kegiatan.pdf",
            lampiran: "-",
            status: "Didisposisikan",
            disposisi: {
              tujuan: "Budi Santoso, S.E",
              instruksi: "Segera ditindaklanjuti",
              catatan: "Mohon diproses dengan baik.",
              tanggalDisposisi: "2026-08-22",
            },
            timeline: [
              {
                label: "Surat diterima",
                tanggal: "2026-08-21",
              },
              {
                label: "Disposisi dibuat",
                tanggal: "2026-08-22",
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
            tujuan: "Bidang Umum",
            perihal: "Surat Permohonan Bantuan",
            file: "permohonan-bantuan.pdf",
            lampiran: "Proposal bantuan",
            status: "Selesai",
            disposisi: {
              tujuan: "Siti Aminah",
              instruksi: "Dilaporkan ke pimpinan",
              catatan: "Sudah diproses.",
              tanggalDisposisi: "2026-08-23",
            },
            timeline: [
              {
                label: "Surat diterima",
                tanggal: "2026-08-22",
              },
              {
                label: "Disposisi dibuat",
                tanggal: "2026-08-23",
              },
              {
                label: "Diproses pegawai",
                tanggal: "2026-08-24",
              },
              {
                label: "Selesai diproses",
                tanggal: "2026-08-25",
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
  // HAPUS SURAT
  // =========================
  const konfirmasiHapus = () => {
    const dataBaru = dataSurat.filter(
      (item) => item.id !== deleteTarget
    );

    setDataSurat(dataBaru);

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(dataBaru)
    );

    showToast("success", "Surat berhasil dihapus!");
  };

  // =========================
  // ARSIPKAN LANGSUNG
  // =========================
  const konfirmasiArsipkan = () => {
    const tanggalISO = hariIniISO();

    const dataBaru = dataSurat.map((item) =>
      item.id === arsipTarget
        ? {
            ...item,
            status: "Diarsipkan",
            timeline: [
              ...(item.timeline || []),
              {
                label: "Surat diarsipkan",
                tanggal: tanggalISO,
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

    showToast("success", "Surat berhasil diarsipkan!");
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
            onClick={() => navigate("/admin/surat-masuk/tambah")}
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
                <th>Tanggal Surat</th>
                <th>Sifat Surat</th>
                <th>Asal Surat</th>
                <th>Tujuan Surat</th>
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
                        item.tanggalSurat
                      )}
                    </td>

                    <td>
                      {item.sifat || "-"}
                    </td>

                    <td>
                      {item.asal}
                    </td>

                    <td>
                      {item.tujuan || "-"}
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
                            navigate(`/admin/surat-masuk/lihat/${item.id}`)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        {/* EDIT */}
                        <button
                          className="btn-edit"
                          title="Edit Surat"
                          onClick={() =>
                            navigate(`/admin/surat-masuk/edit/${item.id}`)
                          }
                        >
                          <Pencil size={17} />
                        </button>

                        {/* ARSIPKAN LANGSUNG */}
                        {!["Diarsipkan", "Selesai", "Disetujui", "Ditolak"].includes(
                          item.status
                        ) && (
                          <button
                            className="btn-arsipkan"
                            title="Arsipkan Langsung"
                            onClick={() =>
                              setArsipTarget(
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
                            setDeleteTarget(
                              item.id
                            )
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
                    colSpan="10"
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

        <ConfirmDialog
          open={!!deleteTarget}
          title="Hapus Surat"
          message="Yakin ingin menghapus surat ini? Data yang dihapus tidak dapat dikembalikan."
          confirmText="Hapus"
          cancelText="Batal"
          danger
          onConfirm={() => {
            konfirmasiHapus();
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />

        <ConfirmDialog
          open={!!arsipTarget}
          title="Arsipkan Surat"
          message="Arsipkan surat ini langsung ke arsip?"
          confirmText="Arsipkan"
          cancelText="Batal"
          onConfirm={() => {
            konfirmasiArsipkan();
            setArsipTarget(null);
          }}
          onCancel={() => setArsipTarget(null)}
        />

      </div>

    </DashboardLayout>
  );
}

export default SuratMasuk;