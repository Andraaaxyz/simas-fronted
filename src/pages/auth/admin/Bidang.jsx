import MasterCrudPage from "./MasterCrudPage";
import "./MasterData.css";
import { MASTER_KEYS } from "../../../services/masterData";

function Bidang() {
  return (
    <MasterCrudPage
      title="Bidang"
      subtitle="Kelola bidang pada sistem SIMAS"
      storageKey={MASTER_KEYS.bidang}
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
    />
  );
}

export default Bidang;
