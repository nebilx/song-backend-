const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.set("strictQuery", false);

  const con = await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("\x1b[36m%s\x1b[0m", "DB Connected");
    });

  mongoose.connection.on("error", (err) => {
    console.log(`DB Connection error: ${err.message}`);
  });
};
