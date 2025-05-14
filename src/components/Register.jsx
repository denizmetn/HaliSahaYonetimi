import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const row = [values.NAME, values.SURNAME, values.EMAIL, values.PASSWORD];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "post",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify([row]),
    };

    fetch(
      "https://v1.nocodeapi.com/denimetin/google_sheets/HhYRNREqIXfLtdZV?tabId=users",
      requestOptions
    )
      .then((response) => {
        response.json();
        navigate("/login");
      })
      .then(() => alert("Kayıt Başarılı!"))
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="register-container">
      <Form
        className="register-form"
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 className="form-title">KAYIT OL</h2>

        <Form.Item
          label="Adınız"
          name="NAME"
          rules={[{ required: true, message: "Lütfen adınızı giriniz!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Soyadınız"
          name="SURNAME"
          rules={[{ required: true, message: "Lütfen soyadınızı giriniz!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="E-Mail "
          name="EMAIL"
          rules={[{ required: true, message: "Lütfen e-mailinizi giriniz!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Şifre Giriniz"
          name="PASSWORD"
          rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Tekrar Şifre Giriniz"
          name="AGAINPASSWORD"
          rules={[
            { required: true, message: "Lütfen tekrar şifrenizi giriniz!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="register-button">
            Kayıt Ol
          </Button>
        </Form.Item>

        <Form.Item className="register-link">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
