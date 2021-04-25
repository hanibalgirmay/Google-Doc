const mongoose = require("mongoose");
const Document = require("./models/document");

// Database connection
mongoose.connect("mongodb://localhost/google_doc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const defaultValue = "";

const socket = require("socket.io")(3200, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (io) => {
  io.on("get-document", async (docID) => {
    const d = await _Document(docID);
    io.join(docID);
    io.emit("load-document", d.data);
    io.on("send-changes", async (delta) => {
      //   console.log(delta);
      io.broadcast.to(docID).emit("receive-changes", delta);
    });

    io.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(docID, { data });
    });
  });
  console.log("connected");
});

_Document = async (id) => {
  if (id == null) return;

  const _doc = await Document.findById(id);

  if (_doc) return _doc;

  return await Document.create({ _id: id, data: defaultValue });
};
