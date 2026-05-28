require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const ordersRouter = require('./routes/orders')

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.use('/api/orders', ordersRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
