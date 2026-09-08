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

      {/* BAGIAN KIRI */}
      <div className="login-left">

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


      {/* BAGIAN KANAN */}
      <div className="login-right">

        <div className="login-card">

          {/* HEADER */}
          <div className="login-header">

            <h2>Selamat Datang</h2>

            <p>
              Silahkan Login Terlebih dahulu
            </p>

          </div>


          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div className="form-group">

              <label>
                Username
              </label>

              <div className="input-wrapper">

                <User size={20} />

                <input
                  type="text"
                  name="username"
                  placeholder="Masukan username"
                  value={form.username}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="form-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <Lock size={20} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Masukan password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
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