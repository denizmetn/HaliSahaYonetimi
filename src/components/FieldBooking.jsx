import { useContext, useState } from "react";
import { Card, Row, Col, Select, Button, Modal, Calendar, Badge } from "antd";
import { CartContext } from "./CartContext";

const FieldBooking = () => {
  const { addCart, fields, setFields, cart } = useContext(CartContext);
  const [filteredFields, setFilteredFields] = useState(fields);
  const [openModal, setOpenModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const [hourlyAvailability, setHourlyAvailability] = useState({});

  const handleFilterChange = (filterField) => {
    if (filterField) {
      setFilteredFields(fields.filter((field) => field.type === filterField));
    } else {
      setFilteredFields(fields);
    }
  };

  const showModal = (field) => {
    setSelectedField(field);
    setOpenModal(true);
    setSelectedHours([]);
    setHourlyAvailability({});
  };

  const closeModal = () => {
    setOpenModal(false);
  };

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

  const handleHoursSelect = (hour) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(selectedHours.filter((h) => h !== hour));
    } else {
      setSelectedHours([...selectedHours, hour]);
    }
  };

  const handleAddCart = () => {
    let alreadyInCart = null;
    if (selectedField.type === "saatlik") {
      if (!selectedDate || selectedHours.length === 0) {
        alert("Lütfen tarih ve uygun saat(leri) seçin.");
        return;
      }

      //sepette zaten var mı diye
      alreadyInCart = selectedHours.filter((hour) =>
        cart.some(
          (item) =>
            item.id === selectedField.id &&
            item.date === selectedDate &&
            item.hour === `${hour}:00 - ${hour + 1}:00`
        )
      );
      if (alreadyInCart.length > 0) {
        alert("Seçtiğiniz saatler arasında zaten sepete eklenmiş olanlar var.");
        return;
      }

      addCart(selectedField, selectedHours, selectedDate);
      alert("Seçtiğiniz saat(ler) başarıyla sepete eklendi.");
      closeModal();
    } else if (selectedField.type === "günlük") {
      if (
        !selectedDate ||
        (selectedField.availability &&
          selectedField.availability[selectedDate] === "dolu")
      ) {
        alert("Lütfen uygun bir tarih seçin.");
        return;
      }

      alreadyInCart = cart.find(
        (item) => item.id === selectedField.id && item.date === selectedDate
      );

      if (alreadyInCart) {
        alert("bu tarih zaten sepette mevcut.");
        return;
      }

      const newItem = {
        id: selectedField.id,
        name: selectedField.name,
        type: selectedField.type,
        date: selectedDate,
        hour: null,
        dailyPrice: 3000,
      };
      console.log(newItem);
      addCart(newItem);
      alert("Seçiminiz başarıyla sepete eklendi.");
      closeModal();
    }
  };

  const cellRender = (date) => {
    const status = selectedField.availability[date.format("YYYY.MM.DD")];

    return status ? (
      <Badge
        status={status === "boş" ? "success" : "error"}
        text={status === "boş" ? "Uygun" : "Dolu"}
      />
    ) : null;
  };

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
      {/*saha listelemek için */}
      <Row gutter={16} style={{ padding: 24, justifyContent: "space-between" }}>
        {filteredFields.map((field) => (
          <Col xl={7} key={field.id}>
            <Card
              cover={<img src={field.imageUrl} />}
              actions={[
                <Button
                  onClick={() => showModal(field)}
                  type="primary"
                  style={{ width: "150px" }}
                >
                  Kirala
                </Button>,
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
          <Button key="add" type="primary" onClick={handleAddCart}>
            Sepete Ekle
          </Button>,
        ]}
      >
        {selectedField?.type === "saatlik" ? (
          <div>
            <Calendar
              fullscreen={false}
              onSelect={handleDateSelect}
              disabledDate={disabledDate}
              mode="month"
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
                      type={selectedHours.includes(hour) ? "dashed" : "primary"}
                      disabled={hourlyAvailability[hour] !== "boş"}
                      onClick={() => handleHoursSelect(hour)}
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
            mode="month"
          />
        )}
      </Modal>
    </div>
  );
};
export default FieldBooking;
