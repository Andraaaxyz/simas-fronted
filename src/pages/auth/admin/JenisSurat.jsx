import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";
import { MASTER_KEYS } from "../../../services/masterData";

function JenisSurat() {
  return (
    <MasterCrudPage
      title="Jenis Surat"
      subtitle="Kelola jenis surat pada sistem SIMAS"
      storageKey={MASTER_KEYS.jenisSurat}
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
    />
  );
}

export default JenisSurat;
