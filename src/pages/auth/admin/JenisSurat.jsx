import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";

function JenisSurat() {
  return (
    <MasterCrudPage
      title="Jenis Surat"
      subtitle="Kelola jenis surat pada sistem SIMAS"
      endpoint="/jenis-surat"
      columns={[{ key: "nama", label: "Nama" }]}
      fields={[
        {
          name: "nama",
          label: "Nama",
          placeholder: "Contoh: Surat Edaran",
        },
      ]}
      hasStatus={false}
      emptyMessage="Belum ada data jenis surat."
      rowMapper={(item) => ({
        id: item.id,
        nama: item.nama_jenis || "-",
      })}
      editMapper={(item) => ({ nama: item.nama_jenis || "" })}
      payloadMapper={(form) => ({ nama_jenis: form.nama.trim() })}
    />
  );
}

export default JenisSurat;