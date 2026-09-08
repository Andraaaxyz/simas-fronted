import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { DisposisiProvider } from "./context/DisposisiContext";

import Login from "./pages/auth/Login";

// =========================
// ADMIN
// =========================
import AdminDashboard from "./pages/auth/admin/Dashboard";
import SuratMasuk from "./pages/auth/admin/SuratMasuk";
import Arsip from "./pages/auth/admin/Arsip";
import AdminProfil from "./pages/auth/admin/Profil";
import Laporan from "./pages/auth/admin/Laporan";
import AdminDisposisi from "./pages/auth/admin/Disposisi";
import MasterPimpinan from "./pages/auth/admin/Pimpinan";
import MasterUser from "./pages/auth/admin/User";
import MasterJenisSurat from "./pages/auth/admin/JenisSurat";
import MasterSifatSurat from "./pages/auth/admin/SifatSurat";
import MasterBidang from "./pages/auth/admin/Bidang";

// =========================
// PIMPINAN
// =========================
import PimpinanDashboard from "./pages/auth/pimpinan/Dashboard";
import PimpinanSuratMasuk from "./pages/auth/pimpinan/SuratMasuk";
import PimpinanArsip from "./pages/auth/pimpinan/ArsipDigital";
import PimpinanProfil from "./pages/auth/pimpinan/Profil";
import PimpinanLaporan from "./pages/auth/pimpinan/Laporan";

// =========================
// PENGGUNA
// =========================
import PenggunaDashboard from "./pages/auth/pengguna/Dashboard";
import PenggunaSuratMasuk from "./pages/auth/pengguna/SuratMasuk";
import PenggunaDisposisi from "./pages/auth/pengguna/Disposisi";
import PenggunaProfil from "./pages/auth/pengguna/Profil";
import PenggunaArsip from "./pages/auth/pengguna/ArsipDigital";

function App() {
  return (
    <DisposisiProvider>
      <BrowserRouter>

        <Routes>

          {/* =========================
              HALAMAN AWAL
          ========================= */}
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* =========================
              LOGIN
          ========================= */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* =========================
              ADMIN
          ========================= */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/surat-masuk"
            element={<SuratMasuk />}
          />

          <Route
            path="/admin/arsip"
            element={<Arsip />}
          />

          <Route
            path="/admin/profil"
            element={<AdminProfil />}
          />

          <Route
            path="/admin/laporan"
            element={<Laporan />}
          />

          <Route
            path="/admin/disposisi"
            element={<AdminDisposisi />}
          />

          {/* =========================
              MASTER DATA (ADMIN)
          ========================= */}

          <Route
            path="/admin/master/pimpinan"
            element={<MasterPimpinan />}
          />

          <Route
            path="/admin/master/user"
            element={<MasterUser />}
          />

          <Route
            path="/admin/master/jenis-surat"
            element={<MasterJenisSurat />}
          />

          <Route
            path="/admin/master/sifat-surat"
            element={<MasterSifatSurat />}
          />

          <Route
            path="/admin/master/bidang"
            element={<MasterBidang />}
          />

          {/* =========================
              PIMPINAN
          ========================= */}

          <Route
            path="/pimpinan/dashboard"
            element={<PimpinanDashboard />}
          />

          <Route
            path="/pimpinan/surat-masuk"
            element={<PimpinanSuratMasuk />}
          />

          <Route
            path="/pimpinan/arsip"
            element={<PimpinanArsip />}
          />

          <Route
            path="/pimpinan/profil"
            element={<PimpinanProfil />}
          />

          <Route
            path="/pimpinan/laporan"
            element={<PimpinanLaporan />}
          />

          {/* =========================
              PENGGUNA
          ========================= */}

          <Route
            path="/pengguna/dashboard"
            element={<PenggunaDashboard />}
          />

          <Route
            path="/pengguna/surat-masuk"
            element={<PenggunaSuratMasuk />}
          />

          <Route
            path="/pengguna/disposisi"
            element={<PenggunaDisposisi />}
          />

          <Route
            path="/pengguna/profil"
            element={<PenggunaProfil />}
          />

          <Route
            path="/pengguna/arsip"
            element={<PenggunaArsip />}
          />

        </Routes>

      </BrowserRouter>
    </DisposisiProvider>
  );
}

export default App;