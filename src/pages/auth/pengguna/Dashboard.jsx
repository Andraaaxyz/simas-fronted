import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Dashboard.css";

import {
  Mail,
  FileText,
  Clock,
  CheckCircle,
  Archive,
  Eye,
} from "lucide-react";

function Dashboard() {
  return (
    <DashboardLayout title="Dashboard Pengguna">

      {/* WELCOME */}
      <div className="welcome-card">
        <div>
          <span className="welcome-label">
            SIMAS
          </span>

          <h2>
            Selamat Datang, Pengguna
          </h2>

          <p>
            Kelola dan pantau informasi surat
            yang tersedia pada sistem SIMAS.
          </p>
        </div>
      </div>


      {/* STATISTIK */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            <Mail size={25} />
          </div>

          <div>
            <p>Surat Masuk</p>
            <h3>15</h3>

            <span>
              <Mail size={14} />
              Total surat
            </span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={25} />
          </div>

          <div>
            <p>Menunggu</p>
            <h3>5</h3>

            <span>
              <Clock size={14} />
              Dalam proses
            </span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={25} />
          </div>

          <div>
            <p>Selesai</p>
            <h3>10</h3>

            <span>
              <CheckCircle size={14} />
              Telah diproses
            </span>
          </div>
        </div>

      </div>


      {/* SURAT TERBARU */}
      <div className="activity-card">

        <div className="activity-header">
          <div>
            <h3>Surat Terbaru</h3>
            <p>
              Daftar surat masuk terbaru
            </p>
          </div>
        </div>


        <div className="activity-item">

          <div className="activity-icon">
            <FileText size={18} />
          </div>

          <div>
            <strong>
              Surat Edaran
            </strong>

            <p>
              Dinas Pendidikan
            </p>
          </div>

          <button className="view-button">
            <Eye size={16} />
            Lihat
          </button>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            <FileText size={18} />
          </div>

          <div>
            <strong>
              Undangan Rapat
            </strong>

            <p>
              Dinas Kabupaten
            </p>
          </div>

          <button className="view-button">
            <Eye size={16} />
            Lihat
          </button>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            <Archive size={18} />
          </div>

          <div>
            <strong>
              Dokumen Arsip
            </strong>

            <p>
              Arsip Digital SIMAS
            </p>
          </div>

          <button className="view-button">
            <Eye size={16} />
            Lihat
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;