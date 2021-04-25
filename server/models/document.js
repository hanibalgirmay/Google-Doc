const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema({
  _id: String,
  data: Object,
});

DocSchema.set("timestamp", true);

const Document = mongoose.model("document", DocSchema);

module.exports = Document; 
