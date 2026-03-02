export default function RoomCard({ room }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " vnđ/tháng";
  };

  return (
    <div style={styles.card}>
      <h3>{room.name}</h3>

      <p><b>💰 Giá:</b> {formatPrice(room.price)}</p>
      <p><b>📍 Địa chỉ:</b> {room.address}</p>
      <p><b>📐 Diện tích:</b> {room.area}</p>
      <p><b>⚡ Tiện ích:</b> {room.utilities}</p>
      <p><b>📞 Liên hệ:</b> {room.phone}</p>
      <p>{room.description}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10
  }
};
