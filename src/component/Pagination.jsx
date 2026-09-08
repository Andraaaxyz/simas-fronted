import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Pagination.css";

// =========================
// HOOK USE PAGINATION
// =========================
export function usePagination(data, defaultEntries = 5) {
  const [entries, setEntries] = useState(defaultEntries);
  const [page, setPage] = useState(1);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / entries));
  const currentPage = Math.min(page, totalPages);

  const start = total === 0 ? 0 : (currentPage - 1) * entries + 1;
  const end = Math.min(currentPage * entries, total);

  const pageData = data.slice((currentPage - 1) * entries, end);

  const goToPage = (p) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  };

  const changeEntries = (e) => {
    setEntries(Number(e.target.value) || 5);
    setPage(1);
  };

  return {
    entries,
    changeEntries,
    page: currentPage,
    goToPage,
    totalPages,
    start,
    end,
    total,
    pageData,
  };
}

// =========================
// COMPONENT ENTRIES SELECT
// =========================
export function EntriesSelect({ value, onChange }) {
  return (
    <div className="pag-entries-wrapper">
      <label className="pag-label">Tampilkan</label>

      <select
        className="pag-select"
        value={value}
        onChange={onChange}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <label className="pag-label">entri</label>
    </div>
  );
}

// =========================
// COMPONENT PAGINATION BAR
// =========================
export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  start,
  end,
  total,
}) {
  if (total === 0) {
    return (
      <div className="pag-bar">
        <span className="pag-info">
          Menampilkan 0 data
        </span>
      </div>
    );
  }

  // =========================
  // DAFTAR HALAMAN
  // =========================
  const buatPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="pag-bar">
      <span className="pag-info">
        Menampilkan {start} - {end} dari {total} data
      </span>

      <div className="pag-buttons">
        <button
          className="pag-btn"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          title="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {buatPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="pag-dots"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`pag-btn ${
                p === page ? "active" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="pag-btn"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          title="Halaman berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}