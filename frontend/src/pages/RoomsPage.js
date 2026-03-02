import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";

const BASE_URL = "http://localhost:8000";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BASE_URL}/api/rooms`);

      if (!res.ok) throw new Error();

      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setError("Không gọi được API rooms — kiểm tra backend hoặc CORS");
    } finally {
      setLoading(false);
    }
  };

  const searchRooms = async () => {
    if (!keyword.trim()) return fetchRooms();

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${BASE_URL}/api/rooms/search?q=${keyword}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setError("Lỗi tìm kiếm — kiểm tra backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Tìm phòng trọ</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Tìm theo tên hoặc địa chỉ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={searchRooms}>Tìm</button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {rooms.map((room, index) => (
        <RoomCard key={index} room={room} />
      ))}
    </div>
  );
}