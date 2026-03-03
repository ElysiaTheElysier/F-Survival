import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress
} from "@mui/material";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: input })
      });

      const data = await res.json();

      const botReply = {
        sender: "bot",
        text: data.answer,
        sources: data.sources
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Lỗi chat:", error);
    }

    setLoading(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "75vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: 3
      }}
    >
      <Typography variant="h6" mb={2}>
        🤖 Chatbot AI
      </Typography>

      <Box flex={1} overflow="auto">
        {messages.map((msg, index) => (
          <Box
            key={index}
            textAlign={msg.sender === "user" ? "right" : "left"}
            mb={2}
          >
            <Box
              display="inline-block"
              bgcolor={
                msg.sender === "user" ? "#1e88e5" : "#e0e0e0"
              }
              color={msg.sender === "user" ? "white" : "black"}
              p={2}
              borderRadius={2}
              maxWidth="80%"
            >
              <Typography>{msg.text}</Typography>

              {/* 🔥 HIỂN THỊ SOURCES */}
              {msg.sources && (
                <Box mt={1}>
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                  >
                    Nguồn:
                  </Typography>
                  {msg.sources.map((s, i) => (
                    <Typography
                      key={i}
                      variant="caption"
                      display="block"
                    >
                      • {s}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        ))}

        {loading && <CircularProgress size={20} />}
      </Box>

      <Box display="flex" gap={2} mt={2}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi..."
        />
        <Button variant="contained" onClick={sendMessage}>
          Gửi
        </Button>
      </Box>
    </Paper>
  );
}