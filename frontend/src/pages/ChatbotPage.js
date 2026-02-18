import { useState } from "react";
import ChatMessage from "../components/ChatMessage";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput("");

    // giả lập AI delay
    setLoading(true);

    setTimeout(() => {
      setMessages([
        ...newMessages,
        { text: "AI đang xử lý trên server...", isUser: false }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🤖 Trợ lý học tập AI</h1>

      <div
        style={{
          border: "1px solid #ddd",
          height: 400,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10
        }}
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} {...m} />
        ))}

        {loading && <p>AI đang suy nghĩ...</p>}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập câu hỏi..."
      />

      <button onClick={sendMessage}>Gửi</button>
    </div>
  );
}
