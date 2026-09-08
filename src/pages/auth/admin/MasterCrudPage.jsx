import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import {
  getMasterData,
  tambahMasterData,
  updateMasterData,
  hapusMasterData,
} from "../../../services/masterData";

function MasterCrudPage({
  title,
  subtitle,
  storageKey,
  columns,
  fields,
  emptyMessage,
  hasStatus = true,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState(() => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = ""));
    return initial;
  });

  // =========================
  // AMBIL DATA
  // =========================
  const ambilData = () => {
    setData(getMasterData(storageKey));
  };

  useEffect(() => {
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
  const filteredData = data.filter((item) =>
    columns
      .map((c) => item[c.key] || "")
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // TAMBAH
  // =========================
  const bukaTambah = () => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = ""));
    setForm(initial);
    setEditId(null);
    setShowModal(true);
  };

  // =========================
  // EDIT
  // =========================
  const bukaEdit = (item) => {
    const init = {};
    fields.forEach((f) => {
      init[f.name] = item[f.name] || "";
    });
    setForm(init);
    setEditId(item.id);
    setShowModal(true);
  };

  // =========================
  // SIMPAN
  // =========================
  const simpan = () => {
    const kosong = fields.some((f) => !form[f.name]);

    if (kosong) {
      alert("Semua data wajib diisi!");
      return;
    }

    if (editId) {
      updateMasterData(storageKey, editId, form);
      alert("Data berhasil diperbarui!");
    } else {
      tambahMasterData(storageKey, form);
      alert("Data berhasil ditambahkan!");
    }

    setShowModal(false);
  };

  // =========================
  // HAPUS
  // =========================
  const hapus = (id) => {
    const yakin = window.confirm(
      "Yakin ingin menghapus data ini?"
    );

    if (!yakin) return;

    hapusMasterData(storageKey, id);
    alert("Data berhasil dihapus!");
  };

  return (
    <DashboardLayout title={title}>
      <div className="master-page">

        {/* HEADER */}
        <div className="master-header">
          <div>
            <div className="master-breadcrumb">
              Master / {title}
            </div>

            <h1>{title}</h1>

            <p>{subtitle}</p>
          </div>

          <button
            className="master-btn-add"
            onClick={bukaTambah}
          >
            <Plus size={18} />
            Tambah {title}
          </button>
        </div>

        {/* SEARCH */}
        <div className="master-toolbar">
          <div className="master-search">
            <Search size={18} />

            <input
              type="text"
              placeholder={`Cari ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="master-card">
          <table className="master-table">
            <thead>
              <tr>
                <th>No</th>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {hasStatus && <th>Status</th>}
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    {columns.map((col) => (
                      <td key={col.key}>
                        <strong>
                          {col.mask
                            ? "••••••••"
                            : item[col.key]}
                        </strong>
                      </td>
                    ))}

                    {hasStatus && (
                      <td>
                        {item.status ? (
                          <span
                            className={`master-status ${
                              item.status === "Aktif"
                                ? "aktif"
                                : "nonaktif"
                            }`}
                          >
                            {item.status}
                          </span>
                        ) : (
                          <span className="master-status-baru">
                            -
                          </span>
                        )}
                      </td>
                    )}

                    <td>
                      <div className="master-actions">
                        <button
                          className="master-edit"
                          title="Edit"
                          onClick={() =>
                            bukaEdit(item)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="master-delete"
                          title="Hapus"
                          onClick={() =>
                            hapus(item.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length + (hasStatus ? 3 : 2)
                    }
                    className="master-empty"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="master-modal-overlay">
            <div className="master-modal">
              <div className="master-modal-header">
                <div>
                  <h2>
                    {editId ? "Edit" : "Tambah"}{" "}
                    {title}
                  </h2>

                  <p>
                    {editId
                      ? "Perbarui data"
                      : "Masukkan data baru"}
                  </p>
                </div>

                <button
                  className="master-close"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  <X size={18} />
                </button>
              </div>

              <div className="master-form">
                {fields.map((f) => (
                  <div
                    className="master-field"
                    key={f.name}
                  >
                    <label>{f.label}</label>

                    {f.type === "select" ? (
                      <select
                        value={form[f.name]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [f.name]:
                              e.target.value,
                          })
                        }
                      >
                        <option value="">
                          Pilih {f.label}
                        </option>
                        {f.options.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={
                          f.type === "password"
                            ? "password"
                            : "text"
                        }
                        placeholder={
                          f.placeholder ||
                          `Masukkan ${f.label.toLowerCase()}`
                        }
                        value={form[f.name]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [f.name]:
                              e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="master-modal-footer">
                <button
                  className="master-btn-batal"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Batal
                </button>

                <button
                  className="master-btn-simpan"
                  onClick={simpan}
                >
                  {editId
                    ? "Simpan Perubahan"
                    : "Simpan Data"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default MasterCrudPage;
