const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://test1234:test1234@notesapp.ila5n9h.mongodb.net/eduwork-native?retryWrites=true&w=majority&appName=notesapp";

const client = new MongoClient(url);

(async () => {
  try {
    await client.connect();
    console.log("Koneksi berhasil");
  } catch (error) {
    console.log(error);
  }
})();

const db = client.db('eduwork-native')

module.exports = db;