import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import ConfirmDialog from "../../../component/ConfirmDialog";
import { useToast } from "../../../component/Toast";
import EmptyState from "../../../component/EmptyState";
import {
  exportExcel,
  buatHTMLPrint,
} from "../../../utils/report";

import {
  usePagination,
  EntriesSelect,
  PaginationBar,
} from "../../../component/Pagination";

import { api } from "../../../services/apiClient";

const ambilOptions = async (field) => {
  if (!field.fromEndpoint) return field.options || [];

  try {
    const { data } = await api.get(field.fromEndpoint);
    const list = Array.isArray(data.data)
      ? data.data
      : data.data?.data || [];

    return list.map((item) => ({
      value: item[field.valueField || "id"],
      label: item[field.labelField || "nama"],
    }));
  } catch {
    return [];
  }
};

function MasterCrudPage({
  title,
  subtitle,
  endpoint,
  params = {},
  columns,
  fields,
  emptyMessage,
  rowMapper,
  editMapper,
  payloadMapper,
  hasStatus = true,
  filters = [],
}) {
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filterValues, setFilterValues] = useState(() => {
    const initial = {};
    filters.forEach((f) => (initial[f.key] = ""));
    return initial;
  });

  const [form, setForm] = useState(() => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = ""));
    return initial;
  });

  const [dynamicOptions, setDynamicOptions] = useState({});

  useEffect(() => {
    fields.forEach((f) => {
      if (!f.fromEndpoint) return;
      ambilOptions(f).then((opts) =>
        setDynamicOptions((prev) => ({ ...prev, [f.name]: opts }))
      );
    });
  }, []);

  const ambilData = () => {
    api
      .get(endpoint, { params })
      .then((res) => {
        const raw = res.data?.data;
        const list = Array.isArray(raw) ? raw : raw?.data || [];
        setData(list.map(rowMapper));
      })
      .catch(() => setData([]));
  };

  useEffect(() => {
    setLoading(true);
    ambilData();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const keyword = search.toLowerCase();

  const filteredData = data.filter((item) => {
    const cocokSearch = columns
      .map((c) => item[c.key] || "")
      .join(" ")
      .toLowerCase()
      .includes(keyword);

    const cocokFilter = filters.every(
      (f) => !filterValues[f.key] || item[f.key] === filterValues[f.key]
    );

    return cocokSearch && cocokFilter;
  });

  const pag = usePagination(filteredData);

  const bukaTambah = () => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = ""));
    setForm(initial);
    setEditId(null);
    setShowModal(true);
  };

  const bukaEdit = (item) => {
    setForm(editMapper(item));
    setEditId(item.id);
    setShowModal(true);
  };

  const simpan = async () => {
    const kosong = fields.some((f) => !form[f.name] && f.required !== false);

    if (kosong) {
      showToast("warning", "Semua data wajib diisi!");
      return;
    }

    setSaving(true);

    try {
      if (editId) {
        await api.put(`${endpoint}/${editId}`, payloadMapper(form, true));
        showToast("success", "Data berhasil diperbarui!");
      } else {
        await api.post(endpoint, payloadMapper(form, false));
        showToast("success", "Data berhasil ditambahkan!");
      }

      setShowModal(false);
      ambilData();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        "Gagal menyimpan data!";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const konfirmasiHapus = async () => {
    try {
      await api.delete(`${endpoint}/${deleteTarget}`);
      setDeleteTarget(null);
      showToast("success", "Data berhasil dihapus!");
      ambilData();
    } catch (err) {
      setDeleteTarget(null);
      showToast(
        "error",
        err.response?.data?.message || "Gagal menghapus data!"
      );
    }
  };

  // =========================
  // EXPORT EXCEL
  // =========================
  const exportMaster = () => {
    const kolomExport = columns
      .filter((c) => !c.mask)
      .map((c) => ({ key: c.key, label: c.label }));

    if (hasStatus) {
      kolomExport.push({ key: "status", label: "Status" });
    }

    exportExcel({
      rows: filteredData,
      columns: kolomExport,
      filename: `master-${title.toLowerCase()}`,
    });
  };

  // =========================
  // PRINT MASTER
  // =========================
  const printMaster = () => {
    const kolomPrint = columns
      .filter((c) => !c.mask)
      .map((c) => ({ key: c.key, label: c.label }));

    if (hasStatus) {
      kolomPrint.push({ key: "status", label: "Status" });
    }

    buatHTMLPrint({
      title: `Data Master ${title}`,
      subtitle: `Daftar data ${title.toLowerCase()} pada sistem SIMAS`,
      columns: kolomPrint,
      rows: filteredData,
      footer: `Total data: ${filteredData.length}`,
    });
  };

  const renderOptions = (f) => {
    const opts = f.fromEndpoint
      ? dynamicOptions[f.name] || []
      : f.options || [];

    if (opts.length === 0 || typeof opts[0] !== "object") {
      return opts.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ));
    }

    return opts.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ));
  };

  return (
    <DashboardLayout title={title}>
      <div className="master-page">

        <div className="master-header">
          <div>
            <div className="master-breadcrumb">Master / {title}</div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="master-header-actions">

            <button
              className="master-btn-excel"
              onClick={exportMaster}
              title="Export Excel"
            >
              <FileSpreadsheet size={19} />
              Excel
            </button>

            <button
              className="master-btn-print"
              onClick={printMaster}
              title="Print"
            >
              <Printer size={19} />
              Print
            </button>

            <button
              className="master-btn-add"
              onClick={bukaTambah}
              disabled={loading}
            >
              <Plus size={18} />
              Tambah {title}
            </button>

          </div>
        </div>

        <div className="master-toolbar pag-tools">
          <div className="master-search">
            <Search size={18} />
            <input
              type="text"
              placeholder={`Cari ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filters.map((f) => {
            const opsiDinamis = f.options
              ? f.options
              : [...new Set(data.map((d) => d[f.key]).filter(Boolean))];

            return (
              <select
                key={f.key}
                className="pag-filter"
                value={filterValues[f.key]}
                onChange={(e) =>
                  setFilterValues({ ...filterValues, [f.key]: e.target.value })
                }
              >
                <option value="">Semua {f.label}</option>
                {opsiDinamis.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );
          })}

          <EntriesSelect value={pag.entries} onChange={pag.changeEntries} />
        </div>

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
              {pag.pageData.length > 0 ? (
                pag.pageData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(pag.page - 1) * pag.entries + index + 1}</td>

                    {columns.map((col) => (
                      <td key={col.key}>
                        <strong>{col.mask ? "••••••••" : item[col.key]}</strong>
                      </td>
                    ))}

                    {hasStatus && (
                      <td>
                        {item.status ? (
                          <span className={`master-status ${item.status === "aktif" ? "aktif" : "nonaktif"}`}>
                            {item.status === "aktif" ? "Aktif" : item.status === "nonaktif" ? "Nonaktif" : item.status}
                          </span>
                        ) : (
                          <span className="master-status-baru">-</span>
                        )}
                      </td>
                    )}

                    <td>
                      <div className="master-actions">
                        <button className="master-edit" title="Edit" onClick={() => bukaEdit(item)}>
                          <Pencil size={16} />
                        </button>
                        <button className="master-delete" title="Hapus" onClick={() => setDeleteTarget(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (hasStatus ? 3 : 2)}>
                    <EmptyState
                      title={emptyMessage}
                      description="Data belum tersedia di sistem."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationBar
          page={pag.page}
          totalPages={pag.totalPages}
          onPageChange={pag.goToPage}
          start={pag.start}
          end={pag.end}
          total={pag.total}
        />

        {showModal && (
          <div className="master-modal-overlay">
            <div className="master-modal">
              <div className="master-modal-header">
                <div>
                  <h2>{editId ? "Edit" : "Tambah"} {title}</h2>
                  <p>{editId ? "Perbarui data" : "Masukkan data baru"}</p>
                </div>
                <button className="master-close" onClick={() => setShowModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="master-form">
                {fields.map((f) => (
                  <div className="master-field" key={f.name}>
                    <label>{f.label}</label>

                    {f.type === "select" ? (
                      <select
                        value={form[f.name]}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      >
                        <option value="">Pilih {f.label}</option>
                        {renderOptions(f)}
                      </select>
                    ) : (
                      <input
                        type={f.type === "password" ? "password" : "text"}
                        placeholder={f.placeholder || `Masukkan ${f.label.toLowerCase()}`}
                        value={form[f.name]}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="master-modal-footer">
                <button className="master-btn-batal" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button className="master-btn-simpan" onClick={simpan} disabled={saving}>
                  {saving ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Hapus Data"
          message="Yakin ingin menghapus data ini? Data yang dihapus tidak dapat dikembalikan."
          confirmText="Hapus"
          cancelText="Batal"
          danger
          onConfirm={konfirmasiHapus}
          onCancel={() => setDeleteTarget(null)}
        />

      </div>
    </DashboardLayout>
  );
}

export default MasterCrudPage;