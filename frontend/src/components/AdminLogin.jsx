
import { useState } from 'react'

function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('admin@zshop.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed.')
      }

      onLogin(data.token, data.admin)
    } catch (err) {
      setError(err.message || 'Unable to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Z-<span className="text-orange-500">SHOP</span>
          </h1>

          <h2 className="text-2xl font-bold text-slate-800 mt-6">
            Admin Login
          </h2>

          <p className="text-gray-500 mt-2">
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {error && (
            <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login to Dashboard'}
          </button>

        </form>

        <button
          onClick={onBack}
          className="w-full mt-5 text-slate-600 hover:text-orange-500 font-semibold"
        >
          ← Back to Store
        </button>

      </div>
    </div>
  )
}

export default AdminLogin
