import { useState, useEffect, useCallback } from "react";

export function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create WebSocket connection
    const webSocket = new WebSocket(url);
    //const webSocket = new WebSocket("ws://127.0.0.1:8787");
    //Use ws:// protocol instead of wss:// for local connections

    // Connection opened
    webSocket.addEventListener("open", () => {
      setIsConnected(true);
      console.log("WebSocket Connected");
    });

    // Listen for messages
    webSocket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      console.log("message received:" + event.data);
      setMessages((prev) => [...prev, message]);
    });

    // Connection closed
    webSocket.addEventListener("close", () => {
      setIsConnected(false);
      console.log("WebSocket Disconnected");
    });

    // Error handling
    webSocket.addEventListener("error", (error) => {
      console.error("WebSocket Error:", error);
    });

    setSocket(webSocket);

    // Clean up on unmount
    return () => {
      webSocket.close();
    };
  }, [url]);

  // Send message function
  const sendMessage = useCallback(
    (data) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Sending data", JSON.stringify(data));
        socket.send(JSON.stringify(data));
      }
    },
    [socket]
  );

  return { socket, isConnected, messages, sendMessage };
}
