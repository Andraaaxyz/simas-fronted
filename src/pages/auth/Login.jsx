import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import {
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // =====================
    // LOGIN ADMIN
    // =====================
    if (
      form.username === "admin" &&
      form.password === "admin123"
    ) {
      navigate("/admin/dashboard");
      return;
    }

    // =====================
    // LOGIN PIMPINAN
    // =====================
    if (
      form.username === "pimpinan" &&
      form.password === "pimpinan123"
    ) {
      navigate("/pimpinan/dashboard");
      return;
    }

    // =====================
    // LOGIN PENGGUNA
    // =====================
    if (
      form.username === "pengguna" &&
      form.password === "pengguna123"
    ) {
      navigate("/pengguna/dashboard");
      return;
    }

    // =====================
    // LOGIN SALAH
    // =====================
    alert("Username atau password salah!");
  };

  return (
    <div className="login-page">

      {/* =========================
          AREA KIRI — FOTO GEDUNG
      ========================= */}
      <div className="login-left">

        {/* DEKORASI CURVE */}
        <span className="decor-curve decor-top" />
        <span className="decor-curve-line decor-line" />
        <span className="decor-curve decor-bottom" />

        <div className="brand">

          <h1>SIMAS</h1>

          <h3>
            Sistem Informasi Administrasi Surat
          </h3>

          <p>
            Aplikasi ini digunakan untuk
            pencatatan surat masuk dan arsip digital.
          </p>

        </div>

      </div>


      {/* =========================
          AREA KANAN — LOGIN CARD
      ========================= */}
      <div className="login-right">

        <div className="login-card">

          {/* HEADER + LOGO */}
          <div className="login-header">

            <img
              className="login-logo"
              src="/images/logo.png"
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

                <User size={20} />

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

                <Lock size={20} />

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
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
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

              <button type="button">
                Lupa Password?
              </button>

            </div>

            {/* BUTTON LOGIN */}
            <button
              className="login-button"
              type="submit"
            >
              Masuk
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