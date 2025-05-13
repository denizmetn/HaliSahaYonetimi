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
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FieldBooking from "./FieldBooking";
import Cart from "./Cart";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("1"); //menü seçmek için
  const [openModal, setOpenModal] = useState(false);
  const [telephone, setTelephone] = useState();
  const [age, setAge] = useState();
  const [address, setAddress] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rowId, setRowId] = useState(null);

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("userEmail");
    if (emailFromStorage) {
      fetchGetUser(emailFromStorage);
    }
  }, []);

  const fetchGetUser = (userEmail) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch(
      "https://v1.nocodeapi.com/denizmeti/google_sheets/gZQBKHhsTHOJCSfx?tabId=users",
      {
        method: "get",
        headers: myHeaders,
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        const userList = result.data || result; // bazı response'larda 'data' altında olur
        const currentUser = userList.find((user) => user.EMAIL === userEmail);
        if (currentUser) {
          setUsername(currentUser.NAME || "");
          setEmail(currentUser.EMAIL || "");
          setTelephone(currentUser.TELEPHONE || "");
          setAge(currentUser.AGE || "");
          setAddress(currentUser.ADDRESS || "");
          setRowId(currentUser.row_id || currentUser.id); // NocodeAPI'den dönen row id
        }
      })
      .catch((error) => console.log("Kullanıcı verisi alınamadı:", error));
  };

  const handleSave = () => {
    if (!rowId) {
      console.error("Row ID eksik!");
      return;
    }

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
      "https://v1.nocodeapi.com/denizmeti/google_sheets/gZQBKHhsTHOJCSfx?tabId=users",
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
        fetchGetUser(); // Kullanıcı verilerini tekrar al
        setOpenModal(false); // Modal'ı kapat
      })
      .catch((error) => {
        console.error("Hata:", error);
        alert("Bir hata oluştu! Güncelleme başarısız.");
      });
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu.key);
  };

  const showModal = () => {
    fetchGetUser();
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const headerTitle = () => {
    switch (selectedMenu) {
      case "1":
        return "Saha Kiralama";
      case "2":
        return "Sepetim";
      default:
        return "Saha   Kiralama";
    }
  };

  useEffect(() => {
    fetchGetUser();
  }, []);

  return (
    <Layout className="fullpage-layout">
      <Sider>
        <div className="logo" />
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
          ]}
        />
      </Sider>

      <Layout>
        <Header className="custom-header">
          <div className="header-left">{headerTitle()}</div>
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
        </Content>
      </Layout>

      <Modal
        className="dashboard-modal"
        open={openModal}
        centered
        onCancel={closeModal}
        onOk={handleSave}
      >
        <Title level={2}>Profil</Title>
        <Space direction="vertical" className="profile-info">
          <div className="profile-info-item">
            <Title level={4}>Kullanıcı Adı</Title>
            <span>{username}</span>
          </div>

          <div className="profile-info-item">
            <Title level={5}>E-Mail</Title>
            <Input value={email} disabled />
          </div>

          <Form layout="vertical" className="profile-form">
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
