import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

export default function RoomCard({ room }) {
  const formatPrice = (price) =>
    price?.toLocaleString("vi-VN") + " vnđ/tháng";

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={room.image}
        alt={room.name}
      />

      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {room.name}
        </Typography>

        <Box display="flex" alignItems="center" mt={1}>
          <LocationOnIcon fontSize="small" />
          <Typography variant="body2" ml={1}>
            {room.address}
          </Typography>
        </Box>

        <Typography mt={1}>
          Diện tích: <b>{room.area}</b>
        </Typography>

        <Typography mt={1}>
          Tiện ích: {room.utilities}
        </Typography>

        <Box mt={2}>
          <Chip
            icon={<PhoneIcon />}
            label={room.phone}
            color="primary"
          />
        </Box>

        <Typography
          variant="h6"
          color="error"
          fontWeight="bold"
          mt={2}
        >
          {formatPrice(room.price)}
        </Typography>
      </CardContent>
    </Card>
  );
}
