export default function ChatMessage({ text, isUser }) {
  return (
    <div
      style={{
        textAlign: isUser ? "right" : "left",
        marginBottom: 10
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: 10,
          borderRadius: 10,
          background: isUser ? "#4caf50" : "#eee",
          color: isUser ? "white" : "black"
        }}
      >
        {text}
      </span>
    </div>
  );
}
