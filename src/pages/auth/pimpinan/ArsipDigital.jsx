import DashboardLayout from "../../../layouts/DashboardLayout";
import { FileText, Eye, Download } from "lucide-react";

function Arsip() {
  const data = [
    {
      id: 1,
      noSurat: "001/089/SK/2023",
      isi: "Edaran Libur/WFH",
      tanggal: "02 April 2026",
    },
    {
      id: 2,
      noSurat: "002/089/SK/2023",
      isi: "Undangan Rapat",
      tanggal: "16 Juni 2026",
    },
  ];

  return (
    <DashboardLayout title="Arsip Digital">

      <div className="table-card">

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>No. Surat</th>
              <th>Isi / Hal</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((arsip) => (
              <tr key={arsip.id}>
                <td>{arsip.id}</td>
                <td>
                  <strong>{arsip.noSurat}</strong>
                </td>
                <td>{arsip.isi}</td>
                <td>{arsip.tanggal}</td>

                <td>
                  <div className="aksi">

                    <button title="Lihat">
                      <Eye size={16} />
                    </button>

                    <button title="Buka PDF">
                      <FileText size={16} />
                    </button>

                    <button title="Download">
                      <Download size={16} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </DashboardLayout>
  );
}

export default Arsip;