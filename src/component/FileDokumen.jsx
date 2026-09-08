import { Download, FileText, FileImage } from "lucide-react";

import "./FileDokumen.css";

function FileDokumen({ value }) {
  if (!value) return <span className="file-kosong">-</span>;

  if (typeof value === "string") {
    return <span className="file-nama">{value}</span>;
  }

  const isGambar = (value.tipe || "").startsWith("image/");

  return (
    <div className="file-dokumen">
      <div className="file-info">
        {isGambar ? (
          <FileImage size={16} />
        ) : (
          <FileText size={16} />
        )}

        <span className="file-nama">{value.nama}</span>
      </div>

      {isGambar && (
        <img
          className="file-preview"
          src={value.data}
          alt={value.nama}
        />
      )}

      <a
        className="file-download"
        href={value.data}
        download={value.nama}
      >
        <Download size={15} />
        Download
      </a>
    </div>
  );
}

export default FileDokumen;