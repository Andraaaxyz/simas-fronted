import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import {
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { api, simpanAuth, mapRole } from "../../services/apiClient";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/login", form);

      simpanAuth(data.token, data.user);

      const role = mapRole(data.user.role);

      navigate(`/${role}/dashboard`);
    } catch (err) {
      const status = err.response?.status;

      if (status === 403) {
        setError(err.response?.data?.message || "Akun tidak aktif");
      } else if (status === 429) {
        setError("Terlalu banyak percobaan. Coba lagi beberapa saat.");
      } else {
        setError(
          err.response?.data?.message ||
            "Username atau password salah!"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =========================
          HERO FOTO + ORGANIC SHAPES
      ========================= */}
      <div className="login-hero">

        {/* ELEMEN DEKORATIF POJOK KIRI */}
        <img
          className="corner-img corner-top-left"
          src="/images/kiri-atas.png"
          alt=""
        />
        <img
          className="corner-img corner-bottom-left"
          src="/images/kiri-bawah.png"
          alt=""
        />

        {/* ORGANIC SHAPES POJOK KIRI */}
        <span className="login-blob blob-top" />
        <span className="login-line line-1" />
        <span className="login-blob blob-dot" />
        <span className="login-blob blob-bottom" />
        <span className="login-line line-2" />

        {/* BRANDING HERO */}
        <div className="hero-brand">

          <img
            className="hero-logo"
            src="/images/logo-remove.png"
            alt="Logo SIMAS"
          />

          <h2>Sistem Informasi Administrasi Surat</h2>

          <p>
            Digitalisasi administrasi untuk pengelolaan
            yang lebih tertib, efisien, dan terintegrasi.
          </p>

        </div>

      </div>


      {/* =========================
          PANEL LOGIN MELENGKUNG
      ========================= */}
      <div className="login-screen">

        {/* DEKOR SAMAR DI BELAKANG CARD */}
        <span className="screen-blob screen-blob-a" />
        <span className="screen-blob screen-blob-b" />

        <div className="login-card">

          {/* LOGO + TITLE */}
          <div className="login-header">

            <img
              className="login-logo"
              src="/images/logo-remove.png"
              alt="Logo SIMAS"
            />

            <h2>Selamat Datang</h2>

            <p>
              Silahkan Login Terlebih dahulu
            </p>

          </div>

          {/* FORM LOGIN */}
          <form onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div className="form-group">

              <label htmlFor="login-username">
                Username
              </label>

              <div className="input-wrapper">

                <User size={19} />

                <input
                  id="login-username"
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="form-group">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* OPTIONS */}
            <div className="login-options">

              <label>
                <input type="checkbox" />
                Ingat Saya
              </label>

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* BUTTON LOGIN */}
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="login-footer">

            Belum punya akun?

            <span>
              {" "}Hubungi Admin!
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;