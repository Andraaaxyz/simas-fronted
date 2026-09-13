import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";

const ROLE_PIMPINAN = 2;

function Pimpinan() {
  return (
    <MasterCrudPage
      title="Pimpinan"
      subtitle="Kelola data pimpinan pada sistem SIMAS"
      endpoint="/users"
      params={{ per_page: 50, role: "Pimpinan" }}
      columns={[
        { key: "nama", label: "Nama" },
        { key: "nip", label: "NIP" },
        { key: "bidang", label: "Bidang" },
        { key: "email", label: "Email" },
        { key: "username", label: "Username" },
        { key: "password", label: "Password", mask: true },
      ]}
      fields={[
        { name: "nama", label: "Nama", placeholder: "Masukkan nama lengkap" },
        { name: "nip", label: "NIP", placeholder: "Masukkan NIP" },
        { name: "bidangId", label: "Bidang", type: "select", fromEndpoint: "/bidangs", labelField: "nama_bidang" },
        { name: "email", label: "Email", placeholder: "Masukkan email" },
        { name: "username", label: "Username", placeholder: "Masukkan username" },
        { name: "password", label: "Password", type: "password", placeholder: "Minimal 8 karakter" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["aktif", "nonaktif"],
        },
      ]}
      emptyMessage="Belum ada data pimpinan."
      filters={[
        {
          key: "status",
          label: "Status",
          options: ["aktif", "nonaktif"],
        },
      ]}
      rowMapper={(item) => ({
        id: item.id,
        nama: item.nama || "-",
        nip: item.nip || "-",
        bidang: item.bidang?.nama_bidang || "-",
        email: item.email || "-",
        username: item.username || "-",
        status: item.status,
      })}
      editMapper={(item) => ({
        nama: item.nama || "",
        nip: item.nip || "",
        bidangId: item.bidang_id || "",
        email: item.email || "",
        username: item.username || "",
        password: "",
        status: item.status || "aktif",
      })}
      payloadMapper={(form) => {
        const payload = {
          role_id: ROLE_PIMPINAN,
          nama: form.nama.trim(),
          nip: form.nip.trim(),
          email: form.email.trim(),
          username: form.username.trim(),
          status: form.status,
        };

        if (form.bidangId) payload.bidang_id = form.bidangId;

        if (form.password) {
          payload.password = form.password;
          payload.password_confirmation = form.password;
        }

        return payload;
      }}
    />
  );
}

export default Pimpinan;