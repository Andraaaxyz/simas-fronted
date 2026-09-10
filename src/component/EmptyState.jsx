import { Inbox } from "lucide-react";
import "./EmptyState.css";

export default function EmptyState({
  icon,
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia.",
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <Inbox size={40} />}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
