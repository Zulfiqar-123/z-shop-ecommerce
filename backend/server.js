
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './config/db.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoutes from './routes/productRoutes.js'
import verifyAdminToken from './middleware/auth.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Admin and product routes
app.use('/api/admin', adminRoutes)
app.use('/api/products', productRoutes)

// Home API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Z-Shop Backend API!'
  })
})

// Database test API
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS result')

    res.json({
      success: true,
      message: 'Z-Shop Database Connected Successfully!',
      databaseTest: rows[0].result
    })
  } catch (error) {
    console.error('Database test error:', error.message)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Customer Place Order API
app.post('/api/orders', async (req, res) => {
  const { customer, items } = req.body

  if (
    !customer?.name ||
    !customer?.phone ||
    !customer?.address ||
    !customer?.paymentMethod ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Customer details and cart items are required.'
    })
  }

  const validItems = items.every(item =>
    Number.isInteger(Number(item.id)) &&
    item.name &&
    Number.isFinite(Number(item.price)) &&
    Number(item.price) > 0 &&
    Number.isInteger(Number(item.quantity)) &&
    Number(item.quantity) > 0
  )

  if (!validItems) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product information.'
    })
  }

  let connection
  let transactionStarted = false

  try {
    connection = await db.getConnection()

    await connection.beginTransaction()
    transactionStarted = true

    const total = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    )

    const orderNumber = `ZS-${Date.now()}`

    const [orderResult] = await connection.execute(
      `INSERT INTO orders
      (order_number, customer_name, phone, address, payment_method, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customer.name,
        customer.phone,
        customer.address,
        customer.paymentMethod,
        total
      ]
    )

    const orderId = orderResult.insertId

    for (const item of items) {
      const price = Number(item.price)
      const quantity = Number(item.quantity)

      await connection.execute(
        `INSERT INTO order_items
        (order_id, product_id, product_name, price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          Number(item.id),
          item.name,
          price,
          quantity,
          price * quantity
        ]
      )
    }

    await connection.commit()
    transactionStarted = false

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        id: orderId,
        orderNumber,
        total
      }
    })

  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback()
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message)
      }
    }

    console.error('Order error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })

  } finally {
    if (connection) {
      connection.release()
    }
  }
})

// Admin: Get all customer orders
app.get('/api/orders', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.id AS order_id,
        o.order_number,
        o.customer_name,
        o.phone,
        o.address,
        o.payment_method,
        o.total_amount,
        o.status,
        o.created_at,
        oi.id AS item_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.subtotal
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ORDER BY o.created_at DESC
    `)

    const ordersMap = {}

    rows.forEach(row => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          order_number: row.order_number,
          customer_name: row.customer_name,
          phone: row.phone,
          address: row.address,
          payment_method: row.payment_method,
          total: Number(row.total_amount),
          status: row.status,
          created_at: row.created_at,
          items: []
        }
      }

      if (row.item_id) {
        ordersMap[row.order_id].items.push({
          id: row.item_id,
          product_id: row.product_id,
          product_name: row.product_name,
          price: Number(row.price),
          quantity: row.quantity,
          subtotal: Number(row.subtotal)
        })
      }
    })

    const orders = Object.values(ordersMap)

    res.json({
      success: true,
      count: orders.length,
      orders
    })

  } catch (error) {
    console.error('Fetch orders error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch orders.'
    })
  }
})

// Admin: Update order status
app.patch(
  '/api/orders/:id/status',
  verifyAdminToken,
  async (req, res) => {
    const orderId = Number(req.params.id)
    const { status } = req.body

    const allowedStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ]

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.'
      })
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status.'
      })
    }

    try {
      const [result] = await db.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found.'
        })
      }

      res.json({
        success: true,
        message: 'Order status updated successfully!',
        orderId,
        status
      })

    } catch (error) {
      console.error('Update status error:', error.message)

      res.status(500).json({
        success: false,
        message: 'Unable to update order status.'
      })
    }
  }
)

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Z-Shop Server running on port ${PORT}`)
})
