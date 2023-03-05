import WinstonLogger from "@middlewares/winstonlogger.middleware";
import Config from "@Config";
import mongoose, { ConnectOptions } from "mongoose";

class Database {
  public static connect(): void {
    console.info(
      "⚙️  [MongoDB]: waiting for MongoDB Connection to be established... "
    );
    const uri : string = Config?.MongoDB_SERVER_STRING as string;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions;
    mongoose.set("strictQuery", false);
    mongoose.connect(uri, options);

    const dbConnection = mongoose.connection;
    dbConnection.on(
      "error",
      (err)=> {
        //  console.error.bind(console, "🔴  [MongoDB]: Connection Error : ");
        WinstonLogger.error(err);
      }
    );
    dbConnection.once("open", () => {
      console.info("🟢 [MongoDB]: MongoDB connection established successfully");
    });
  }
}

export default Database;
