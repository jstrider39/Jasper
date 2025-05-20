const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors"); // ✅ modern, maintained package
const http = require("http");
const socketIO = require("socket.io");
const fileRoutes = require("./routes/files");

const app = new Koa();
const router = new Router();

const allowedOrigins = [
  "localhost:3000",
  "localhost:4000",
  // "http://localhost:3000",
  // "http://localhost:4000",
  // "http://192.168.1.100:3000",
  // "http://192.168.1.101:3000",
  // "http://192.168.1.102:3000",
];

// Middleware
app.use(bodyParser());

app.use(
  cors({
    origin: (origin, ctx) => {
      console.log("CORS request from origin:", origin.host);

      // Allow requests with no origin (e.g., curl, mobile apps)
      if (!origin) return "*";

      if (allowedOrigins.includes(origin?.request?.header?.host)) {
        console.log("✔️ Allowed origin:", origin);
        return origin;
      }

      console.log("❌ Not allowed origin V2:", origin, allowedOrigins, origin);
      return ""; // Returning empty string blocks the request
    },
    credentials: true,
  })
);
router.use("/files", fileRoutes.routes());

// Routes
router.get("/api/health", (ctx) => {
  ctx.body = { status: "ok" };
});

const messages = [];

router.get("/api/messages", (ctx) => {
  ctx.body = messages;
});

router.get("/api/clear", (ctx) => {
  messages.length = 0;
  ctx.body = messages;
});

// Apply router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Create HTTP server
const server = http.createServer(app.callback());

// Setup Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: (origin, callback) => {
      console.log("Socket.IO CORS request from:", origin);
      //if (!origin || allowedOrigins.includes(origin)) {
      if (!origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by Socket.IO CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  // Send existing messages
  socket.emit("initial messages", messages);

  socket.on("new message", (message) => {
    const newMessage = {
      id: Date.now(),
      text: message.text,
      user: message.user,
      timestamp: new Date(),
    };

    messages.push(newMessage);
    console.log("new message: " + newMessage.text);
    io.emit("new message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("🚫 Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
