import { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress
} from "@mui/material";
import RoomCard from "../components/RoomCard";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Lấy danh sách phòng khi load trang
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Lỗi lấy phòng:", error);
    }
    setLoading(false);
  };

  // 🔥 Tìm kiếm phòng
  const searchRooms = async () => {
    if (!keyword) {
      fetchRooms();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/rooms/search?q=${keyword}`
      );
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          🏠 Tìm phòng trọ
        </Typography>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Nhập tên hoặc địa chỉ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button variant="contained" onClick={searchRooms}>
            Tìm
          </Button>
        </Box>
      </Paper>

      {loading && <CircularProgress />}

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} md={6} key={room.id}>
            <RoomCard room={room} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}