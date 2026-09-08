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
} from "lucide-react";

import { useState } from "react";

function DashboardLayout({ title, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotif, setShowNotif] = useState(false);

  const isPimpinan =
    location.pathname.startsWith("/pimpinan");

  const isPengguna =
    location.pathname.startsWith("/pengguna");

  const handleLogout = () => {
    navigate("/login");
  };

  const dashboardPath = isPimpinan
    ? "/pimpinan/dashboard"
    : isPengguna
    ? "/pengguna/dashboard"
    : "/admin/dashboard";

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
          <div className="logo-circle">
            S
          </div>

          <div>
            <h2>SIMAS</h2>
            <span>
              Sistem Administrasi Surat
            </span>
          </div>
        </div>

        {/* MENU */}
        <nav className="menu">

          {/* DASHBOARD */}
          <NavLink
            to={dashboardPath}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>


          {/* PENGGUNA */}
          {isPengguna ? (
            <>
              <NavLink
                to="/pengguna/surat-masuk"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Mail size={18} />
                Surat Masuk
              </NavLink>

              <NavLink
                to="/pengguna/disposisi"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <ClipboardList size={18} />
                Disposisi
              </NavLink>

              <NavLink
                to="/pengguna/arsip"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Archive size={18} />
                Arsip Digital
              </NavLink>

              <NavLink
                to="/pengguna/profil"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <UserCircle size={18} />
                Profil
              </NavLink>
            </>

          ) : isPimpinan ? (

            /* PIMPINAN */
            <>
              <NavLink
                to="/pimpinan/surat-masuk"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Mail size={18} />
                Surat Masuk
              </NavLink>

              <NavLink
                to="/pimpinan/arsip"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Archive size={18} />
                Arsip Digital
              </NavLink>

              <NavLink
                to="/pimpinan/laporan"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FileText size={18} />
                Laporan
              </NavLink>

              <NavLink
                to="/pimpinan/profil"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <UserCircle size={18} />
                Profil
              </NavLink>
            </>

          ) : (

            /* ADMIN */
            <>
              <NavLink
                to="/admin/surat-masuk"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Mail size={18} />
                Surat Masuk
              </NavLink>

              <NavLink
                to="/admin/arsip"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Archive size={18} />
                Arsip Digital
              </NavLink>

              <NavLink
                to="/admin/disposisi"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <ClipboardList size={18} />
                Disposisi
              </NavLink>

              <NavLink
                to="/admin/laporan"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FileText size={18} />
                Laporan
              </NavLink>

              <NavLink
                to="/admin/profil"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <UserCircle size={18} />
                Profil
              </NavLink>
            </>
          )}

        </nav>

        {/* LOGOUT */}
        <button
          className="logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Keluar
        </button>

      </aside>


      {/* MAIN */}
      <main className="layout-main">

        <header className="navbar">

          <div>
            <h1>{title}</h1>

            <p>
              Selamat datang di SIMAS.
            </p>
          </div>


          {/* NOTIFICATION */}
          <div className="notification-wrapper">

            <button
              className="notif-btn"
              type="button"
              onClick={() =>
                setShowNotif(!showNotif)
              }
            >
              <Bell size={20} />

              {/* ANGKA NOTIFIKASI */}
              {isPengguna && (
                <span className="notif-badge">
                  1
                </span>
              )}

            </button>


            {/* PANEL NOTIFIKASI */}
            {showNotif && (
              <div className="notification-panel">

                <div className="notification-header">

                  <div>
                    <h3>Notifikasi</h3>
                    <span>
                      Pemberitahuan terbaru
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setShowNotif(false)
                    }
                  >
                    <X size={17} />
                  </button>

                </div>


                {/* NOTIFIKASI */}
                {isPengguna ? (
                  <div
                    className="notification-item"
                    onClick={handleNotifClick}
                  >

                    <div className="notification-icon">
                      <ClipboardList
                        size={18}
                      />
                    </div>

                    <div className="notification-text">

                      <strong>
                        Disposisi baru
                      </strong>

                      <p>
                        Anda menerima disposisi
                        surat baru dari Admin.
                      </p>

                      <small>
                        Baru saja
                      </small>

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