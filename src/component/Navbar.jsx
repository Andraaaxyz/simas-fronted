import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

import "./Navbar.css";

function Navbar({ title = "Dashboard" }) {
  return (
    <header className="navbar">

      <div className="navbar-title">

        <h1>{title}</h1>

        <p>
          Selamat datang kembali di SIMAS
        </p>

      </div>


      <div className="navbar-right">

        {/* SEARCH */}
        <div className="navbar-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Cari..."
          />

        </div>


        {/* NOTIFICATION */}
        <button className="navbar-notification">

          <Bell size={19} />

          <span></span>

        </button>


        {/* PROFILE */}
        <div className="navbar-profile">

          <div className="navbar-avatar">
            A
          </div>

          <div className="navbar-user">

            <strong>
              Administrator
            </strong>

            <small>
              Admin
            </small>

          </div>

          <ChevronDown size={16} />

        </div>

      </div>

    </header>
  );
}

export default Navbar;