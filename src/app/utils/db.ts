import mongoose, { ConnectOptions } from "mongoose";

class Database {
  public static connect(): void {
    console.info(
      "⚙️  [MongoDB]: waiting for MongoDB Connection to be established... "
    );
    const uri = "mongodb://127.0.0.1:27017/moviebunkers";
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions;
    mongoose.set("strictQuery", false);
    mongoose.connect(uri, options);

    const dbConnection = mongoose.connection;
    dbConnection.on(
      "error",
      console.error.bind(console, "🔴  [MongoDB]: Connection Error : ")
    );
    dbConnection.once("open", () => {
      console.info("🟢 [MongoDB]: MongoDB connection established successfully");
    });
  }
}

export default Database;
