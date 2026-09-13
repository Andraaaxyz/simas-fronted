import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import {
  Mail,
  Clock,
  CheckCircle,
  Archive,
  TrendingUp,
  Calendar,
} from "lucide-react";

import { api, getAuth } from "../../../services/apiClient";

const BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total_surat: 0,
    total_disposisi: 0,
    total_arsip: 0,
  });
  const [chartData, setChartData] = useState([]);

  const getSapaan = () => {
    const jam = new Date().getHours();
    if (jam < 11) return "Selamat pagi";
    if (jam < 15) return "Selamat siang";
    if (jam < 18) return "Selamat sore";
    return "Selamat malam";
  };

  const namaUser = getAuth()?.user?.nama || "Pengguna";

  const hariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        const d = res.data?.data || {};

        setSummary(d.summary || {});

        const perBulan = d.surat_per_bulan || [];
        const byBulan = {};
        perBulan.forEach((b) => (byBulan[b.bulan] = b.jumlah));

        setChartData(
          BULAN.map((label, i) => ({
            label,
            value: byBulan[i + 1] || 0,
          }))
        );
      })
      .catch(() =>
        setSummary({ total_surat: 0, total_disposisi: 0, total_arsip: 0 })
      );
  }, []);

  const maxChart = Math.max(...chartData.map((c) => c.value), 1);

  return (
    <DashboardLayout title="Dashboard Pengguna">

      <div className="welcome-card">
        <div>
          <h2>Selamat Datang, {namaUser}</h2>
          <p>{getSapaan()}! Have a nice day today, you can do it! 💪</p>
          <div className="welcome-date">
            <Calendar size={14} />
            {hariIni}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate("/pengguna/surat-masuk")}>
          <div className="stat-icon blue"><Mail size={25} /></div>
          <div>
            <p>Surat Masuk</p>
            <h3>{summary.total_surat}</h3>
            <span><TrendingUp size={14} /> Total surat masuk</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/pengguna/disposisi")}>
          <div className="stat-icon orange"><Clock size={25} /></div>
          <div>
            <p>Disposisi</p>
            <h3>{summary.total_disposisi}</h3>
            <span><Clock size={14} /> Total disposisi</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/pengguna/arsip")}>
          <div className="stat-icon green"><Archive size={25} /></div>
          <div>
            <p>Arsip Digital</p>
            <h3>{summary.total_arsip}</h3>
            <span><CheckCircle size={14} /> Telah diproses</span>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3>Surat per Bulan</h3>
            <p>Tahun berjalan</p>
          </div>
        </div>
        <div className="chart-bars">
          {chartData.map((item, i) => (
            <div className="chart-col" key={i}>
              <span className="chart-value">{item.value}</span>
              <div className="chart-bar" style={{ height: `${(item.value / maxChart) * 100}%` }} />
              <span className="chart-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;