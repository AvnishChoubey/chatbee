const mongoose = require("mongoose");
require("dotenv").config();

const uri =
  process.env.MONGO_URI ||
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@dev.pqlrqpf.mongodb.net/chatbee-dev-1?retryWrites=true&w=majority`;

mongoose.connect(uri, () => {
  console.log("connected to mongoDB");
});
