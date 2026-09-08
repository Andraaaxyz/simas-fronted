import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Dashboard.css";

import {
  Mail,
  Archive,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  return (
    <DashboardLayout title="Dashboard Pimpinan">

      {/* WELCOME */}
      <div className="welcome-card">
        <div>
          <span className="welcome-label">
            SIMAS
          </span>

          <h2>
            Selamat Datang, Pimpinan
          </h2>

          <p>
            Pantau surat masuk, arsip digital,
            dan laporan administrasi surat.
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
              <TrendingUp size={14} />
              Total surat masuk
            </span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={25} />
          </div>

          <div>
            <p>Menunggu Disposisi</p>
            <h3>5</h3>

            <span>
              <Clock size={14} />
              Perlu ditinjau
            </span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon green">
            <Archive size={25} />
          </div>

          <div>
            <p>Arsip Digital</p>
            <h3>1000</h3>

            <span>
              <CheckCircle size={14} />
              Arsip tersimpan
            </span>
          </div>
        </div>

      </div>


      {/* AKTIVITAS */}
      <div className="activity-card">

        <div className="activity-header">
          <div>
            <h3>Aktivitas Terbaru</h3>

            <p>
              Aktivitas administrasi surat
            </p>
          </div>
        </div>


        <div className="activity-item">

          <div className="activity-icon">
            <Mail size={18} />
          </div>

          <div>
            <strong>
              Surat masuk baru
            </strong>

            <p>
              Surat dengan nomor
              001/089/SK/2023
            </p>
          </div>

          <span>
            Hari ini
          </span>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            <FileText size={18} />
          </div>

          <div>
            <strong>
              Surat menunggu disposisi
            </strong>

            <p>
              Surat perlu ditinjau pimpinan
            </p>
          </div>

          <span>
            Kemarin
          </span>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            <Archive size={18} />
          </div>

          <div>
            <strong>
              Arsip digital
            </strong>

            <p>
              Dokumen berhasil diarsipkan
            </p>
          </div>

          <span>
            2 hari lalu
          </span>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;