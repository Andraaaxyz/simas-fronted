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
  api,
  getAuth,
  mapRole,
  hapusAuth,
} from "../../services/apiClient";

function ProfilAkun({ role }) {
  const navigate = useNavigate();
  const showToast = useToast();

  const [profil, setProfil] = useState(null);
  const [mode, setMode] = useState(null); // "edit" | "password" | null
  const [form, setForm] = useState({ nama: "", email: "" });
  const [passForm, setPassForm] = useState({
    baru: "",
    konfirmasi: "",
  });
  const [showPass, setShowPass] = useState({
    baru: false,
    konfirmasi: false,
  });
  const [saving, setSaving] = useState(false);

  // =========================
  // AMBIL DATA PROFIL
  // =========================

  const cekSesi = () => {
    const sesi = getAuth();

    if (!sesi || !sesi.user) {
      hapusAuth();
      navigate("/login", { replace: true });
      return false;
    }

    if (mapRole(sesi.user.role) !== role) {
      hapusAuth();
      navigate("/login", { replace: true });
      return false;
    }

    return true;
  };

  const ambilProfil = async () => {
    if (!cekSesi()) return;

    try {
      const { data } = await api.get("/profile");
      const user = data.data || data.user || data;

      setProfil({
        id: user.id,
        nama: user.nama,
        nip: user.nip || "-",
        email: user.email,
        username: user.username,
        status: user.status || "aktif",
        role: user.role?.nama_role || user.role || role,
        jabatan:
          user.bidang?.nama_bidang || "Administrasi",
      });
    } catch {
      showToast("error", "Gagal memuat data profil!");
    }
  };

  useEffect(() => {
    ambilProfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // =========================
  // SIMPAN PROFIL (NAMA + EMAIL)
  // =========================

  const simpanProfil = async () => {
    if (!form.nama.trim() || !form.email.trim()) {
      showToast("error", "Nama dan email wajib diisi!");
      return;
    }

    setSaving(true);

    try {
      await api.put("/profile", {
        nama: form.nama.trim(),
        email: form.email.trim(),
      });

      setProfil((prev) => ({
        ...prev,
        nama: form.nama.trim(),
        email: form.email.trim(),
      }));

      setMode(null);
      showToast("success", "Profil berhasil diperbarui!");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Gagal menyimpan profil!";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // GANTI PASSWORD
  // =========================

  const gantiPassword = async () => {
    if (passForm.baru.length < 8) {
      showToast(
        "error",
        "Password baru minimal 8 karakter!"
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

    setSaving(true);

    try {
      await api.put("/profile", {
        password: passForm.baru,
        password_confirmation: passForm.konfirmasi,
      });

      setPassForm({ baru: "", konfirmasi: "" });
      setMode(null);
      showToast("success", "Password berhasil diganti!");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Gagal mengganti password!";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  if (!profil) return null;

  const bukaEdit = () => {
    setForm({ nama: profil.nama, email: profil.email });
    setMode("edit");
  };

  const bukaPassword = () => {
    setPassForm({ baru: "", konfirmasi: "" });
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
                {profil.status === "aktif"
                  ? "Aktif"
                  : profil.status === "nonaktif"
                  ? "Nonaktif"
                  : profil.status}
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
              <strong>
                {profil.status === "aktif"
                  ? "Aktif"
                  : profil.status === "nonaktif"
                  ? "Nonaktif"
                  : profil.status}
              </strong>
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
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? "Menyimpan..." : "Simpan"}
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
              "baru",
              "Password Baru",
              "Minimal 8 karakter"
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
                disabled={saving}
              >
                <KeyRound size={16} />
                {saving ? "Menyimpan..." : "Ganti Password"}
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
                  <strong>••••••••</strong>
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