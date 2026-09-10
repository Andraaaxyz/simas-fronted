import { AlertTriangle } from "lucide-react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message,
  confirmText = "Hapus",
  cancelText = "Batal",
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="cd-overlay" onClick={onCancel}>
      <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`cd-icon ${danger ? "cd-icon-danger" : ""}`}>
          <AlertTriangle size={24} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="cd-actions">
          <button className="cd-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`cd-btn-confirm ${danger ? "cd-btn-danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
