const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

// mongoDB Connection
const connectDb = async () => {
  mongoose.connect(process.env.MongoDB_SERVER_STRING, {
    useNewUrlParser: true,
    // useCreateIndex: true, // deprecated on MongoDB v6+
    // useFindAndModify: false, // deprecated on MongoDB v6+
    useUnifiedTopology: true,
  });
};


const establishDbConnection = async ()=> {
    await connectDb();
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB Connection Error : "));
    db.once("open", () => {
      console.log("MongoDB connection established successfully");
    });
}


module.exports = establishDbConnection;
