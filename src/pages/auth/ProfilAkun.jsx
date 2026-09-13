import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  CreditCard,
  Briefcase,
  Mail,
  Lock,
  AtSign,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  X,
  KeyRound,
  Save,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./admin/Profil.css";

import { useToast } from "../../component/Toast";

import {
  getMasterData,
  updateMasterData,
  simpanProfilAdmin,
  getProfilAdmin,
  getSesi,
  hapusSesi,
  MASTER_KEYS,
} from "../../services/masterData";

function ProfilAkun({ role }) {
  const navigate = useNavigate();
  const showToast = useToast();

  const [profil, setProfil] = useState(null);
  const [mode, setMode] = useState(null); // "edit" | "password" | null
  const [form, setForm] = useState({ nama: "", email: "" });
  const [passForm, setPassForm] = useState({
    lama: "",
    baru: "",
    konfirmasi: "",
  });
  const [showPass, setShowPass] = useState({
    lama: false,
    baru: false,
    konfirmasi: false,
  });

  // =========================
  // AMBIL DATA PROFIL
  // =========================

  const ambilProfil = () => {
    const sesi = getSesi();

    if (!sesi || sesi.role !== role) {
      hapusSesi();
      navigate("/login", { replace: true });
      return null;
    }

    if (role === "admin") {
      return {
        ...getProfilAdmin(),
        role: "ADMIN",
        jabatan: "Administrator",
      };
    }

    const key =
      role === "pimpinan"
        ? MASTER_KEYS.pimpinan
        : MASTER_KEYS.user;

    const akun = getMasterData(key).find(
      (u) => u.username === sesi.username
    );

    if (!akun) {
      hapusSesi();
      navigate("/login", { replace: true });
      return null;
    }

    return {
      ...akun,
      role: role.toUpperCase(),
      jabatan:
        role === "pimpinan"
          ? "Kepala Dinas"
          : akun.bidang || "Staff Administrasi",
    };
  };

  useEffect(() => {
    setProfil(ambilProfil());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // =========================
  // SIMPAN PROFIL (NAMA + EMAIL)
  // =========================

  const simpanProfil = () => {
    if (!form.nama.trim() || !form.email.trim()) {
      showToast("error", "Nama dan email wajib diisi!");
      return;
    }

    if (role === "admin") {
      simpanProfilAdmin({
        nama: form.nama.trim(),
        email: form.email.trim(),
      });
    } else {
      const key =
        role === "pimpinan"
          ? MASTER_KEYS.pimpinan
          : MASTER_KEYS.user;

      updateMasterData(key, profil.id, {
        nama: form.nama.trim(),
        email: form.email.trim(),
      });
    }

    setProfil((prev) => ({
      ...prev,
      nama: form.nama.trim(),
      email: form.email.trim(),
    }));

    setMode(null);
    showToast("success", "Profil berhasil diperbarui!");
  };

  // =========================
  // GANTI PASSWORD
  // =========================

  const gantiPassword = () => {
    if (passForm.lama !== profil.password) {
      showToast("error", "Password lama tidak sesuai!");
      return;
    }

    if (passForm.baru.length < 6) {
      showToast(
        "error",
        "Password baru minimal 6 karakter!"
      );
      return;
    }

    if (passForm.baru !== passForm.konfirmasi) {
      showToast(
        "error",
        "Konfirmasi password tidak cocok!"
      );
      return;
    }

    if (role === "admin") {
      simpanProfilAdmin({ password: passForm.baru });
    } else {
      const key =
        role === "pimpinan"
          ? MASTER_KEYS.pimpinan
          : MASTER_KEYS.user;

      updateMasterData(key, profil.id, {
        password: passForm.baru,
      });
    }

    setProfil((prev) => ({
      ...prev,
      password: passForm.baru,
    }));

    setPassForm({ lama: "", baru: "", konfirmasi: "" });
    setMode(null);
    showToast("success", "Password berhasil diganti!");
  };

  if (!profil) return null;

  const bukaEdit = () => {
    setForm({ nama: profil.nama, email: profil.email });
    setMode("edit");
  };

  const bukaPassword = () => {
    setPassForm({ lama: "", baru: "", konfirmasi: "" });
    setMode("password");
  };

  const togglePass = (field) => {
    setShowPass((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passInput = (field, label, placeholder) => (
    <div className="profile-fields password-fields">
      <div className="profile-field">
        <div className="field-icon">
          <Lock size={17} />
        </div>

        <div className="field-input-wrap">
          <span>{label}</span>
          <div className="field-input-row">
            <input
              className="profile-input"
              type={
                showPass[field] ? "text" : "password"
              }
              placeholder={placeholder}
              value={passForm[field]}
              onChange={(e) =>
                setPassForm({
                  ...passForm,
                  [field]: e.target.value,
                })
              }
            />
            <button
              className="field-eye"
              type="button"
              onClick={() => togglePass(field)}
              aria-label="Tampilkan"
            >
              {showPass[field] ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="profil-page">

        {/* HEADER */}
        <div className="profil-page-header">
          <div>
            <span className="profil-breadcrumb">
              Akun / Profil
            </span>
            <h1>Profil Saya</h1>
            <p>
              Kelola dan lihat informasi akun Anda
            </p>
          </div>

          {mode === null && (
            <div className="header-actions">

              <span className="header-status">
                <span></span>
                {profil.status}
              </span>

              <button
                className="btn-profil-action"
                onClick={bukaPassword}
              >
                <KeyRound size={16} />
                Ganti Password
              </button>

            </div>
          )}
        </div>

        {/* PROFILE HERO */}
        <div className="profile-hero">

          <div className="profile-hero-left">

            <div className="profile-avatar">
              {profil.nama
                .split(" ")
                .map((kata) => kata[0])
                .join("")
                .substring(0, 2)}
            </div>

            <div className="profile-identity">
              <span className="profile-role">
                <ShieldCheck size={14} />
                {profil.role}
              </span>

              <h2>{profil.nama}</h2>

              <p>
                <Briefcase size={15} />
                {profil.jabatan}
              </p>
            </div>

          </div>

          <div className="profile-active">
            <CheckCircle2 size={18} />
            <div>
              <span>Status Akun</span>
              <strong>{profil.status}</strong>
            </div>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="profile-main">

          {/* DATA PRIBADI */}
          <div className="profile-card">

            <div className="profile-card-header">
              <div className="card-icon blue">
                <User size={19} />
              </div>

              <div>
                <h3>Informasi Pribadi</h3>
                <p>Data identitas pengguna</p>
              </div>

              {mode === null && (
                <button
                  className="btn-profil-edit"
                  onClick={bukaEdit}
                >
                  <Pencil size={15} />
                </button>
              )}
            </div>

            {mode === "edit" ? (
              <div className="profile-fields">

                <div className="profile-field">
                  <div className="field-icon">
                    <User size={17} />
                  </div>

                  <div className="field-input-wrap">
                    <span>Nama Lengkap</span>
                    <input
                      className="profile-input"
                      type="text"
                      value={form.nama}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nama: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <CreditCard size={17} />
                  </div>

                  <div>
                    <span>Nomor Induk Pegawai</span>
                    <strong>{profil.nip}</strong>
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <Briefcase size={17} />
                  </div>

                  <div>
                    <span>Jabatan</span>
                    <strong>{profil.jabatan}</strong>
                  </div>
                </div>

              </div>
            ) : (
              <div className="profile-fields">

                <div className="profile-field">
                  <div className="field-icon">
                    <User size={17} />
                  </div>

                  <div>
                    <span>Nama Lengkap</span>
                    <strong>{profil.nama}</strong>
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <CreditCard size={17} />
                  </div>

                  <div>
                    <span>Nomor Induk Pegawai</span>
                    <strong>{profil.nip}</strong>
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <Briefcase size={17} />
                  </div>

                  <div>
                    <span>Jabatan</span>
                    <strong>{profil.jabatan}</strong>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* AKUN */}
          <div className="profile-card">

            <div className="profile-card-header">
              <div className="card-icon purple">
                <AtSign size={19} />
              </div>

              <div>
                <h3>Informasi Akun</h3>
                <p>Informasi login akun</p>
              </div>
            </div>

            {mode === "edit" ? (
              <div className="profile-fields">

                <div className="profile-field">
                  <div className="field-icon">
                    <Mail size={17} />
                  </div>

                  <div className="field-input-wrap">
                    <span>Email</span>
                    <input
                      className="profile-input"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <AtSign size={17} />
                  </div>

                  <div>
                    <span>Username</span>
                    <strong>{profil.username}</strong>
                  </div>
                </div>

              </div>
            ) : (
              <div className="profile-fields">

                <div className="profile-field">
                  <div className="field-icon">
                    <Mail size={17} />
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{profil.email}</strong>
                  </div>
                </div>

                <div className="profile-field">
                  <div className="field-icon">
                    <AtSign size={17} />
                  </div>

                  <div>
                    <span>Username</span>
                    <strong>{profil.username}</strong>
                  </div>
                </div>

              </div>
            )}

            {mode === "edit" && (
              <div className="profile-form-actions">
                <button
                  className="btn-profil-batal"
                  onClick={() => setMode(null)}
                >
                  <X size={16} />
                  Batal
                </button>

                <button
                  className="btn-profil-simpan"
                  onClick={simpanProfil}
                >
                  <Save size={16} />
                  Simpan
                </button>
              </div>
            )}

          </div>

        </div>

        {/* PASSWORD */}
        {mode === "password" ? (
          <div className="profile-card password-card">

            <div className="profile-card-header">
              <div className="card-icon orange">
                <Lock size={19} />
              </div>

              <div>
                <h3>Ganti Password</h3>
                <p>Perbarui password akun Anda</p>
              </div>
            </div>

            {passInput(
              "lama",
              "Password Lama",
              "Masukkan password lama"
            )}

            {passInput(
              "baru",
              "Password Baru",
              "Minimal 6 karakter"
            )}

            {passInput(
              "konfirmasi",
              "Konfirmasi Password",
              "Ulangi password baru"
            )}

            <div className="profile-form-actions">
              <button
                className="btn-profil-batal"
                onClick={() => setMode(null)}
              >
                <X size={16} />
                Batal
              </button>

              <button
                className="btn-profil-simpan"
                onClick={gantiPassword}
              >
                <KeyRound size={16} />
                Ganti Password
              </button>
            </div>

          </div>
        ) : (
          <div className="profile-card password-card">

            <div className="profile-card-header">
              <div className="card-icon orange">
                <Lock size={19} />
              </div>

              <div>
                <h3>Keamanan Akun</h3>
                <p>Informasi keamanan akun Anda</p>
              </div>
            </div>

            <div className="password-box">

              <div className="password-left">
                <div className="password-icon">
                  <Lock size={18} />
                </div>

                <div>
                  <span>Password</span>
                  <strong>{profil.password}</strong>
                </div>
              </div>

              <span className="password-protected">
                Terlindungi
              </span>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default ProfilAkun;