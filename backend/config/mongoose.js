const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://test1234:test1234@notesapp.ila5n9h.mongodb.net/eduwork-mongoose?retryWrites=true&w=majority&appName=notesapp"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => console.log("Server database terhubung"));
