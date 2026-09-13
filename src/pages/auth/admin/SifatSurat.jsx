import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";

function SifatSurat() {
  return (
    <MasterCrudPage
      title="Sifat Surat"
      subtitle="Kelola sifat surat pada sistem SIMAS"
      endpoint="/sifat-surat"
      columns={[{ key: "nama", label: "Nama" }]}
      fields={[
        {
          name: "nama",
          label: "Nama",
          placeholder: "Contoh: Penting",
        },
      ]}
      hasStatus={false}
      emptyMessage="Belum ada data sifat surat."
      rowMapper={(item) => ({
        id: item.id,
        nama: item.nama_sifat || "-",
      })}
      editMapper={(item) => ({ nama: item.nama_sifat || "" })}
      payloadMapper={(form) => ({ nama_sifat: form.nama.trim() })}
    />
  );
}

export default SifatSurat;