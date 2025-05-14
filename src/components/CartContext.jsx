import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

//saatler ve her biri için boş yazması
const hours = [17, 18, 19, 20, 21, 22, 23];

const getHourlyAvailability = () => {
  return hours.reduce((acc, hour) => {
    acc[hour] = "boş";
    return acc;
  }, {});
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); //sepetteki sahaları tutuyor

  //saha bilgileri
  const [fields, setFields] = useState([
    {
      id: 1,
      name: "Allianz Arena",
      type: "saatlik",
      imageUrl: "./h.jpg",
      hourlyPrice: 150,
      availability: {
        "2025.05.16": getHourlyAvailability(),
        "2025.05.17": getHourlyAvailability(),
        "2025.05.18": getHourlyAvailability(),
        "2025.05.19": getHourlyAvailability(),
        "2025.05.20": getHourlyAvailability(),
        "2025.05.21": getHourlyAvailability(),
        "2025.05.22": getHourlyAvailability(),
        "2025.05.23": getHourlyAvailability(),
        "2025.05.24": getHourlyAvailability(),
        "2025.05.25": getHourlyAvailability(),
        "2025.05.26": getHourlyAvailability(),
        "2025.05.27": getHourlyAvailability(),
        "2025.05.28": getHourlyAvailability(),
        "2025.05.29": getHourlyAvailability(),
        "2025.05.30": getHourlyAvailability(),
        "2025.05.31": getHourlyAvailability(),
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
    {
      id: 3,
      name: "Iduna Park",
      type: "saatlik",
      imageUrl: "./h2.png",
      hourlyPrice: 320,
      availability: {
        "2025.05.16": getHourlyAvailability(),
        "2025.05.17": getHourlyAvailability(),
        "2025.05.18": getHourlyAvailability(),
        "2025.05.19": getHourlyAvailability(),
        "2025.05.20": getHourlyAvailability(),
        "2025.05.21": getHourlyAvailability(),
        "2025.05.22": getHourlyAvailability(),
        "2025.05.23": getHourlyAvailability(),
        "2025.05.24": getHourlyAvailability(),
        "2025.05.25": getHourlyAvailability(),
        "2025.05.26": getHourlyAvailability(),
        "2025.05.27": getHourlyAvailability(),
        "2025.05.28": getHourlyAvailability(),
        "2025.05.29": getHourlyAvailability(),
        "2025.05.30": getHourlyAvailability(),
        "2025.05.31": getHourlyAvailability(),
      },
    },
  ]);

  //Sheets'ten verileri çekiyorum
  const fetchAvailability = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "get",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://v1.nocodeapi.com/denimetin/google_sheets/HhYRNREqIXfLtdZV?tabId=halısaha",
        requestOptions
      );
      const result = await response.json();

      console.log(result);

      if (result && Array.isArray(result.data)) {
        const updatedFields = fields.map((field) => {
          const bookedItems = result.data.filter(
            (item) => item.HALISAHAADI === field.name
          );
          console.log(bookedItems);

          //başkası o günü aldıysa dolu görüncek ve rezervasyon yapılmayacak
          bookedItems.forEach((item) => {
            const { TARIH, SAAT } = item;
            if (field.type === "saatlik" && field.availability[TARIH]) {
              const hour = SAAT.split(":")[0];
              if (field.availability[TARIH][hour] === "boş") {
                field.availability[TARIH][hour] = "dolu";
              }
            } else if (field.type === "günlük" && field.availability[TARIH]) {
              field.availability[TARIH] = "dolu";
            }
          });

          return field;
        });

        setFields(updatedFields);
      } else {
        console.error("Beklenen veri dizisi alınamadı.", result);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  //sayfa ilk açıldığında fetchAvailability çalışıyor.
  useEffect(() => {
    fetchAvailability();
  }, []);

  //saha seçtiğinde sepete ekleme
  const addCart = (selectedField, selectedHours, selectedDate) => {
    const newItem =
      selectedField.type === "saatlik"
        ? selectedHours.map((hour) => ({
            ...selectedField,
            key: `${selectedField.id}-${selectedDate}-${hour}`,
            hour: `${hour}:00 - ${hour + 1}:00`,
            date: selectedDate,
          }))
        : [
            {
              ...selectedField,
              key: `${selectedField.id}-${selectedDate}`,
              hour: null,
            },
          ];
    console.log(newItem);
    setCart([...cart, ...newItem]);
  };

  const deleteCart = (key) => {
    setCart(cart.filter((field) => field.key !== key));
  };

  const paymentSuccess = () => {
    //const userMaile kadar olan kısım nocodeaçılınca kapatılacak çünkü bu frontend de olanı
    //ama zaten backend içinde aynısı yazıldı yukarının içine
    /*const updatedFields = fields.map((field) => {
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
    setCart([]);
    alert(
      "Ödeme başarılı! Gerekli bilgiler e-posta adresinize gönderildi. İyi eğlenceler dileriz!!"
    );*/

    const userEmail =
      localStorage.getItem("userEmail") || "Bilinmeyen Kullanıcı";

    //her satır sheetse eklenecek
    const rows = cart.map((item) => [
      userEmail,
      item.type,
      item.name,
      item.date,
      item.type === "saatlik" ? item.hour : "-",
      item.type === "saatlik" ? item.hourlyPrice : item.dailyPrice,
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
      "https://v1.nocodeapi.com/denimetin/google_sheets/HhYRNREqIXfLtdZV?tabId=halısaha",
      requestOptions
    )
      .then((response) => response.json())
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
