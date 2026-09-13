import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Pagination.css";

// =========================
// HOOK USE SERVER PAGINATION
// =========================
/* eslint-disable react-hooks/exhaustive-deps */
export function useServerPagination(fetcher, deps = []) {
  const [entries, setEntries] = useState(5);
  const [page, setPage] = useState(1);
  const [tabel, setTabel] = useState({
    data: [],
    total: 0,
    last_page: 1,
    per_page: 0,
  });
  const [loading, setLoading] = useState(false);
  const [muatUlang, setMuatUlang] = useState(0);

  const reload = () => setMuatUlang((x) => x + 1);

  const setHalaman = (hal) => {
    setPage(Math.max(1, hal));
  };

  useEffect(() => {
    setPage(1);
  }, deps);

  useEffect(() => {
    let aktif = true;

    setLoading(true);

    fetcher(page, entries)
      .then((res) => {
        if (!aktif) return;

        const current = res.current_page || 1;
        const last = res.last_page || 1;

        setTabel({
          data: res.data || [],
          total: res.total || 0,
          last_page: last,
          per_page: res.per_page || entries,
        });

        if (current > last) {
          setPage(last);
        }
      })
      .catch(() => {
        if (aktif) {
          setTabel({
            data: [],
            total: 0,
            last_page: 1,
            per_page: entries,
          });
        }
      })
      .finally(() => {
        if (aktif) setLoading(false);
      });

    return () => {
      aktif = false;
    };
  }, [page, entries, muatUlang, ...deps]);

  const totalPage =
    tabel.per_page > 0
      ? Math.max(1, Math.ceil(tabel.total / tabel.per_page))
      : 1;

  const start =
    tabel.total === 0
      ? 0
      : (page - 1) * (tabel.per_page || entries) + 1;

  const end = Math.min(
    page * (tabel.per_page || entries),
    tabel.total
  );

  return {
    entries,
    changeEntries: (e) => {
      setEntries(Number(e.target.value) || 5);
      setPage(1);
    },
    page,
    goToPage: setHalaman,
    totalPages: totalPage,
    start,
    end,
    total: tabel.total,
    pageData: tabel.data,
    loading,
    reload,
  };
}
/* eslint-enable react-hooks/exhaustive-deps */

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