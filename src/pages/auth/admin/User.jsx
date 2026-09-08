import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";
import { MASTER_KEYS } from "../../../services/masterData";

function User() {
  return (
    <MasterCrudPage
      title="User"
      subtitle="Kelola akun user pada sistem SIMAS"
      storageKey={MASTER_KEYS.user}
      columns={[
        { key: "nama", label: "Nama" },
        { key: "nip", label: "NIP" },
        { key: "bidang", label: "Bidang" },
        { key: "email", label: "Email" },
        { key: "password", label: "Password", mask: true },
      ]}
      fields={[
        { name: "nama", label: "Nama", placeholder: "Masukkan nama lengkap" },
        { name: "nip", label: "NIP", placeholder: "Masukkan NIP" },
        { name: "bidang", label: "Bidang", placeholder: "Masukkan bidang" },
        { name: "email", label: "Email", placeholder: "Masukkan email" },
        { name: "password", label: "Password", type: "password", placeholder: "Masukkan password" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Aktif", "Nonaktif"],
        },
      ]}
      emptyMessage="Belum ada data user."
      filters={[
        {
          key: "status",
          label: "Status",
          options: ["Aktif", "Nonaktif"],
        },
        {
          key: "bidang",
          label: "Bidang",
        },
      ]}
    />
  );
}

export default User;
