import "./Dashboard.css";
import {
  Button,
  Form,
  InputNumber,
  Modal,
  Space,
  Layout,
  Menu,
  Input,
} from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FieldBooking from "./FieldBooking";
import Cart from "./Cart";
import Booked from "./Booked";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [openModal, setOpenModal] = useState(false);
  const [telephone, setTelephone] = useState();
  const [age, setAge] = useState();
  const [address, setAddress] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rowId, setRowId] = useState(null);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchGetUser();
  }, []);

  const fetchGetUser = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch(
      "https://v1.nocodeapi.com/denimetin/google_sheets/HhYRNREqIXfLtdZV?tabId=users",
      {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        const userList = result.data || result;
        const currentUser = userList.find((user) => user.EMAIL === userEmail);
        if (currentUser) {
          setUsername(currentUser.NAME || "");
          setEmail(currentUser.EMAIL || "");
          setTelephone(currentUser.TELEPHONE || "");
          setAge(currentUser.AGE || "");
          setAddress(currentUser.ADDRESS || "");
          setRowId(currentUser.row_id || currentUser.id);
        }
      })
      .catch((error) => console.log("Kullanıcı verisi alınamadı:", error));
  };

  const handleSave = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const updatedData = {
      row_id: rowId,
      TELEPHONE: telephone,
      AGE: age,
      ADDRESS: address,
    };

    var requestOptions = {
      method: "put",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(updatedData),
    };

    fetch(
      "https://v1.nocodeapi.com/denimetin/google_sheets/HhYRNREqIXfLtdZV?tabId=users",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          console.error("API Hatası:", response.status, response.statusText);
          throw new Error("Güncelleme başarısız oldu!");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Güncellenmiş kullanıcı:", result);
        fetchGetUser();
        setOpenModal(false);
      })
      .catch((error) => {
        console.error("Hata:", error);
        alert("Bir hata oluştu! Güncelleme başarısız.");
      });
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu.key);
  };

  const headerTitle = () => {
    switch (selectedMenu) {
      case "1":
        return "Saha Kiralama";
      case "2":
        return "Sepetim";
      case "3":
        return "Kiralananlar";
      default:
        return "Saha   Kiralama";
    }
  };

  const showModal = () => {
    fetchGetUser();
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider>
        <div
          style={{
            margin: "16px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          DENİZ HALISAHA
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedMenu]}
          onClick={handleMenuSelect}
          items={[
            {
              key: "1",
              icon: <ShoppingCartOutlined />,
              label: "Saha Kiralama ",
            },
            {
              key: "2",
              icon: <DollarOutlined />,
              label: "Sepetim",
            },
            {
              key: "3",
              icon: <TableOutlined />,
              label: "Kiralananlar",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "white",
            height: "64px",
            padding: "48px 24px",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "36px" }}>
            {headerTitle()}
          </div>
          <div className="header-right">
            <Button icon={<UserOutlined />} type="text" onClick={showModal}>
              Kullanıcı
            </Button>
            <Link to="/">
              <Button icon={<LogoutOutlined />} danger type="primary">
                Çıkış
              </Button>
            </Link>
          </div>
        </Header>

        <Content className="custom-content">
          {selectedMenu === "1" && <FieldBooking />}
          {selectedMenu === "2" && <Cart />}
          {selectedMenu === "3" && <Booked />}
        </Content>
      </Layout>

      <Modal open={openModal} centered onCancel={closeModal} onOk={handleSave}>
        <Title level={3}>Profil</Title>
        <Space direction="vertical">
          <Form layout="vertical">
            <Form.Item label="Kullanıcı Adı">
              <div>{username} </div>
            </Form.Item>

            <Form.Item label="E-Mail">
              <div>{email} </div>
            </Form.Item>

            <Form.Item label="Telefon Numarası">
              <Input
                value={telephone}
                style={{ width: "300px" }}
                placeholder="Telefon numarası giriniz..."
                onChange={(e) => setTelephone(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Yaş">
              <InputNumber
                value={age}
                style={{ width: "300px" }}
                min={1}
                placeholder="Yaşınızı giriniz..."
                onChange={(value) => setAge(value)}
              />
            </Form.Item>

            <Form.Item label="Adres">
              <TextArea
                value={address}
                style={{ width: "300px" }}
                placeholder="Adres giriniz..."
                rows={3}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
