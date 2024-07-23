const { MongoClient } = require("mongodb");

const url =
  "mongodb://eduwork:12345678@localhost:27017/?authSource=eduwork-native";

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