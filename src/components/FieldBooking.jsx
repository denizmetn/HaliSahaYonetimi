import { useContext, useState } from "react";
import { Card, Row, Col, Select, Button, Modal, Calendar, Badge } from "antd";
import { CartContext } from "./CartContext";

const FieldBooking = () => {
  const { addCart, fields, setFields } = useContext(CartContext); //contextden gelen bilgiler(verileri sepete eklemek için ve sahaların bilgileri)
  const [filteredFields, setFilteredFields] = useState(fields); //filtrelenmiş sahaların bulunduğu state
  const [fieldTypeFilter, setFieldTypeFilter] = useState(null); //saatlik ve günlük olarak filtrelemek için kullanılıyor
  const [openModal, setOpenModal] = useState(false); //modal için
  const [selectedField, setSelectedField] = useState(null); //seçilen saha
  const [selectedDate, setSelectedDate] = useState(null); //seçilen tarih(günlük saha için)
  const [selectedHour, setSelectedHour] = useState(null); //seçilen saat(saatlik saha için)
  const [hourlyAvailability, setHourlyAvailability] = useState({}); //uygun saatler için kullanılıyor

  //günlük sahayı ve saatlik sahayı filtrelemek için kullanılıyor (olmayadabilir aslında çünkü zaten iki saha
  //var ve belli oluyor hangisi hangisi olduğu ama bence kalabilir)
  const handleFilterChange = (filterField) => {
    setFieldTypeFilter(filterField);
    if (filterField) {
      setFilteredFields(fields.filter((field) => field.type === filterField));
    } else {
      setFilteredFields(fields);
    }
  };

  //modal aç kapa için
  const showModal = (field) => {
    setSelectedField(field);
    setOpenModal(true);
    setHourlyAvailability({});
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  /*bu fonksiyon seçilen tarihe göre saatlik kullanılabilirlik durumunu günceller yani saatlik saha içinde takvimden
  tarih seçip basınca çıkan saatlerin kullanılabilirlik durumunu gösteriyor diyebiliriz*/
  const handleDateSelect = (date) => {
    setSelectedDate(date.format("YYYY.MM.DD"));

    if (selectedField?.type === "saatlik") {
      const fieldAvailability =
        selectedField.availability[date.format("YYYY.MM.DD")] || {};
      const availability = {};
      for (let hour = 17; hour <= 23; hour++) {
        availability[hour] = fieldAvailability[hour] || "boş";
      }
      setHourlyAvailability(availability);
    }
  };

  //seçtiğimiz saati tutuyor
  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };

  /*sepete ekleme eğer seçilen saha saatlik ise newItem olarak sahaadı tipi tarihi saati ve ücretini sepete ekliyor
   eğer günlük ise de sahaadı tipi tarihi ve ücretini sepete ekliyor saat boş*/
  const handleAddCart = () => {
    let newItem = null;
    if (selectedField.type === "saatlik") {
      if (
        !selectedDate ||
        selectedHour === null ||
        hourlyAvailability[selectedHour] !== "boş"
      ) {
        alert("Lütfen tarih ve uygun bir saat seçin.");
        return;
      }
      newItem = {
        id: selectedField.id,
        name: selectedField.name,
        type: selectedField.type,
        date: selectedDate,
        hour: `${selectedHour}:00 - ${selectedHour + 1}:00`,
        hourlyPrice: 150,
      };
    } else if (selectedField.type === "günlük") {
      if (
        !selectedDate ||
        (selectedField.availability &&
          selectedField.availability[selectedDate] === "dolu")
      ) {
        alert("Lütfen uygun bir tarih seçin.");
        return;
      }

      newItem = {
        id: selectedField.id,
        name: selectedField.name,
        type: selectedField.type,
        date: selectedDate,
        hour: null,
        dailyPrice: 3000,
      };
    }

    addCart(newItem);
    alert("Seçiminiz başarıyla sepete eklendi.");
    closeModal();
  };

  //günlük saha için kullanılabilirlik durumlarını takvime ekliyor
  const cellRender = (date) => {
    const status = selectedField.availability[date.format("YYYY.MM.DD")];

    return status ? (
      <Badge
        status={status === "boş" ? "success" : "error"}
        text={status === "boş" ? "Uygun" : "Dolu"}
      />
    ) : null;
  };

  //bugünden önceki tarihleri seçtirtmiyor
  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current < today;
  };

  return (
    <div>
      <Select
        placeholder="Türe Göre Filtrele"
        onChange={handleFilterChange}
        allowClear
        style={{ width: 200 }}
      >
        <Select.Option value="saatlik">Saatlik Sahalar</Select.Option>
        <Select.Option value="günlük">Günlük Sahalar</Select.Option>
      </Select>

      <Row gutter={16} style={{ padding: 24 }}>
        {filteredFields.map((field) => (
          <Col xl={6} key={field.id}>
            <Card
              cover={<img src={field.imageUrl} />}
              actions={[
                <Button onClick={() => showModal(field)}>Kirala</Button>,
              ]}
            >
              <Card.Meta
                title={field.name}
                description={`Sahanın Türü: ${field.type}`}
              />

              {field.type === "saatlik" ? (
                <p>Ücret: {field.hourlyPrice} TL / saat</p>
              ) : (
                <p>Ücret: {field.dailyPrice} TL / gün</p>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={
          selectedField?.type === "saatlik"
            ? "Saatlik sahamız 17.00-00.00 arasında faaliyet göstermektedir! (Sepete eklenen saat dilimi ödeme tamamlanmadığı sürece hala kiralanabilir)"
            : "Zaman Seçimi"
        }
        open={openModal}
        onCancel={closeModal}
        footer={[
          selectedDate && (
            <Button key="add" type="primary" onClick={handleAddCart}>
              Sepete Ekle
            </Button>
          ),
        ]}
      >
        {selectedField?.type === "saatlik" ? (
          <div>
            <Calendar
              fullscreen={false}
              onSelect={handleDateSelect}
              disabledDate={disabledDate}
            />
            {selectedDate && (
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                {Object.keys(hourlyAvailability).map((hourKey) => {
                  const hour = parseInt(hourKey, 10);
                  return (
                    <Button
                      key={hour}
                      type={selectedHour === hour ? "dashed" : "primary"}
                      disabled={hourlyAvailability[hour] !== "boş"}
                      onClick={() => handleHourSelect(hour)}
                    >
                      {hour === 23
                        ? `${hour}:00 - 00:00`
                        : `${hour}:00 - ${hour + 1}:00`}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Calendar
            fullscreen={false}
            cellRender={cellRender}
            onSelect={(date) => setSelectedDate(date.format("YYYY.MM.DD"))}
            disabledDate={disabledDate}
          />
        )}
      </Modal>
    </div>
  );
};
export default FieldBooking;

/*RETURN İÇİ
SELECT,günlük mü saatlik mi seçenekleri

ROW bloğu, bir listedeki spor sahalarını kartlar halinde yan yana gösterir
her bir saha için bir kart oluşturulur
kartlarda sahanın fotoğrafı adı türü  ücreti ve kirala butonu bulunur. 
butonuna tıklandığında modal açılıyor 
yani takvim modalın ama saatlik mi için yoksa günlük için mi açıldığının kontrolü modalda

MODAL bloğu, takvimi açıyor eğer seçilen saha saatlik ise (selectedField?.type === "saatlik")
bir takvim ve saat seçimi arayüzü sunar. takvimden tarihi seçip sonra da müsait saatlerden birini seçebiliyorsun
eğer seçilen saha günlük ise cellRender fonksiyonu buna aktarılır ve uygun dolu günler ortaya çıkar 
*/
