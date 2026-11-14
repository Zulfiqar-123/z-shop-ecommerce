
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'

const router = express.Router()

// Create the first admin account only
router.post('/setup', async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body

    if (!name || !email || !password || !setupKey) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      })
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid setup key.'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.'
      })
    }

    const [admins] = await db.query('SELECT id FROM admins LIMIT 1')

    if (admins.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'Admin account has already been created.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.execute(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email.trim().toLowerCase(), hashedPassword]
    )

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.'
    })
  } catch (error) {
    console.error('Admin setup error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to create admin account.'
    })
  }
})

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      })
    }

    const [admins] = await db.execute(
      'SELECT id, name, email, password FROM admins WHERE email = ?',
      [email.trim().toLowerCase()]
    )

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    const admin = admins[0]
    const passwordMatches = await bcrypt.compare(password, admin.password)

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing from environment variables.')
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    })
  } catch (error) {
    console.error('Admin login error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to login.'
    })
  }
})

export default router
