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
import { useState } from "react";
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

  const fetchGetUser = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "get",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://v1.nocodeapi.com/deniz/google_sheets/tsOvycfipOPUpgBx?tabId=users",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result && result.length > 0) {
          const user = result[0];
          setUsername(user.name);
          setEmail(user.email);
        }
      })

      .catch((error) => console.log("error", error));
  };

  const handleSave = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "put",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify({
        row_id: 3,
        name: username,
        email: email,
        phone: telephone,
        age: age,
        address: address,
      }),
    };

    fetch(
      "https://v1.nocodeapi.com/deniz/google_sheets/tsOvycfipOPUpgBx?tabId=users",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log("Updated user:", result))
      .catch((error) => console.log("error", error));
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

  //header kısmında hangi başlık yazacağını
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
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModal}
        centered
        onCancel={closeModal}
      >
        <Title level={2}>Profil</Title>
        <Space direction="vertical" className="profile-info">
          <div className="profile-info-item">
            <Title level={4}>Kullanıcı Adı</Title>
            <span>{username}</span>
          </div>

          <div className="profile-info-item">
            <Title level={4}>E-Mail</Title>
            <span>{email}</span>
          </div>

          <Form
            onFinish={handleSave}
            layout="vertical"
            className="profile-form"
          >
            <Form.Item label="Kullanıcı Adı">
              <Input
                style={{ width: "300px" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="E-Mail">
              <Input
                style={{ width: "300px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Kullanıcı Adı">
              <Input
                style={{ width: "300px" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="E-Mail">
              <Input
                style={{ width: "300px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Telefon Numarası">
              <Input
                style={{ width: "300px" }}
                placeholder="Telefon numarası giriniz..."
                onChange={(e) => setTelephone(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Yaş">
              <InputNumber
                style={{ width: "300px" }}
                min={1}
                placeholder="Yaşınızı giriniz..."
                onChange={(value) => setAge(value)}
              />
            </Form.Item>

            <Form.Item label="Adres">
              <TextArea
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
