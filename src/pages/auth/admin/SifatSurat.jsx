import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";
import { MASTER_KEYS } from "../../../services/masterData";

function SifatSurat() {
  return (
    <MasterCrudPage
      title="Sifat Surat"
      subtitle="Kelola sifat surat pada sistem SIMAS"
      storageKey={MASTER_KEYS.sifatSurat}
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
    />
  );
}

export default SifatSurat;
