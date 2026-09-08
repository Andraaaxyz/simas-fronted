import { createContext, useContext, useState } from "react";

const DisposisiContext = createContext();

export function DisposisiProvider({ children }) {
  const [disposisi, setDisposisi] = useState([
    {
      id: 1,
      noSurat: "001/089/SK/2023",
      asal: "Dinas Pendidikan",
      tanggal: "20 Agustus 2026",
      perihal: "Undangan Rapat",
      instruksi: "Segera ditindaklanjuti",
      penerima: "Pengguna",
      status: "Menunggu",
    },
  ]);

  const tambahDisposisi = (data) => {
    setDisposisi((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...data,
        status: "Menunggu",
      },
    ]);
  };

  const selesaikanDisposisi = (id) => {
    setDisposisi((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "Selesai" }
          : item
      )
    );
  };

  return (
    <DisposisiContext.Provider
      value={{
        disposisi,
        tambahDisposisi,
        selesaikanDisposisi,
      }}
    >
      {children}
    </DisposisiContext.Provider>
  );
}

export function useDisposisi() {
  return useContext(DisposisiContext);
}