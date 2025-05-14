import { Button, Popconfirm, Layout, Table } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});
const Booked = () => {
  const columns = [
    {
      title: "Saha Adı",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Türü",
      dataIndex: "type",
      width: 150,
    },
    {
      title: "Tarih",
      dataIndex: "date",
      width: 200,
    },
    {
      title: "Saat",
      dataIndex: "hour",
      render: (text) => text || "-",
      width: 200,
    },
    {
      title: "Ücret",
      dataIndex: "price",
      render: (price, field) => {
        return field.type === "saatlik"
          ? `₺${price} / saat`
          : `₺${price} / gün`;
      },
      width: 200,
    },

    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          placement="topLeft"
          title="İptal istediğinizden emin misiniz?"
          description="Ücretinizin %80'i geri verilecektir!!"
          okText="Evet"
          cancelText="Hayır"
          onConfirm={() => handleDelete(record.key)}
        >
          <Button danger icon={<DeleteOutlined />}>
            İptal et
          </Button>
        </Popconfirm>
      ),
      width: 100,
    },
  ];
  const { styles } = useStyle();
  const [dataSource, setDataSource] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  const fetchBooked = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      const response = await fetch(
        "https://v1.nocodeapi.com/denizmetinn/google_sheets/rMlcnoJwYTsvgPny?tabId=halısaha",
        { method: "GET", headers: myHeaders, redirect: "follow" }
      );
      const result = await response.json();
      const booksList = result.data || result;

      const userBookings = booksList.filter((user) => user.EMAIL === userEmail);
      if (userBookings.length > 0) {
        const formattedData = userBookings.map((item) => ({
          key: item.row_id || item.id,
          name: item.HALISAHAADI,
          type: item.HALISAHATURU,
          date: item.TARIH,
          hour: item.SAAT,
          price: item.UCRET,
        }));
        setDataSource(formattedData);
      }
    } catch (error) {
      console.log("Kullanıcı verisi alınamadı:", error);
    }
  };
  useEffect(() => {
    fetchBooked();
  }, []);

  const handleDelete = async (key) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "delete",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://v1.nocodeapi.com/denizmetinn/google_sheets/rMlcnoJwYTsvgPny?tabId=halısaha&row_id=${key}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        alert("Kiralama iptal edildi. Ücretiniz hesabınıza geri gönderildi!");
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <Layout>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: 55 * 5 }}
        rowKey="key"
      />
    </Layout>
  );
};
export default Booked;
