import {
  LayoutDashboard,
  Mail,
  FileText,
  Archive,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          S
        </div>

        <div>
          <h2>SIMAS</h2>
          <span>Administrasi Surat</span>
        </div>
      </div>


      {/* MENU */}
      <nav className="sidebar-menu">

        <p className="sidebar-title">
          MENU UTAMA
        </p>

        <NavLink
          to="/admin/dashboard"
          className="sidebar-item"
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/admin/surat-masuk"
          className="sidebar-item"
        >
          <Mail size={19} />
          <span>Surat Masuk</span>
        </NavLink>


        <NavLink
          to="/admin/disposisi"
          className="sidebar-item"
        >
          <FileText size={19} />
          <span>Disposisi</span>
        </NavLink>


        <NavLink
          to="/admin/arsip"
          className="sidebar-item"
        >
          <Archive size={19} />
          <span>Arsip Digital</span>
        </NavLink>


        <NavLink
          to="/admin/laporan"
          className="sidebar-item"
        >
          <BarChart3 size={19} />
          <span>Laporan</span>
        </NavLink>


        <p className="sidebar-title settings-title">
          LAINNYA
        </p>


        <NavLink
          to="/admin/profil"
          className="sidebar-item"
        >
          <User size={19} />
          <span>Profil</span>
        </NavLink>

      </nav>


      {/* LOGOUT */}
      <button className="sidebar-logout">
        <LogOut size={18} />
        <span>Keluar</span>
      </button>

    </aside>
  );
}

export default Sidebar;