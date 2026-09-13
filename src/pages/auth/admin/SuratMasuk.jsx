import { useRef, useState } from "react";
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
import { formatTanggal } from "../../../utils/tanggal";

import {
  useServerPagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

import { api } from "../../../services/apiClient";

const STATUS_SURAT = ["baru", "didisposisi", "diarsipkan"];

const labelStatus = (status) =>
  status === "baru"
    ? "Baru"
    : status === "didisposisi"
    ? "Didisposisikan"
    : status === "diarsipkan"
    ? "Diarsipkan"
    : status || "-";

function SuratMasuk() {
  const navigate = useNavigate();
  const showToast = useToast();
  const fileRef = useRef(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [arsipTarget, setArsipTarget] = useState(null);
  const [arsipLoading, setArsipLoading] = useState(false);

  // =========================
  // AMPIL DATA SURAT (API)
  // =========================
  const fetcher = (page, perPage) =>
    api
      .get("/surat-masuk", {
        params: {
          page,
          per_page: perPage,
          search: search || undefined,
          status: filterStatus || undefined,
        },
      })
      .then((res) => res.data.data);

  const pag = useServerPagination(fetcher, [search, filterStatus]);

  // =========================
  // HAPUS SURAT
  // =========================
  const konfirmasiHapus = async () => {
    try {
      await api.delete(`/surat-masuk/${deleteTarget}`);
      showToast("success", "Surat berhasil dihapus!");
      pag.reload();
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Gagal menghapus surat!"
      );
    }
  };

  // =========================
  // ARSIPKAN LANGSUNG (UPLOAD)
  // =========================
  const pilihFileArsip = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    setArsipLoading(true);

    const body = new FormData();
    body.append("surat_masuk_id", arsipTarget);
    body.append("file", file);

    api
      .post("/arsip-digital", body)
      .then(() => {
        showToast("success", "Surat berhasil diarsipkan!");
        setArsipTarget(null);
        pag.reload();
      })
      .catch((err) => {
        showToast(
          "error",
          err.response?.data?.message ||
            "Gagal mengarsipkan surat!"
        );
      })
      .finally(() => setArsipLoading(false));
  };

  const formatData = (item) => ({
    id: item.id,
    noAgenda: item.no_agenda,
    noSurat: item.no_surat,
    tanggalSurat: item.tanggal_surat,
    sifat: item.sifat_surat?.nama_sifat,
    asal: item.asal_surat,
    tujuan: item.tujuan_surat,
    perihal: item.perihal,
    status: item.status,
  });

  const listSurat = pag.pageData.map(formatData);

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

            {STATUS_SURAT.map((st) => (
              <option key={st} value={st}>
                {labelStatus(st)}
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

              {listSurat.length > 0 ? (

                listSurat.map((item, index) => (

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
                        {labelStatus(item.status)}
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
                        {item.status !== "diarsipkan" && (
                          <button
                            className="btn-arsipkan"
                            title="Arsipkan Surat"
                            disabled={arsipLoading}
                            onClick={() =>
                              setArsipTarget(item.id)
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
                            setDeleteTarget(item.id)
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

        {/* INPUT FILE TERSEMBUNYI UNTUK ARSIP */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={pilihFileArsip}
        />

        <ConfirmDialog
          open={!!deleteTarget && !arsipLoading}
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
          open={!!arsipTarget && !arsipLoading}
          title="Arsipkan Surat"
          message="Pilih file dokumen surat untuk diarsipkan."
          confirmText="Pilih File"
          cancelText="Batal"
          onConfirm={() => {
            fileRef.current?.click();
          }}
          onCancel={() => setArsipTarget(null)}
        />

      </div>

    </DashboardLayout>
  );
}

export default SuratMasuk;