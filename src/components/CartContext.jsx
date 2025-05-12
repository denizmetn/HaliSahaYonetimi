import React, { createContext, useState } from "react";

export const CartContext = createContext();

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
        "2025.05.16": {
          17: "dolu",
          18: "boş",
          19: "boş",
          20: "dolu",
          21: "boş",
          22: "boş",
          23: "dolu",
        },
        "2025.05.17": {
          17: "boş",
          18: "dolu",
          19: "boş",
          20: "dolu",
          21: "dolu",
          22: "boş",
          23: "boş",
        },
        "2025.05.18": {
          17: "boş",
          18: "boş",
          19: "boş",
          20: "dolu",
          21: "boş",
          22: "dolu",
          23: "boş",
        },
        "2025.05.19": {
          17: "dolu",
          18: "dolu",
          19: "dolu",
          20: "boş",
          21: "boş",
          22: "dolu",
          23: "dolu",
        },
        "2025.05.20": {
          17: "dolu",
          18: "boş",
          19: "dolu",
          20: "boş",
          21: "dolu",
          22: "boş",
          23: "boş",
        },
        "2025.05.21": {
          17: "boş",
          18: "boş",
          19: "boş",
          20: "dolu",
          21: "boş",
          22: "boş",
        },
        "2025.05.22": {
          17: "dolu",
          18: "dolu",
          19: "boş",
          20: "dolu",
          21: "boş",
          22: "boş",
          23: "boş",
        },
        "2025.05.23": {
          17: "boş",
          18: "boş",
          19: "boş",
          20: "dolu",
          21: "boş",
          22: "boş",
          23: "boş",
        },
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
        "2025.05.17": "dolu",
        "2025.05.18": "boş",
        "2025.05.19": "dolu",
        "2025.05.20": "boş",
        "2025.05.21": "boş",
        "2025.05.22": "boş",
        "2025.05.23": "dolu",
        "2025.05.24": "boş",
        "2025.05.25": "boş",
        "2025.05.26": "boş",
        "2025.05.27": "dolu",
        "2025.05.28": "boş",
        "2025.05.29": "dolu",
        "2025.05.30": "boş",
        "2025.05.31": "boş",
      },
    },
  ]); //sahalar

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
          if (field.availability[item.date]) {
            field.availability[item.date][item.hour.split(":")[0]] = "dolu";
          }
        } else if (item.type === "günlük") {
          field.availability[item.date] = "dolu";
        }
      });

      return field;
    });
    setFields(updatedFields);
    setCart([]);
    alert(
      "Ödeme başarılı! Gerekli bilgiler e-posta adresinize gönderildi. İyi eğlenceler dileriz!!"
    );
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
