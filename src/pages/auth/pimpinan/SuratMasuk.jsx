import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  CheckCircle,
  ClipboardList,
  Send,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./SuratMasuk.css";

import FileDokumen from "../../../component/FileDokumen";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

function SuratMasuk() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dataSurat, setDataSurat] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);

  const [keputusan, setKeputusan] = useState("");

  // =========================
  // DISPOSISI
  // =========================

  const [showDisposisi, setShowDisposisi] =
    useState(false);

  const [suratDisposisi, setSuratDisposisi] =
    useState(null);

  const [formDisposisi, setFormDisposisi] = useState({
    tujuan: "",
    instruksi: "",
    catatan: "",
  });

  // =========================
  // AMBIL DATA SURAT
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

  const ambilDataSurat = () => {
    const data =
      JSON.parse(localStorage.getItem("dataSurat")) || [];

    setDataSurat(migrasiData(data));
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
  // SEARCH + FILTER
  // =========================

  const filteredData = dataSurat.filter((item) => {
    const cocokSearch = `${item.noSurat || ""} ${
      item.perihal || ""
    } ${item.asal || ""} ${item.noAgenda || ""}`
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

  // =========================
  // OPSI TUJUAN (DARI MASTER USER)
  // =========================

  const opsiTujuan = () => {
    const data =
      JSON.parse(
        localStorage.getItem("masterUser")
      ) || [];

    if (data.length > 0) {
      return data.map((u) => u.nama);
    }

    return [
      "Pengguna 1",
      "Pengguna 2",
      "Pengguna 3",
    ];
  };

  // =========================
  // BUKA FORM DISPOSISI
  // =========================

  const bukaFormDisposisi = (surat) => {
    setSuratDisposisi(surat);

    setFormDisposisi({
      tujuan: "",
      instruksi: "",
      catatan: "",
    });

    setShowDisposisi(true);
  };

  // =========================
  // KIRIM DISPOSISI
  // =========================

  const kirimDisposisi = () => {

    if (
      !formDisposisi.tujuan ||
      !formDisposisi.instruksi
    ) {
      alert("Tujuan dan instruksi wajib diisi!");
      return;
    }

    const tanggalSekarang = new Date();

    const tanggalTeks =
      tanggalSekarang.toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

    const disposisiBaru = {
      id: Date.now(),
      noAgenda: suratDisposisi.noAgenda,
      noSurat: suratDisposisi.noSurat,
      asal: suratDisposisi.asal,
      perihal: suratDisposisi.perihal,
      tanggal: suratDisposisi.tanggalDiterima,
      pengguna: formDisposisi.tujuan,
      instruksi: formDisposisi.instruksi,
      catatan: formDisposisi.catatan,
      tanggalDisposisi: tanggalTeks,
      status: "Menunggu",
    };

    // =========================
    // SIMPAN KE DATA DISPOSISI
    // =========================

    const dataDisposisiLama =
      JSON.parse(
        localStorage.getItem("dataDisposisi")
      ) || [];

    const dataDisposisiBaru = [
      ...dataDisposisiLama,
      disposisiBaru,
    ];

    localStorage.setItem(
      "dataDisposisi",
      JSON.stringify(dataDisposisiBaru)
    );

    // =========================
    // UPDATE SURAT
    // =========================

    const suratUpdate = dataSurat.map((item) =>
      item.id === suratDisposisi.id
        ? {
            ...item,
            status: "Didisposisikan",
            keputusan: "",

            disposisi: {
              tujuan: formDisposisi.tujuan,
              instruksi: formDisposisi.instruksi,
              catatan: formDisposisi.catatan,
              tanggalDisposisi: tanggalTeks,
            },

            timeline: [
              ...(item.timeline || []),
              {
                label: "Disposisi dibuat",
                tanggal: tanggalTeks,
              },
            ],
          }
        : item
    );

    localStorage.setItem(
      "dataSurat",
      JSON.stringify(suratUpdate)
    );

    setDataSurat(suratUpdate);

    setShowDisposisi(false);

    setSuratDisposisi(null);

    setFormDisposisi({
      tujuan: "",
      instruksi: "",
      catatan: "",
    });

    alert("Disposisi berhasil dikirim!");
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

        {/* =========================
            TABLE
        ========================= */}

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
                      {(pag.page - 1) *
                        pag.entries +
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

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >

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

                        {!item.disposisi && (
                          <button
                            className="btn-disposisi-aksi"
                            title="Buat Disposisi"
                            onClick={() =>
                              bukaFormDisposisi(item)
                            }
                          >
                            <ClipboardList
                              size={17}
                            />
                          </button>
                        )}

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
                    No. Agenda
                  </span>

                  <strong>
                    {selectedSurat.noAgenda}
                  </strong>

                </div>

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
                    Tanggal Surat
                  </span>

                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggalSurat
                    )}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Tanggal Diterima
                  </span>

                  <strong>
                    {formatTanggal(
                      selectedSurat.tanggalDiterima
                    )}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Jenis Surat
                  </span>

                  <strong>
                    {selectedSurat.jenis || "-"}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Sifat Surat
                  </span>

                  <strong>
                    {selectedSurat.sifat || "-"}
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
                    Tujuan Surat
                  </span>

                  <strong>
                    {selectedSurat.tujuan || "-"}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Perihal
                  </span>

                  <strong>
                    {selectedSurat.perihal}
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    File Surat
                  </span>

                  <strong>
                    <FileDokumen
                      value={selectedSurat.file}
                    />
                  </strong>

                </div>

                <div className="detail-row">

                  <span>
                    Lampiran
                  </span>

                  <strong>
                    {selectedSurat.lampiran || "-"}
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

                {/* INFO DISPOSISI */}

                {selectedSurat.disposisi && (
                  <div className="detail-disposisi-info">

                    <h3>
                      Informasi Disposisi
                    </h3>

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

                {/* TIMELINE */}

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
                            <div
                              className="timeline-dot"
                            />

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

        {/* =========================
            MODAL BUAT DISPOSISI
        ========================= */}

        {showDisposisi && suratDisposisi && (

          <div
            className="modal-overlay"
            onClick={() =>
              setShowDisposisi(false)
            }
          >

            <div
              className="detail-modal disposisi-form-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="modal-header">

                <div>

                  <h2>
                    Buat Disposisi
                  </h2>

                  <p>
                    Distribusikan surat kepada
                    pegawai terkait
                  </p>

                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setShowDisposisi(false)
                  }
                >
                  <X size={18} />
                </button>

              </div>

              {/* BODY 2 KOLOM */}

              <div className="disposisi-form-grid">

                {/* KOLOM INFO SURAT */}

                <div className="disposisi-form-info">

                  <h3>
                    Informasi Surat
                  </h3>

                  <div className="detail-row">
                    <span>No. Agenda</span>

                    <strong>
                      {suratDisposisi.noAgenda}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>No. Surat</span>

                    <strong>
                      {suratDisposisi.noSurat}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Perihal</span>

                    <strong>
                      {suratDisposisi.perihal}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Asal Surat</span>

                    <strong>
                      {suratDisposisi.asal}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Jenis Surat</span>

                    <strong>
                      {suratDisposisi.jenis ||
                        "-"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Sifat Surat</span>

                    <strong>
                      {suratDisposisi.sifat ||
                        "-"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Tanggal Diterima</span>

                    <strong>
                      {formatTanggal(
                        suratDisposisi.tanggalDiterima
                      )}
                    </strong>
                  </div>

                </div>

                {/* KOLOM FORM */}

                <div className="disposisi-form-inputs">

                  <div className="form-group">
                    <label>
                      Tujuan Kepada
                    </label>

                    <select
                      value={formDisposisi.tujuan}
                      onChange={(e) =>
                        setFormDisposisi({
                          ...formDisposisi,
                          tujuan: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Pilih penerima
                      </option>

                      {opsiTujuan().map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      Instruksi
                    </label>

                    <textarea
                      rows="4"
                      placeholder="Contoh: Segera ditindaklanjuti"
                      value={formDisposisi.instruksi}
                      onChange={(e) =>
                        setFormDisposisi({
                          ...formDisposisi,
                          instruksi:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Catatan
                    </label>

                    <textarea
                      rows="3"
                      placeholder="Contoh: Mohon diproses dengan baik"
                      value={formDisposisi.catatan}
                      onChange={(e) =>
                        setFormDisposisi({
                          ...formDisposisi,
                          catatan:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="modal-footer">

                <button
                  className="btn-tutup"
                  onClick={() =>
                    setShowDisposisi(false)
                  }
                >
                  Batal
                </button>

                <button
                  className="btn-simpan"
                  onClick={kirimDisposisi}
                >
                  <Send size={17} />

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
