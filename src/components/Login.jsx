import { Button, Checkbox, Form, Input, Result } from "antd";
import { Link } from "react-router-dom";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { EMAIL, PASSWORD } = values;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "get",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://v1.nocodeapi.com/denimetin/google_sheets/HhYRNREqIXfLtdZV?tabId=users",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const user = result.data.find(
          (item) => item.EMAIL === EMAIL && item.PASSWORD === PASSWORD
        );
        if (user) {
          localStorage.setItem("userEmail", user.EMAIL);
          localStorage.setItem("userName", user.NAME);

          navigate("/dashboard");
          alert("Giriş Başarılı");
          navigate("/dashboard");
        } else {
          alert("E-Mail veya şifre hatalı!");
        }
      })
      .catch((error) => console.log("error", error));
    //nocode açılınca kaldırılacak
  };
  return (
    <div className="login-container">
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 450 }}
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 className="form-title">GİRİŞ YAP</h2>

        <Form.Item
          label="E-Mail"
          name="EMAIL"
          rules={[
            { required: true, message: "Lütfen kullanıcı adınızı giriniz!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Şifre"
          name="PASSWORD"
          rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <div className="checkbox-link">
            <Checkbox name="remember">Beni Hatırla</Checkbox>
            <Link to="/forgot-password" className="forgot-link">
              Şifremi Unuttum
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button ">
            Giriş Yap
          </Button>
        </Form.Item>

        <Form.Item className="register-link">
          Üye değil misiniz? <Link to="/register">Kayıt Ol</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
