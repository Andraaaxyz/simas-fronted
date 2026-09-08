import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";
import { MASTER_KEYS } from "../../../services/masterData";

function Pimpinan() {
  return (
    <MasterCrudPage
      title="Pimpinan"
      subtitle="Kelola data pimpinan pada sistem SIMAS"
      storageKey={MASTER_KEYS.pimpinan}
      columns={[
        { key: "nama", label: "Nama" },
        { key: "nip", label: "NIP" },
        { key: "email", label: "Email" },
        { key: "username", label: "Username" },
        { key: "password", label: "Password", mask: true },
      ]}
      fields={[
        { name: "nama", label: "Nama", placeholder: "Masukkan nama lengkap" },
        { name: "nip", label: "NIP", placeholder: "Masukkan NIP" },
        { name: "email", label: "Email", placeholder: "Masukkan email" },
        { name: "username", label: "Username", placeholder: "Masukkan username" },
        { name: "password", label: "Password", type: "password", placeholder: "Masukkan password" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Aktif", "Nonaktif"],
        },
      ]}
      emptyMessage="Belum ada data pimpinan."
    />
  );
}

export default Pimpinan;
