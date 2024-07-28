const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: 'string',
  from: Object,
  socketid: 'string',
  time: 'string',
  date: 'string',
  to: 'string',
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message
