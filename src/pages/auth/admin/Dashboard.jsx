import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Dashboard.css";

import {
  Mail,
  Send,
  Archive,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [jumlahSurat, setJumlahSurat] = useState(0);
  const [jumlahDisposisi, setJumlahDisposisi] = useState(0);
  const [jumlahArsip, setJumlahArsip] = useState(0);

  const [aktivitas, setAktivitas] = useState([]);

  // =========================
  // AMBIL DATA
  // =========================
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

    // =========================
    // BUAT AKTIVITAS
    // =========================
    const aktivitasBaru = [];

    // SURAT MASUK
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

    // DISPOSISI
    dataDisposisi.slice(-3).forEach((item) => {
      aktivitasBaru.push({
        id: `disposisi-${item.id}`,
        type: "disposisi",
        icon: <Send size={18} />,
        title: "Disposisi surat",
        description: `Surat diberikan kepada ${item.pengguna}`,
        time: item.tanggal,
      });
    });

    // ARSIP
    dataArsip.slice(-3).forEach((item) => {
      aktivitasBaru.push({
        id: `arsip-${item.id}`,
        type: "arsip",
        icon: <Archive size={18} />,
        title: "Arsip digital",
        description: `Surat ${item.noSurat} telah selesai`,
        time: item.tanggal,
      });
    });

    // DATA TERBARU DI ATAS
    setAktivitas(
      aktivitasBaru.reverse().slice(0, 5)
    );
  };

  useEffect(() => {
    ambilData();

    const updateData = () => {
      ambilData();
    };

    window.addEventListener("storage", updateData);

    return () => {
      window.removeEventListener("storage", updateData);
    };
  }, []);

  return (
    <DashboardLayout title="Dashboard Admin">

      {/* =========================
          WELCOME
      ========================= */}
      <div className="welcome-card">

        <div>

          <span className="welcome-label">
            SIMAS
          </span>

          <h2>
            Sistem Informasi Administrasi Surat
          </h2>

          <p>
            Aplikasi ini digunakan untuk pencatatan
            surat masuk dan arsip digital.
          </p>

        </div>

      </div>


      {/* =========================
          STATISTIK
      ========================= */}
      <div className="stats-grid">

        {/* SURAT MASUK */}
        <div
          className="stat-card"
          onClick={() =>
            navigate("/admin/surat-masuk")
          }
          style={{ cursor: "pointer" }}
        >

          <div className="stat-icon blue">
            <Mail size={25} />
          </div>

          <div>

            <p>Surat Masuk</p>

            <h3>
              {jumlahSurat}
            </h3>

            <span>
              <TrendingUp size={14} />
              Data surat masuk
            </span>

          </div>

        </div>


        {/* DISPOSISI */}
        <div
          className="stat-card"
          onClick={() =>
            navigate("/admin/disposisi")
          }
          style={{ cursor: "pointer" }}
        >

          <div className="stat-icon orange">
            <Send size={25} />
          </div>

          <div>

            <p>Disposisi</p>

            <h3>
              {jumlahDisposisi}
            </h3>

            <span>
              <Clock size={14} />
              Menunggu proses
            </span>

          </div>

        </div>


        {/* ARSIP */}
        <div
          className="stat-card"
          onClick={() =>
            navigate("/admin/arsip")
          }
          style={{ cursor: "pointer" }}
        >

          <div className="stat-icon green">
            <Archive size={25} />
          </div>

          <div>

            <p>Arsip Digital</p>

            <h3>
              {jumlahArsip}
            </h3>

            <span>
              <CheckCircle size={14} />
              Arsip tersimpan
            </span>

          </div>

        </div>

      </div>


      {/* =========================
          AKTIVITAS TERBARU
      ========================= */}
      <div className="activity-card">

        <div className="activity-header">

          <div>

            <h3>
              Aktivitas Terbaru
            </h3>

            <p>
              Aktivitas administrasi surat terbaru
            </p>

          </div>

        </div>


        {aktivitas.length > 0 ? (

          aktivitas.map((item) => (

            <div
              className="activity-item"
              key={item.id}
            >

              <div className="activity-icon">
                {item.icon}
              </div>

              <div>

                <strong>
                  {item.title}
                </strong>

                <p>
                  {item.description}
                </p>

              </div>

              <span>
                {item.time}
              </span>

            </div>

          ))

        ) : (

          <div className="activity-item">

            <div className="activity-icon">
              <Mail size={18} />
            </div>

            <div>

              <strong>
                Belum ada aktivitas
              </strong>

              <p>
                Aktivitas surat akan muncul di sini.
              </p>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;