import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard(){

  return(
    <DashboardLayout title="Dashboard Admin">

      <div className="stats-grid">

        <div className="card">
          <h3>Surat Masuk</h3>
          <h1>1.248</h1>
          <p>+12 surat hari ini</p>
        </div>

        <div className="card">
          <h3>Disposisi</h3>
          <h1>24</h1>
          <p>Menunggu persetujuan</p>
        </div>

        <div className="card">
          <h3>Arsip Digital</h3>
          <h1>3.482</h1>
          <p>Dokumen tersimpan</p>
        </div>

      </div>

      <div className="table-card">
        <h3>Surat Masuk Terbaru</h3>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nomor Surat</th>
              <th>Perihal</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>001/SM/VIII/2026</td>
              <td>Undangan Rapat</td>
              <td>Selesai</td>
            </tr>

            <tr>
              <td>2</td>
              <td>002/SM/VIII/2026</td>
              <td>Surat Edaran</td>
              <td>Diproses</td>
            </tr>

          </tbody>
        </table>

      </div>

    </DashboardLayout>
  )

}

export default Dashboard;