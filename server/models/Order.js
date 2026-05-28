const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  slices: [
    {
      name: String,
      price: Number,
    }
  ],
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  placedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Order', orderSchema)
