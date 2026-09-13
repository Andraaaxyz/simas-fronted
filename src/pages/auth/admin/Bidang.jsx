import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";

function Bidang() {
  return (
    <MasterCrudPage
      title="Bidang"
      subtitle="Kelola bidang pada sistem SIMAS"
      endpoint="/bidangs"
      columns={[{ key: "nama", label: "Nama" }]}
      fields={[
        {
          name: "nama",
          label: "Nama",
          placeholder: "Contoh: Tata Usaha",
        },
      ]}
      hasStatus={false}
      emptyMessage="Belum ada data bidang."
      rowMapper={(item) => ({
        id: item.id,
        nama: item.nama_bidang || "-",
      })}
      editMapper={(item) => ({ nama: item.nama_bidang || "" })}
      payloadMapper={(form) => ({ nama_bidang: form.nama.trim() })}
    />
  );
}

export default Bidang;