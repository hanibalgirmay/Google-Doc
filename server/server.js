const socket = require("socket.io")(3200, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (io) => {
  io.on("send-changes", (delta) => {
    console.log(delta);
    io.broadcast.emit("receive-changes", delta);
  });
  console.log("connected");
});
