export const getDisposisi = () => {
  const data = localStorage.getItem("disposisi");

  return data ? JSON.parse(data) : [];
};


export const tambahDisposisi = (dataBaru) => {
  const dataLama = getDisposisi();

  const data = [
    ...dataLama,
    {
      id: Date.now(),
      ...dataBaru,
      status: "Menunggu",
    },
  ];

  localStorage.setItem(
    "disposisi",
    JSON.stringify(data)
  );

  return data;
};


export const updateStatusDisposisi = (
  id,
  status
) => {
  const data = getDisposisi();

  const dataUpdate = data.map((item) =>
    item.id === id
      ? {
          ...item,
          status: status,
        }
      : item
  );

  localStorage.setItem(
    "disposisi",
    JSON.stringify(dataUpdate)
  );

  return dataUpdate;
};