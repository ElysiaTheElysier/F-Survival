import { useState } from "react";
import ChatMessage from "../components/ChatMessage";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
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

      if (!res.ok) {
        throw new Error("Server không phản hồi");
      }

      const data = await res.json();
      

      setMessages([
        ...newMessages,
        { text: data.answer, isUser: false }
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { text: "Lỗi: Không gọi được AI. Hãy kiểm tra lại Server Backend!", isUser: false }
      ]);
    } finally {
      setLoading(false);
    }
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

        {loading && <p>AI đang suy nghĩ... </p>}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
          <input
            style={{ flex: 1 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập câu hỏi..."
          />
          <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}