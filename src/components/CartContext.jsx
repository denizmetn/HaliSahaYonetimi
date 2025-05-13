import React, { createContext, useState } from "react";

export const CartContext = createContext();

const hours = [17, 18, 19, 20, 21, 22, 23];

const genHourlyAvailability = () => {
  return hours.reduce((acc, hour) => {
    acc[hour] = "boş";
    return acc;
  }, {});
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); //sepet işlemleri için var
  const [fields, setFields] = useState([
    {
      id: 1,
      name: "Allianz Arena",
      type: "saatlik",
      imageUrl: "./h.jpg",
      hourlyPrice: 150,
      availability: {
        "2025.05.16": genHourlyAvailability(),
        "2025.05.17": genHourlyAvailability(),
        "2025.05.18": genHourlyAvailability(),
        "2025.05.19": genHourlyAvailability(),
        "2025.05.20": genHourlyAvailability(),
        "2025.05.21": genHourlyAvailability(),
        "2025.05.22": genHourlyAvailability(),
        "2025.05.23": genHourlyAvailability(),
      },
    },
    {
      id: 2,
      name: "Camp Nou",
      type: "günlük",
      imageUrl: "./h1.jpg",
      dailyPrice: 3000,
      availability: {
        "2025.05.16": "boş",
        "2025.05.17": "boş",
        "2025.05.18": "boş",
        "2025.05.19": "boş",
        "2025.05.20": "boş",
        "2025.05.21": "boş",
        "2025.05.22": "boş",
        "2025.05.23": "boş",
        "2025.05.24": "boş",
        "2025.05.25": "boş",
        "2025.05.26": "boş",
        "2025.05.27": "boş",
        "2025.05.28": "boş",
        "2025.05.29": "boş",
        "2025.05.30": "boş",
        "2025.05.31": "boş",
      },
    },
  ]);

  //sepete ekleme
  const addCart = (field) => {
    setCart([...cart, { ...field, key: Date.now() }]);
  };

  //sepetten kaldırma
  const deleteCart = (key) => {
    setCart(cart.filter((field) => field.key !== key));
  };

  //ödeme işlemini gerçekleştirdikten sonra seçmiş olduğun saat veya günleri dolu olarak güncelliyor bir daha seçemiyorsun
  //2025.05.16 uygun gözüküyor sepete ekledin ve ödemesini gerçekleştirdikten sonra dolu gözüküyor
  // ödeme tamamlanınca sepeti boşaltır ve kiralanan saha/saatleri sistemde "dolu" olarak işaretleyerek müsaitlik durumunu günceller
  //  Böylece diğer kullanıcılar aynı anda kiralama yapamaz

  const paymentSuccess = () => {
    const updatedFields = fields.map((field) => {
      const bookedItems = cart.filter((item) => item.id === field.id);

      bookedItems.forEach((item) => {
        if (item.type === "saatlik") {
          if (item.date && item.hour && field.availability[item.date]) {
            field.availability[item.date][item.hour.split(":")[0]] = "dolu";
          }
        } else if (item.type === "günlük") {
          if (item.date && field.availability[item.date]) {
            field.availability[item.date] = "dolu";
          }
        }
      });

      return field;
    });
    setFields(updatedFields);

    const userEmail =
      localStorage.getItem("userEmail") || "Bilinmeyen Kullanıcı";

    const rows = cart.map((item) => [
      userEmail,
      item.type,
      item.name,
      item.date,
      item.type === "saatlik" ? item.hour : "Tüm Gün",
      "dolu",
    ]);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "post",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(rows),
    };

    fetch(
      "https://v1.nocodeapi.com/denizmeti/google_sheets/gZQBKHhsTHOJCSfx?tabId=halısaha",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log("Kayıt başarılı:", result);
        setCart([]);
        alert(
          "Ödeme başarılı! Gerekli bilgiler e-posta adresinize gönderildi. İyi eğlenceler dileriz!!"
        );
      })
      .catch((error) => {
        console.log("Google Sheets'e yazma hatası:", error);
        alert("Ödeme başarılı ancak veri kayıt edilirken bir hata oluştu.");
      });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addCart,
        deleteCart,
        paymentSuccess,
        fields,
        setFields,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
