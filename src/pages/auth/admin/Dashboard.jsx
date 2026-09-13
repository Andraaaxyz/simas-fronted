import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Send,
  Archive,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import { formatTanggal } from "../../../utils/tanggal";
import { api } from "../../../services/apiClient";

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

  const [aktivitas, setAktivitas] = useState([]);
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

  const ambilData = async () => {
    const [resDash, resLog] = await Promise.allSettled([
      api.get("/dashboard"),
      api.get("/log-aktivitas"),
    ]);

    if (resDash.status === "fulfilled") {
      const s = resDash.value.data?.data || {};
      setSummary(s.summary || {});

      const perBulan = s.surat_per_bulan || [];
      const byBulan = {};
      perBulan.forEach((b) => (byBulan[b.bulan] = b.jumlah));

      setChartData(
        BULAN.map((label, i) => ({
          label,
          value: byBulan[i + 1] || 0,
        }))
      );
    }

    if (resLog.status === "fulfilled") {
      const logs = (resLog.value.data?.data?.data || []).slice(0, 5);

      let icon = <Mail size={18} />;
      const items = logs.map((log) => {
        const teks = log.aktivitas || "";
        if (/hapus/i.test(teks)) icon = <Trash2 size={18} />;
        else if (/disposisi/i.test(teks)) icon = <Send size={18} />;
        else if (/arsip/i.test(teks)) icon = <Archive size={18} />;
        else icon = <Mail size={18} />;

        return {
          id: `log-${log.id}`,
          icon,
          title: "Aktivitas sistem",
          description: teks,
          time: log.created_at,
          user: log.user?.nama,
        };
      });

      setAktivitas(items);
    }
  };

  useEffect(() => {
    ambilData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxChart = Math.max(...chartData.map((c) => c.value), 1);

  return (
    <DashboardLayout title="Dashboard Admin">

      {/* WELCOME */}
      <div className="welcome-card">
        <div>
          <h2>Selamat Datang, Admin</h2>
          <p>{getSapaan()}! Have a nice day today, you can do it! 💪</p>
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
            <h3>{summary.total_surat}</h3>
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
            <h3>{summary.total_disposisi}</h3>
            <span>
              <Clock size={14} />
              Total disposisi
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
            <h3>{summary.total_arsip}</h3>
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
            <p>Tahun berjalan</p>
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