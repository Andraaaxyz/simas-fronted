import * as XLSX from "xlsx";

const eskape = (nilai) =>
  String(nilai ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function nilaiKolom(row, kolom) {
  return kolom.render
    ? kolom.render(row)
    : row[kolom.key] ?? "-";
}

export function exportExcel({
  rows,
  columns,
  filename = "laporan",
}) {
  const header = [
    "No",
    ...columns.map((c) => c.label),
  ];

  const data = rows.map((row, i) => [
    i + 1,
    ...columns.map((c) =>
      typeof nilaiKolom(row, c) === "string"
        ? nilaiKolom(row, c)
        : String(nilaiKolom(row, c))
    ),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([
    header,
    ...data,
  ]);

  ws["!cols"] = [
    { wch: 5 },
    ...columns.map((c) => ({
      wch: Math.max(c.label.length + 4, 14),
    })),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan");
  XLSX.writeFile(
    wb,
    filename.endsWith(".xlsx")
      ? filename
      : `${filename}.xlsx`
  );
}

export function buatHTMLPrint({
  title,
  subtitle,
  columns,
  rows,
  footer,
}) {
  const thead = columns
    .map(
      (c) => `<th>${eskape(c.label)}</th>`
    )
    .join("");

  const tbody = rows
    .map(
      (row, i) =>
        `<tr><td class="no">${i + 1}</td>${columns
          .map(
            (c) =>
              `<td>${eskape(nilaiKolom(row, c))}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  const win = window.open(
    "",
    "_blank",
    "width=900,height=650"
  );

  if (!win) return;

  win.document.write(`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>${eskape(title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #1e293b;
    padding: 32px 40px;
  }
  .kop { text-align: center; margin-bottom: 28px; }
  .kop h1 {
    font-size: 22px;
    color: #0d9488;
    letter-spacing: 1px;
  }
  .kop p { font-size: 13px; color: #64748b; margin-top: 6px; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: left;
  }
  th {
    background: #f1f5f9;
    font-size: 12.5px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  td.no { text-align: center; width: 40px; }
  tfoot td {
    font-weight: 700;
    background: #f8fafc;
    text-align: right;
  }
</style>
</head>
<body>
  <div class="kop">
    <h1>${eskape(title)}</h1>
    <p>${eskape(subtitle)}</p>
  </div>
  <table>
    <thead><tr><th>No</th>${thead}</tr></thead>
    <tbody>${tbody}</tbody>
    ${footer ? `<tfoot><tr><td colspan="${columns.length + 1}">${eskape(footer)}</td></tr></tfoot>` : ""}
  </table>
</body>
</html>`);

  win.document.close();

  win.onload = () => {
    win.focus();
    win.print();
  };
}