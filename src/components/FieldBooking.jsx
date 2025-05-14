import { useContext, useState } from "react";
import { Card, Row, Col, Select, Button, Modal, Calendar, Badge } from "antd";
import { CartContext } from "./CartContext";

const FieldBooking = () => {
  const { addCart, fields, setFields, cart } = useContext(CartContext);
  const [filteredFields, setFilteredFields] = useState(fields);
  const [fieldTypeFilter, setFieldTypeFilter] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [hourlyAvailability, setHourlyAvailability] = useState({});

  const handleFilterChange = (filterField) => {
    setFieldTypeFilter(filterField);
    if (filterField) {
      setFilteredFields(fields.filter((field) => field.type === filterField));
    } else {
      setFilteredFields(fields);
    }
  };

  const showModal = (field) => {
    setSelectedField(field);
    setOpenModal(true);
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

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };

  const handleAddCart = () => {
    let newItem = null;
    const cartData = cart.some((item) => {
      return (
        item.id === selectedField.id &&
        item.date === selectedDate &&
        (selectedField.type === "saatlik"
          ? item.hour === `${selectedHour}:00 - ${selectedHour + 1}:00`
          : true)
      );
    });

    if (cartData) {
      alert("Bu tarih ve saat aralığı zaten sepete eklenmiş.");
      return;
    }

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
