import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";

const BASE_URL = "https://crumbliest-warty-hildegard.ngrok-free.dev"; // sửa link ngrok của bạn

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  // ===== lấy danh sách =====
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BASE_URL}/api/rooms`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Server không phản hồi");
      }

      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
      setError("Không gọi được API — kiểm tra backend hoặc CORS");
    } finally {
      setLoading(false);
    }
  };

  // ===== tìm kiếm =====
  const searchRooms = async () => {
    if (!keyword) return fetchRooms();

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${BASE_URL}/api/rooms/search?q=${keyword}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.ok) {
        throw new Error("Server không phản hồi");
      }

      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
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
