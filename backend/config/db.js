
import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'zshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

console.log('Z-Shop Database Pool Created Successfully!')

export default db
