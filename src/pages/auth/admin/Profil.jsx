import {
  User,
  CreditCard,
  Briefcase,
  Mail,
  Lock,
  AtSign,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";
import "./Profil.css";

function Profil() {
  const profil = {
    nama: "Admin SIMAS",
    nip: "198765432101234567",
    jabatan: "Administrator",
    email: "admin@simas.com",
    username: "admin",
    password: "••••••••",
    status: "Aktif",
    role: "ADMIN",
  };

  return (
    <DashboardLayout>
      <div className="profil-page">

        {/* HEADER */}
        <div className="profil-page-header">
          <div>
            <span className="profil-breadcrumb">Akun / Profil</span>
            <h1>Profil Saya</h1>
            <p>Kelola dan lihat informasi akun Anda</p>
          </div>

          <div className="header-status">
            <span></span>
            {profil.status}
          </div>
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
            </div>

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

          </div>

        </div>

        {/* PASSWORD */}
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

      </div>
    </DashboardLayout>
  );
}

export default Profil;