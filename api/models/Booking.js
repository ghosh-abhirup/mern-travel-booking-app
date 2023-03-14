const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guest: { type: Number, required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
