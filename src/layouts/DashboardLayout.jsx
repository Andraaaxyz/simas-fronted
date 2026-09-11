import "./DashboardLayout.css";

import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  Mail,
  Archive,
  FileText,
  UserCircle,
  Bell,
  LogOut,
  ClipboardList,
  X,
  Database,
  ChevronDown,
  Users,
  ShieldCheck,
  FileType,
  Stamp,
  FolderOpen,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";

function DashboardLayout({ title, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotif, setShowNotif] = useState(false);
  const [showMaster, setShowMaster] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null);

  const isPimpinan =
    location.pathname.startsWith("/pimpinan");

  const isPengguna =
    location.pathname.startsWith("/pengguna");

  const roleLabel = isPimpinan
    ? "Pimpinan"
    : isPengguna
    ? "Pengguna"
    : "Administrator";

  const profilePath = isPimpinan
    ? "/pimpinan/profil"
    : isPengguna
    ? "/pengguna/profil"
    : "/admin/profil";

  const dashboardPath = isPimpinan
    ? "/pimpinan/dashboard"
    : isPengguna
    ? "/pengguna/dashboard"
    : "/admin/dashboard";

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNotifClick = () => {
    setShowNotif(false);
    navigate("/pengguna/disposisi");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="layout-sidebar">

        {/* LOGO */}
        <div className="logo">
          <img
            className="logo-img"
            src="/images/logo-remove.png"
            alt="Logo SIMAS"
          />
        </div>

        {/* MENU */}
        <nav className="menu">

          <NavLink
            to={dashboardPath}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          {/* PENGGUNA */}
          {isPengguna ? (
            <>
              <span className="menu-label">Menu</span>

              <NavLink to="/pengguna/surat-masuk" className={({ isActive }) => isActive ? "active" : ""}>
                <Mail size={18} />
                Surat Masuk
              </NavLink>

              <NavLink to="/pengguna/disposisi" className={({ isActive }) => isActive ? "active" : ""}>
                <ClipboardList size={18} />
                Disposisi
              </NavLink>

              <NavLink to="/pengguna/arsip" className={({ isActive }) => isActive ? "active" : ""}>
                <Archive size={18} />
                Arsip Digital
              </NavLink>

              <span className="menu-label">Akun</span>

              <NavLink to="/pengguna/profil" className={({ isActive }) => isActive ? "active" : ""}>
                <UserCircle size={18} />
                Profil
              </NavLink>
            </>

          ) : isPimpinan ? (
            <>
              <span className="menu-label">Menu</span>

              <NavLink to="/pimpinan/surat-masuk" className={({ isActive }) => isActive ? "active" : ""}>
                <Mail size={18} />
                Surat Masuk
              </NavLink>

              <NavLink to="/pimpinan/arsip" className={({ isActive }) => isActive ? "active" : ""}>
                <Archive size={18} />
                Arsip Digital
              </NavLink>

              <NavLink to="/pimpinan/laporan" className={({ isActive }) => isActive ? "active" : ""}>
                <FileText size={18} />
                Laporan
              </NavLink>

              <span className="menu-label">Akun</span>

              <NavLink to="/pimpinan/profil" className={({ isActive }) => isActive ? "active" : ""}>
                <UserCircle size={18} />
                Profil
              </NavLink>
            </>

          ) : (
            <>
              <span className="menu-label">Menu</span>

              <NavLink to="/admin/surat-masuk" className={({ isActive }) => isActive ? "active" : ""}>
                <Mail size={18} />
                Surat Masuk
              </NavLink>

              <NavLink to="/admin/arsip" className={({ isActive }) => isActive ? "active" : ""}>
                <Archive size={18} />
                Arsip Digital
              </NavLink>

              <NavLink to="/admin/disposisi" className={({ isActive }) => isActive ? "active" : ""}>
                <ClipboardList size={18} />
                Disposisi
              </NavLink>

              <NavLink to="/admin/laporan" className={({ isActive }) => isActive ? "active" : ""}>
                <FileText size={18} />
                Laporan
              </NavLink>

              <span className="menu-label">Master Data</span>

              <div className="master-menu">
                <button
                  className={`master-toggle ${location.pathname.startsWith("/admin/master") ? "active" : ""}`}
                  onClick={() => setShowMaster(!showMaster)}
                >
                  <Database size={18} />
                  <span>Master</span>
                  <ChevronDown className={`master-chevron ${showMaster ? "open" : ""}`} size={16} />
                </button>

                {showMaster && (
                  <div className="master-dropdown">
                    <NavLink to="/admin/master/pimpinan" className={({ isActive }) => isActive ? "active" : ""}>
                      <ShieldCheck size={15} />
                      Pimpinan
                    </NavLink>
                    <NavLink to="/admin/master/user" className={({ isActive }) => isActive ? "active" : ""}>
                      <Users size={15} />
                      User
                    </NavLink>
                    <NavLink to="/admin/master/jenis-surat" className={({ isActive }) => isActive ? "active" : ""}>
                      <FileType size={15} />
                      Jenis Surat
                    </NavLink>
                    <NavLink to="/admin/master/sifat-surat" className={({ isActive }) => isActive ? "active" : ""}>
                      <Stamp size={15} />
                      Sifat Surat
                    </NavLink>
                    <NavLink to="/admin/master/bidang" className={({ isActive }) => isActive ? "active" : ""}>
                      <FolderOpen size={15} />
                      Bidang
                    </NavLink>
                  </div>
                )}
              </div>

              <span className="menu-label">Akun</span>

              <NavLink to="/admin/profil" className={({ isActive }) => isActive ? "active" : ""}>
                <UserCircle size={18} />
                Profil
              </NavLink>
            </>
          )}

        </nav>

      </aside>


      {/* MAIN */}
      <main className="layout-main">

        <header className="navbar">

          <div>
            <h1>{title}</h1>
          </div>


          {/* NOTIFICATION + PROFILE */}
          <div className="navbar-actions">

            {/* NOTIFIKASI */}
            <div className="notification-wrapper">

              <button
                className="notif-btn"
                type="button"
                onClick={() => setShowNotif(!showNotif)}
              >
                <Bell size={20} />
                {isPengguna && (
                  <span className="notif-badge">1</span>
                )}
              </button>

              {showNotif && (
                <div className="notification-panel">
                  <div className="notification-header">
                    <div>
                      <h3>Notifikasi</h3>
                      <span>Pemberitahuan terbaru</span>
                    </div>
                    <button onClick={() => setShowNotif(false)}>
                      <X size={17} />
                    </button>
                  </div>

                  {isPengguna ? (
                    <div className="notification-item" onClick={handleNotifClick}>
                      <div className="notification-icon">
                        <ClipboardList size={18} />
                      </div>
                      <div className="notification-text">
                        <strong>Disposisi baru</strong>
                        <p>Anda menerima disposisi surat baru dari Admin.</p>
                        <small>Baru saja</small>
                      </div>
                    </div>
                  ) : (
                    <div className="notification-empty">
                      Tidak ada notifikasi baru.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* DROPDOWN PROFIL */}
            <div className="profile-wrapper" ref={profileRef}>
              <button
                className="profile-btn"
                type="button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="profile-avatar">
                  <img src="/images/user-profile.png" alt={roleLabel} />
                </div>
                <div className="profile-info">
                  <span className="profile-role">{roleLabel}</span>
                </div>
                <ChevronDown size={16} className={`profile-chevron ${showProfile ? "open" : ""}`} />
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-avatar-lg">
                      <img src="/images/user-profile.png" alt={roleLabel} />
                    </div>
                    <div>
                      <strong>{roleLabel}</strong>
                      <span>SIMAS</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setShowProfile(false);
                      navigate(profilePath);
                    }}
                  >
                    <UserCircle size={17} />
                    Profil Saya
                  </button>

                  <button
                    className="profile-dropdown-item profile-logout"
                    onClick={() => {
                      setShowProfile(false);
                      navigate("/login");
                    }}
                  >
                    <LogOut size={17} />
                    Keluar
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>


        {/* CONTENT */}
        <section className="page-content">
          {children}
        </section>

      </main>

    </div>
  );
}

export default DashboardLayout;
