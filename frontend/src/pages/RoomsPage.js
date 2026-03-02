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
      
      if (data.error) {
        throw new Error(data.error);
      }
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu trả về không phải là mảng!");
      }

      setRooms(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Không gọi được API — kiểm tra backend hoặc CORS");
    } finally {
      setLoading(false);
    }
  };

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
      
      if (data.error) {
        throw new Error(data.error);
      }
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu trả về không phải là mảng!");
      }

      setRooms(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Lỗi tìm kiếm — kiểm tra backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Tìm phòng trọ AI</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nhập yêu cầu: Ví dụ 'phòng 2 củ rưỡi có điều hòa'..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchRooms()}
          style={{ width: "300px", marginRight: "10px" }}
        />

        <button onClick={searchRooms}>Tìm</button>
      </div>

      {loading && <p>AI đang phân tích và tìm kiếm...</p>}
      
      {error && <p style={{ color: "red", fontWeight: "bold" }}>LỖI: {error}</p>}

      {!loading && !error && rooms.length === 0 && (
          <p>Không tìm thấy phòng trọ nào phù hợp với yêu cầu của bạn.</p>
      )}

      {Array.isArray(rooms) && rooms.map((room, index) => (
        <RoomCard key={index} room={room} />
      ))}
    </div>
  );
}