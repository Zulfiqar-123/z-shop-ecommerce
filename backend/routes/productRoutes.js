
import express from 'express'
import db from '../config/db.js'
import verifyAdminToken from '../middleware/auth.js'

const router = express.Router()

// GET: Display all products (Public)
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    )

    res.json({
      success: true,
      count: products.length,
      products
    })
  } catch (error) {
    console.error('Fetch products error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch products.'
    })
  }
})

// POST: Add new product (Admin only)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body

    if (
      !name?.trim() ||
      !category?.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid product details.'
      })
    }

    const [result] = await db.execute(
      `INSERT INTO products
      (name, description, price, category, image, stock)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description || '',
        Number(price),
        category.trim(),
        image || '',
        Number(stock)
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      productId: result.insertId
    })
  } catch (error) {
    console.error('Add product error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to add product.'
    })
  }
})

// PUT: Edit product (Admin only)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, description, price, category, image, stock } = req.body

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.'
      })
    }

    if (
      !name?.trim() ||
      !category?.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid product details.'
      })
    }

    const [result] = await db.execute(
      `UPDATE products
       SET name = ?, description = ?, price = ?,
           category = ?, image = ?, stock = ?
       WHERE id = ?`,
      [
        name.trim(),
        description || '',
        Number(price),
        category.trim(),
        image || '',
        Number(stock),
        id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      })
    }

    res.json({
      success: true,
      message: 'Product updated successfully!'
    })
  } catch (error) {
    console.error('Update product error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to update product.'
    })
  }
})

// DELETE: Remove product (Admin only)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.'
      })
    }

    const [result] = await db.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      })
    }

    res.json({
      success: true,
      message: 'Product deleted successfully!'
    })
  } catch (error) {
    console.error('Delete product error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to delete product.'
    })
  }
})

export default router
