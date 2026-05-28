const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

router.post('/', async (req, res) => {
  try {
    const { customerName, mobile, address, paymentMethod, slices, quantity, totalPrice } = req.body

    if (!customerName || !mobile || !slices || slices.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const order = new Order({ customerName, mobile, address, paymentMethod, slices, quantity, totalPrice })
    await order.save()
    console.log('New order placed:', order._id)
    res.status(201).json(order)
  } catch (err) {
    console.error('Error saving order:', err)
    res.status(500).json({ error: 'Failed to save order' })
  }
})

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ placedAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

module.exports = router
