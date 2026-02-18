import RoomsPage from "./pages/RoomsPage";
import ChatbotPage from "./pages/ChatbotPage";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("rooms");

  return (
    <div>
      <nav style={{ padding: 20 }}>
        <button onClick={() => setPage("rooms")}>Tìm trọ</button>
        <button onClick={() => setPage("chat")}>Chatbot AI</button>
      </nav>

      {page === "rooms" && <RoomsPage />}
      {page === "chat" && <ChatbotPage />}
    </div>
  );
}

export default App;
