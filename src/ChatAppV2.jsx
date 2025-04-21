import React, { useState } from "react";
import { useWebSocket } from "./useWebSocket";

function ChatComponent() {
  const [inputMessage, setInputMessage] = useState("");
  const { isConnected, messages, sendMessage } = useWebSocket("wss://chat-app.your-worker-subdomain.workers.dev");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage({ type: "chat", text: inputMessage });
      setInputMessage("");
    }
  };

  return (
    <div>
      <div className="connection-status">Status: {isConnected ? "Connected" : "Disconnected"}</div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatComponent;
