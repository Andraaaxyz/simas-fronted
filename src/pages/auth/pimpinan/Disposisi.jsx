import { useState } from "react";
import { Eye, Plus, X, Search } from "lucide-react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Disposisi.css";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function Disposisi() {
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [dataDisposisi, setDataDisposisi] = useState([
    {
      id: 1,
      noSurat: "001/089/SK/2023",
      asal: "Dinas Pendidikan",
      perihal: "Edaran Libur/WFH",
      tanggal: "02 April 2026",
      tujuan: "Kepala Bagian",
      status: "Menunggu",
    },
    {
      id: 2,
      noSurat: "002/089/SK/2023",
      asal: "Dinas Pendidikan",
      perihal: "Undangan Rapat",
      tanggal: "16 Juni 2026",
      tujuan: "Staff Administrasi",
      status: "Diproses",
    },
  ]);

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredData = dataDisposisi.filter((item) => {
    const cocokSearch =
      `${item.noSurat || ""} ${item.perihal || ""} ${
        item.asal || ""
      } ${item.tujuan || ""}`
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

  const [form, setForm] = useState({
    tujuan: "",
    catatan: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Disposisi berhasil dibuat!");

    setShowForm(false);

    setForm({
      tujuan: "",
      catatan: "",
    });
  };

  return (
    <DashboardLayout title="Disposisi Surat">

      <div className="disposisi-page">

        {/* HEADER */}
        <div className="disposisi-header">
          <div>
            <h2>Disposisi Surat</h2>
            <p>
              Kelola disposisi surat masuk
            </p>
          </div>

          <button
            className="btn-disposisi"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Buat Disposisi
          </button>
        </div>


        {/* SEARCH + TOOLS */}
        <div
          className="disposisi-header-toolbar pag-tools"
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
                <th>Tanggal</th>
                <th>Tujuan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {pag.pageData.length > 0 ? (

                pag.pageData.map((data, index) => (

                <tr key={data.id}>

                  <td>
                    {(pag.page - 1) *
                      pag.entries +
                      index +
                      1}
                  </td>

                  <td>
                    <strong>
                      {data.noSurat}
                    </strong>
                  </td>

                  <td>{data.asal}</td>

                  <td>{data.perihal}</td>

                  <td>{data.tanggal}</td>

                  <td>{data.tujuan}</td>

                  <td>
                    <span className="status-disposisi">
                      {data.status}
                    </span>
                  </td>

                  <td>

                    <button
                      className="btn-lihat"
                      onClick={() =>
                        setSelectedSurat(data)
                      }
                      title="Lihat Detail"
                    >
                      <Eye size={16} />
                    </button>

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
            MODAL DETAIL
        ========================= */}

        {selectedSurat && (

          <div className="modal-overlay">

            <div className="disposisi-modal">

              <div className="modal-header">

                <div>
                  <h2>Detail Disposisi</h2>

                  <p>
                    Informasi disposisi surat
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
                  <span>Asal Surat</span>
                  <strong>
                    {selectedSurat.asal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Perihal</span>
                  <strong>
                    {selectedSurat.perihal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tanggal</span>
                  <strong>
                    {selectedSurat.tanggal}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Tujuan</span>
                  <strong>
                    {selectedSurat.tujuan}
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
            MODAL BUAT DISPOSISI
        ========================= */}

        {showForm && (

          <div className="modal-overlay">

            <div className="disposisi-modal">

              <div className="modal-header">

                <div>
                  <h2>Buat Disposisi</h2>

                  <p>
                    Buat disposisi surat
                  </p>
                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  <X size={18} />
                </button>

              </div>


              <form
                className="disposisi-form"
                onSubmit={handleSubmit}
              >

                <div className="form-group">

                  <label>
                    Tujuan Disposisi
                  </label>

                  <select
                    name="tujuan"
                    value={form.tujuan}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Pilih tujuan
                    </option>

                    <option value="Kepala Bagian">
                      Kepala Bagian
                    </option>

                    <option value="Staff Administrasi">
                      Staff Administrasi
                    </option>

                    <option value="Bagian Keuangan">
                      Bagian Keuangan
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Catatan
                  </label>

                  <textarea
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChange}
                    placeholder="Masukkan catatan disposisi..."
                    rows="4"
                  />

                </div>


                <div className="form-actions">

                  <button
                    type="button"
                    className="btn-batal"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn-simpan"
                  >
                    Simpan Disposisi
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Disposisi;