
import { useEffect, useState } from 'react'

const API = 'http://localhost:5000/api'

function AdminDashboard({ token, adminUser, onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders')

  // Orders states
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  // Products states
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productError, setProductError] = useState('')
  const [savingProduct, setSavingProduct] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const emptyForm = {
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  }

  const [form, setForm] = useState(emptyForm)

  // Load orders
  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load orders.')
      }

      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load products
  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      setProductError('')

      const response = await fetch(`${API}/products`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load products.')
      }

      setProducts(data.products || [])
    } catch (err) {
      setProductError(err.message)
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    loadProducts()
  }, [])

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id)

      const response = await fetch(`${API}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Status update failed.')
      }

      setOrders(previous =>
        previous.map(order =>
          order.id === id
            ? { ...order, status: data.status }
            : order
        )
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  // Product form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target

    setForm(previous => ({
      ...previous,
      [name]: value
    }))
  }

  // Reset product form
  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setProductError('')
  }

  // Add or update product
  const handleProductSubmit = async (e) => {
    e.preventDefault()

    try {
      setSavingProduct(true)
      setProductError('')

      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      }

      const url = editingId
        ? `${API}/products/${editingId}`
        : `${API}/products`

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to save product.')
      }

      alert(data.message || 'Product saved successfully!')

      resetForm()
      await loadProducts()
    } catch (err) {
      setProductError(err.message)
    } finally {
      setSavingProduct(false)
    }
  }

  // Edit product
  const handleEdit = (product) => {
    setEditingId(product.id)

    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      category: product.category || '',
      image: product.image || '',
      stock: product.stock ?? ''
    })

    setProductError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      setProductError('')

      const response = await fetch(`${API}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to delete product.')
      }

      alert(data.message || 'Product deleted successfully!')
      await loadProducts()
    } catch (err) {
      setProductError(err.message)
    }
  }

  // Dashboard calculations
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  )

  const pending = orders.filter(
    order => order.status === 'Pending'
  ).length

  const delivered = orders.filter(
    order => order.status === 'Delivered'
  ).length

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">

          <div>
            <h1 className="text-2xl font-extrabold">
              Z-<span className="text-orange-500">SHOP</span> Admin
            </h1>

            <p className="text-slate-300 text-sm mt-1">
              Welcome, {adminUser?.name || 'Admin'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
            >
              Back to Store
            </button>

            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">

        {/* Dashboard heading */}
        <div className="mb-7">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Dashboard Overview
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your store, products and customer orders.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-500 font-medium">Total Orders</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {orders.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
            <p className="text-gray-500 font-medium">Total Order Value</p>
            <h3 className="text-2xl font-bold text-orange-500 mt-2">
              Rs. {totalRevenue.toLocaleString()}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-500 font-medium">Pending Orders</p>
            <h3 className="text-3xl font-bold text-yellow-600 mt-2">
              {pending}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-gray-500 font-medium">Total Products</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {products.length}
            </h3>
          </div>

        </div>

        {/* Dashboard Tabs */}
        <div className="flex flex-wrap gap-3 mb-7">

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Customer Orders
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'products'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Manage Products
          </button>

        </div>

        {/* ORDERS SECTION */}
        {activeTab === 'orders' && (
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="p-6 border-b flex flex-wrap justify-between items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">
                Customer Orders
              </h2>

              <button
                onClick={loadOrders}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Loading...' : '↻ Refresh Orders'}
              </button>
            </div>

            <div className="p-6">

              {loading ? (
                <p className="text-gray-500 text-center py-10">
                  Loading customer orders...
                </p>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  <p className="font-semibold">Error: {error}</p>

                  <button
                    onClick={loadOrders}
                    className="mt-3 underline font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  No customer orders found yet.
                </p>
              ) : (
                <div className="space-y-5">

                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                    >

                      <div className="flex flex-wrap justify-between gap-4 mb-4">

                        <div>
                          <h3 className="font-bold text-lg text-slate-800">
                            Order #{order.order_number || order.id}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(order.created_at)}
                          </p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-slate-700">
                            Customer Details
                          </h4>

                          <p className="text-sm text-gray-600">
                            Name: {order.customer_name}
                          </p>

                          <p className="text-sm text-gray-600">
                            Phone: {order.phone}
                          </p>

                          <p className="text-sm text-gray-600">
                            Address: {order.address}
                          </p>

                          <p className="text-sm text-gray-600">
                            Payment: {order.payment_method}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-slate-700">
                            Order Summary
                          </h4>

                          {order.items?.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="flex justify-between text-sm text-gray-600 mb-2"
                            >
                              <span>
                                {item.product_name} × {item.quantity}
                              </span>

                              <span>
                                Rs. {Number(item.subtotal).toLocaleString()}
                              </span>
                            </div>
                          ))}

                          <div className="border-t pt-3 mt-3 flex justify-between font-bold text-slate-800">
                            <span>Total</span>
                            <span className="text-orange-500">
                              Rs. {Number(order.total).toLocaleString()}
                            </span>
                          </div>
                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-3">

                        <label className="font-semibold text-sm text-slate-700">
                          Update Order Status:
                        </label>

                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-orange-500 disabled:opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {updatingId === order.id && (
                          <span className="text-sm text-orange-500">
                            Updating...
                          </span>
                        )}

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>
          </section>
        )}

        {/* PRODUCTS SECTION */}
        {activeTab === 'products' && (
          <section className="space-y-7">

            {/* Product Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold text-slate-800 mb-5">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>

              {productError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-5">
                  {productError}
                </div>
              )}

              <form onSubmit={handleProductSubmit} className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Enter product name"
                      required
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      placeholder="e.g. Electronics, Fashion"
                      required
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleFormChange}
                      placeholder="Enter price"
                      min="0.01"
                      step="0.01"
                      required
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleFormChange}
                      placeholder="Available quantity"
                      min="0"
                      step="1"
                      required
                      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleFormChange}
                    placeholder="https://example.com/product.jpg"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Write product description..."
                    rows="4"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {savingProduct
                      ? 'Saving...'
                      : editingId
                      ? 'Update Product'
                      : 'Add Product'}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-lg font-semibold"
                    >
                      Cancel Edit
                    </button>
                  )}

                </div>

              </form>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              <div className="p-6 border-b flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">
                  All Products ({products.length})
                </h2>

                <button
                  onClick={loadProducts}
                  disabled={productsLoading}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {productsLoading ? 'Loading...' : '↻ Refresh Products'}
                </button>
              </div>

              <div className="p-6">

                {productsLoading ? (
                  <p className="text-center py-10 text-gray-500">
                    Loading products...
                  </p>
                ) : products.length === 0 ? (
                  <p className="text-center py-10 text-gray-500">
                    No products added yet. Use the form above to add your first product.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {products.map(product => (
                      <div
                        key={product.id}
                        className="border rounded-xl overflow-hidden hover:shadow-md transition"
                      >

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover bg-slate-100"
                          />
                        ) : (
                          <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        <div className="p-5">

                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-lg text-slate-800">
                              {product.name}
                            </h3>

                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                              {product.category}
                            </span>
                          </div>

                          <p className="text-orange-500 font-bold text-xl mt-3">
                            Rs. {Number(product.price).toLocaleString()}
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            Stock: {product.stock}
                          </p>

                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {product.description || 'No description available.'}
                          </p>

                          <div className="flex gap-3 mt-5">

                            <button
                              onClick={() => handleEdit(product)}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
                            >
                              Delete
                            </button>

                          </div>

                        </div>
                      </div>
                    ))}

                  </div>
                )}

              </div>
            </div>

          </section>
        )}

      </main>
    </div>
  )
}

export default AdminDashboard
