import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";
import { useRenderCount } from "./useRenderCount";

const API_URL = "http://localhost:4000";

function ChatApp() {
  const renderCount = useRenderCount();
  console.log(renderCount);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Connect to Socket.IO server and fetch initial messages
  useEffect(() => {
    // Check server health first
    axios
      .get(`${API_URL}/api/health`)
      .then(() => {
        // If server is healthy, connect to socket
        socketRef.current = io(API_URL);

        socketRef.current.on("connect", () => {
          setIsConnected(true);
          console.log("Connected to server");
        });

        socketRef.current.on("disconnect", () => {
          setIsConnected(false);
          console.log("Disconnected from server");
        });

        // Get initial messages from socket
        socketRef.current.on("initial messages", (initialMessages) => {
          setMessages(initialMessages);
          console.log("initial messages");
          //setIsLoading(false);
        });

        // Listen for new messages
        socketRef.current.on("new message", (message) => {
          console.log("new message ");
          console.log(JSON.stringify(message, null, 2));
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      })
      .catch((err) => {
        console.error("Server health check failed:", err);
        setError("Server is not available");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log("TURN OFF !!!!!!!!!");
        socket.off("new message", handleNewMessage);
      }
    };
    // if (socketRef.current) {
    //   socketRef.current.disconnect();
    // }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !username.trim()) return;

    const messageData = {
      text: newMessage.trim(),
      user: username.trim(),
    };

    socketRef.current.emit("new message", messageData);
    setNewMessage("");
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Real-time Chat</Typography>
          <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: isConnected ? "success.main" : "error.main",
                mr: 1,
              }}
            />
            <Typography variant="body2">{isConnected ? "Connected" : "Disconnected"}</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            variant="outlined"
            required
          />
        </Paper>

        <Paper elevation={3} sx={{ height: "60vh", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2, flexGrow: 1, overflow: "auto" }}>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" align="center" sx={{ p: 4 }}>
                {error}
              </Typography>
            ) : messages.length === 0 ? (
              <Typography align="center" color="textSecondary" sx={{ p: 4 }}>
                No messages yet. Be the first to send a message!
              </Typography>
            ) : (
              <List>
                {/* {messages.map((message) => ( */}
                {[...new Map(messages.map((m) => [m.id, m])).values()].map((message) => (
                  <div key={message.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: username === message.user ? "rgba(25, 118, 210, 0.08)" : "transparent",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2">{message.user}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={message.text}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </List>
            )}
          </Box>

          <Divider />

          <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex" }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!isConnected || !username.trim()}
                sx={{ mr: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!isConnected || !username.trim() || !newMessage.trim()}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default ChatApp;
