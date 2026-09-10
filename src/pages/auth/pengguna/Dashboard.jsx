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

function Dashboard() {
  const navigate = useNavigate();

  const [jumlahSurat, setJumlahSurat] = useState(0);
  const [jumlahDisposisi, setJumlahDisposisi] = useState(0);
  const [jumlahArsip, setJumlahArsip] = useState(0);
  const [chartData, setChartData] = useState([]);

  const getSapaan = () => {
    const jam = new Date().getHours();
    if (jam < 11) return "Selamat pagi";
    if (jam < 15) return "Selamat siang";
    if (jam < 18) return "Selamat sore";
    return "Selamat malam";
  };

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
    <DashboardLayout title="Dashboard Pengguna">

      <div className="welcome-card">
        <div>
          <h2>Selamat Datang, Pengguna</h2>
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
            <h3>{jumlahSurat}</h3>
            <span><TrendingUp size={14} /> Total surat masuk</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/pengguna/disposisi")}>
          <div className="stat-icon orange"><Clock size={25} /></div>
          <div>
            <p>Menunggu</p>
            <h3>{jumlahDisposisi}</h3>
            <span><Clock size={14} /> Dalam proses</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/pengguna/arsip")}>
          <div className="stat-icon green"><Archive size={25} /></div>
          <div>
            <p>Arsip Digital</p>
            <h3>{jumlahArsip}</h3>
            <span><CheckCircle size={14} /> Telah diproses</span>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3>Surat per Bulan</h3>
            <p>6 bulan terakhir</p>
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
