import { Layout, Button, Row, Typography, Card, Col } from "antd";
import "./homepage.css";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function HomePage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };
  return (
    <Layout>
      <Header className="header">
        <div>HALISAHA SİSTEMİ</div>
        <div className="header-buttons">
          <Button className="header-button" onClick={goToLogin}>
            Giriş Yap
          </Button>
          <Button className="header-button" onClick={goToRegister}>
            Kayıt Ol
          </Button>
        </div>
      </Header>

      <Content>
        <div
          justify="center"
          style={{ textAlign: "center", marginBottom: "20px", padding: "40px" }}
        >
          <Title level={3}> İstediğin Halısahayı Şimdi Kirala!</Title>
          <Paragraph style={{ fontSize: "1em", color: "#595959" }}>
            Bünyemizde bulunan en iyi halısahaları istediğin an oturduğun yerden
            kirala ve arkadaşlarınla unutulmaz anlarına bir yenisi daha ekle!
          </Paragraph>
        </div>
        <Row gutter={16}>
          <Col span={8}>
            <Card title=" Üst Seviye Halısahalar " variant="borderless">
              En iyi zemin kalitesi, modern soyunma odaları ve aydınlatma
              sistemleri barındıran halısahalarımızda futbolun keyfini çıkarın!
            </Card>
          </Col>

          <Col span={8}>
            <Card title=" Hızlı ve Kolay Rezervasyon " variant="borderless">
              Kullanımı kolay arayüzümüz sayesinde birkaç tıklamayla istediğiniz
              tarih ve saat aralığına göre kolayca kiralayaın. Zamanınız
              değerli, biz de öyle düşünüyoruz!
            </Card>
          </Col>

          <Col span={8}>
            <Card
              title=" Seçime Göre Fiyat Karşılaştırması "
              variant="borderless"
            >
              Farklı özelliklere ve kiralama seçeneklerine sahip halısahaların
              fiyatlarını karşılaştırın, bütçenize en uygun olanı kolayca bulun!
            </Card>
          </Col>
        </Row>
        <Title level={3} style={{ textAlign: "center" }}>
          Neden Halısaha Sistemi?
        </Title>
        <Row gutter={16} justify="center" style={{ padding: "40px" }}>
          <Col span={8} style={{ textAlign: "center" }}>
            <Card title=" Geniş Seçenek" variant="borderless">
              Her zevke uygun sahalar.
            </Card>
          </Col>

          <Col span={8} style={{ textAlign: "center" }}>
            <Card title="Zamandan Tasarruf" variant="borderless">
              Hızlı rezervasyon.
            </Card>
          </Col>

          <Col span={8} style={{ textAlign: "center" }}>
            <Card title=" Güvenilir Platform" variant="borderless">
              Güvenli kiralama.
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
export default HomePage;
