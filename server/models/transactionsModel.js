const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionsSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("Transactions", TransactionsSchema);
