const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@dev.pqlrqpf.mongodb.net/chatbee-dev-1?retryWrites=true&w=majority`, () => {
  console.log('connected to mongoDB');
});