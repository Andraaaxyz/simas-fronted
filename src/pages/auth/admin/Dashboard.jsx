import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  formatTanggal,
  ubahKeISO,
} from "../../../utils/tanggal";

import {
  Mail,
  Send,
  Archive,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [jumlahSurat, setJumlahSurat] = useState(0);
  const [jumlahDisposisi, setJumlahDisposisi] = useState(0);
  const [jumlahArsip, setJumlahArsip] = useState(0);
  const [aktivitas, setAktivitas] = useState([]);
  const [chartData, setChartData] = useState([]);

  const hariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ambilData = () => {
    const dataSurat =
      JSON.parse(localStorage.getItem("dataSurat")) || [];
    const dataDisposisi =
      JSON.parse(localStorage.getItem("dataDisposisi")) || [];

    const dataArsip = dataDisposisi.filter(
      (item) => item.status === "Selesai"
    );

    setJumlahSurat(dataSurat.length);
    setJumlahDisposisi(dataDisposisi.length);
    setJumlahArsip(dataArsip.length);

    // AKTIVITAS
    const aktivitasBaru = [];

    dataSurat.slice(-3).forEach((item) => {
      aktivitasBaru.push({
        id: `surat-${item.id}`,
        type: "surat",
        icon: <Mail size={18} />,
        title: "Surat masuk baru",
        description: `Surat dengan nomor ${item.noSurat}`,
        time: item.tanggalDiterima,
      });
    });

    dataDisposisi.slice(-3).forEach((item) => {
      aktivitasBaru.push({
        id: `disposisi-${item.id}`,
        type: "disposisi",
        icon: <Send size={18} />,
        title: "Disposisi surat",
        description: `Surat diberikan kepada ${item.pengguna}`,
        time: ubahKeISO(item.tanggal),
      });
    });

    dataArsip.slice(-3).forEach((item) => {
      aktivitasBaru.push({
        id: `arsip-${item.id}`,
        type: "arsip",
        icon: <Archive size={18} />,
        title: "Arsip digital",
        description: `Surat ${item.noSurat} telah selesai`,
        time: ubahKeISO(item.tanggal),
      });
    });

    setAktivitas(aktivitasBaru.reverse().slice(0, 5));

    // CHART — hitung surat per bulan (6 bulan terakhir)
    const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const now = new Date();
    const chart = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();

      const count = dataSurat.filter((s) => {
        const t = new Date(s.tanggalDiterima);
        return t.getMonth() === m && t.getFullYear() === y;
      }).length;

      chart.push({ label: bulan[m], value: count });
    }

    setChartData(chart);
  };

  useEffect(() => {
    ambilData();
    const updateData = () => ambilData();
    window.addEventListener("storage", updateData);
    return () => window.removeEventListener("storage", updateData);
  }, []);

  const maxChart = Math.max(...chartData.map((c) => c.value), 1);

  return (
    <DashboardLayout title="Dashboard Admin">

      {/* WELCOME */}
      <div className="welcome-card">
        <div>
          <span className="welcome-label">SIMAS</span>
          <h2>Selamat Datang, Admin</h2>
          <p>
            Aplikasi ini digunakan untuk pencatatan
            surat masuk dan arsip digital.
          </p>
          <div className="welcome-date">
            <Calendar size={14} />
            {hariIni}
          </div>
        </div>
      </div>


      {/* STATISTIK */}
      <div className="stats-grid">

        <div
          className="stat-card"
          onClick={() => navigate("/admin/surat-masuk")}
        >
          <div className="stat-icon blue">
            <Mail size={25} />
          </div>
          <div>
            <p>Surat Masuk</p>
            <h3>{jumlahSurat}</h3>
            <span>
              <TrendingUp size={14} />
              Total surat masuk
            </span>
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/admin/disposisi")}
        >
          <div className="stat-icon orange">
            <Send size={25} />
          </div>
          <div>
            <p>Disposisi</p>
            <h3>{jumlahDisposisi}</h3>
            <span>
              <Clock size={14} />
              Menunggu proses
            </span>
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/admin/arsip")}
        >
          <div className="stat-icon green">
            <Archive size={25} />
          </div>
          <div>
            <p>Arsip Digital</p>
            <h3>{jumlahArsip}</h3>
            <span>
              <CheckCircle size={14} />
              Arsip tersimpan
            </span>
          </div>
        </div>

      </div>


      {/* CHART BULANAN */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3>Surat per Bulan</h3>
            <p>6 bulan terakhir</p>
          </div>
          <div className="stat-trend up">
            <TrendingUp size={12} />
            Aktif
          </div>
        </div>

        <div className="chart-bars">
          {chartData.map((item, i) => (
            <div className="chart-col" key={i}>
              <span className="chart-value">{item.value}</span>
              <div
                className="chart-bar"
                style={{
                  height: `${(item.value / maxChart) * 100}%`,
                }}
              />
              <span className="chart-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>


      {/* AKTIVITAS */}
      <div className="activity-card">
        <div className="activity-header">
          <div>
            <h3>Aktivitas Terbaru</h3>
            <p>Aktivitas administrasi surat terbaru</p>
          </div>
        </div>

        {aktivitas.length > 0 ? (
          aktivitas.map((item) => (
            <div className="activity-item" key={item.id}>
              <div className="activity-icon">
                {item.icon}
              </div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <span>{formatTanggal(item.time)}</span>
            </div>
          ))
        ) : (
          <div className="activity-item">
            <div className="activity-icon">
              <Mail size={18} />
            </div>
            <div>
              <strong>Belum ada aktivitas</strong>
              <p>Aktivitas surat akan muncul di sini.</p>
            </div>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
