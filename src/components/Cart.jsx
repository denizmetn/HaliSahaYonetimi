import { Button, Form, Input, Layout, Modal, Row, Space, Table } from "antd";
import { createStyles } from "antd-style";
import { DeleteOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";

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

const Cart = () => {
  const { styles } = useStyle();
  const { cart, deleteCart, paymentSuccess } = useContext(CartContext);

  const [total, setTotal] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const calculatedTotal = cart.reduce((sum, field) => {
      const price =
        field.type === "saatlik" ? field.hourlyPrice : field.dailyPrice;
      return sum + price;
    }, 0);
    setTotal(calculatedTotal);
  }, [cart]);

  const showModal = () => {
    if (total > 0) {
      setOpenModal(true);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handlePayment = () => {
    form.validateFields().then(() => {
      paymentSuccess();
      setTotal(0);
      closeModal();
    });
  };

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
      render: (text, field) => (field.type === "saatlik" ? text : "-"),
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
      render: (_, field) => (
        <Button icon={<DeleteOutlined />} onClick={() => deleteCart(field.key)}>
          Kaldır
        </Button>
      ),
      width: 100,
    },
  ];

  const dataSource = cart.map((field) => ({
    key: field.key,
    name: field.name,
    type: field.type,
    date: field.date,
    hour: field.hour,
    price: field.type === "saatlik" ? field.hourlyPrice : field.dailyPrice,
  }));

  return (
    <Layout>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: 55 * 5 }}
      />
      <div>Toplam Tutar:{total} TL</div>
      <Row>
        <Button onClick={showModal}>Ödeme Yap</Button>
      </Row>

      <Modal
        title="Ödeme Yap"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModal}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            İptal
          </Button>,
          <Button key="submit" type="primary" onClick={handlePayment}>
            Ödeme Yap
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Kart Numarası"
            name="cardNumber"
            rules={[
              { required: true, message: "Kart numarası gerekli" },
              {
                pattern: /^\d{16}$/,
                message: "Kart numarası 16 haneli olmalı",
              },
            ]}
          >
            <Input
              placeholder="1111 2222 3333 4444"
              maxLength={16}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
            />
          </Form.Item>

          <Space size="middle">
            <Form.Item
              label="Son Kullanma Tarihi (AA / YY)"
              name="expirationDate"
              rules={[{ required: true, message: "Tarih gerekli" }]}
            >
              <Input
                placeholder="MM/YY"
                maxLength={5}
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, "");

                  if (value.length === 1 && parseInt(value, 10) > 1) {
                    e.target.value = "0" + value + "/";
                  } else if (value.length === 2) {
                    const month = parseInt(value, 10);
                    if (month > 12 || month < 1) {
                      e.target.value = "";
                    } else {
                      e.target.value = value + "/";
                    }
                  } else if (value.length === 3 && !value.includes("/")) {
                    e.target.value = value.slice(0, 2) + "/" + value.slice(2);
                  } else if (value.length === 4) {
                    const year = parseInt(value.slice(2), 10);
                    if (year === 24) {
                      e.target.value = value.slice(0, 2) + "/";
                    } else if (year >= 25) {
                      e.target.value = value.slice(0, 2) + "/" + value.slice(2);
                    }
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="CVV"
              name="cvv"
              rules={[
                { required: true, message: "CVV gerekli" },
                {
                  pattern: /^\d{3}$/,
                  message: "CVV 3 haneli olmalı",
                },
              ]}
            >
              <Input
                placeholder="123"
                maxLength={3}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </Form.Item>
          </Space>

          <Form.Item
            label="Kart Sahibinin Adı Soyadı"
            name="name"
            rules={[
              { required: true, message: "İsim gerekli" },
              {
                pattern: /^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/,
                message: "Lütfen Geçerli bir isim giriniz.",
              },
            ]}
          >
            <Input placeholder="Ad Soyad" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
export default Cart;
/*RETURN İÇİ
TABLE,tablo için
ROW,ödeme yap butonu
MODAL,ödeme bilgileri modalı açıyor kart numrası ayyıl cvv sahip adı harf rakam kontrolü de var*/
