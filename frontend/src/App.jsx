
import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductCard from './components/ProductCard'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'

function App() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [order, setOrder] = useState(null)
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminToken, setAdminToken] = useState(null)
  const [adminUser, setAdminUser] = useState(null)

  // Database products
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')

  // Load products from MySQL
  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      setProductsError('')

      const response = await fetch(
        'http://localhost:5000/api/products'
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load products.')
      }

      setProducts(data.products || [])

    } catch (error) {
      console.error('Products Error:', error)
      setProductsError(error.message)

    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Categories
  const categories = [
    'All',
    ...new Set(
      products
        .map(product => product.category)
        .filter(Boolean)
    )
  ]

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || product.category === category

    return matchesSearch && matchesCategory
  })

  // Add product to cart
  const addToCart = (product) => {
    console.log('Product received in App:', product)

    if (!product || !product.id) {
      alert('Invalid product. Please try again.')
      return
    }

    const formattedProduct = {
      ...product,
      id: Number(product.id),
      price: Number(product.price)
    }

    setCart(previousCart => {
      const existingProduct = previousCart.find(
        item => Number(item.id) === formattedProduct.id
      )

      if (existingProduct) {
        return previousCart.map(item =>
          Number(item.id) === formattedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...previousCart,
        { ...formattedProduct, quantity: 1 }
      ]
    })

    alert('Product added to cart successfully!')
  }

  // Update quantity
  const updateQuantity = (id, change) => {
    setCart(previousCart =>
      previousCart
        .map(item =>
          Number(item.id) === Number(id)
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(previousCart =>
      previousCart.filter(
        item => Number(item.id) !== Number(id)
      )
    )
  }

  // Cart count
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Place order
  const handlePlaceOrder = async (customer) => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer,
            items: cart,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Order could not be placed.'
        )
      }

      const newOrder = {
        id: data.order.orderNumber,
        customer,
        items: [...cart],
        total: data.order.total,
      }

      setOrder(newOrder)
      setCart([])
      setShowCheckout(false)
      setShowCart(false)

    } catch (error) {
      console.error('Order Error:', error)

      alert(
        error.message ||
        'Server connection failed. Please try again.'
      )
    }
  }

  // Admin login
  if (showAdmin && !adminToken) {
    return (
      <AdminLogin
        onLogin={(token, admin) => {
          setAdminToken(token)
          setAdminUser(admin)
        }}
        onBack={() => setShowAdmin(false)}
      />
    )
  }

  // Admin dashboard
  if (showAdmin && adminToken) {
    return (
      <AdminDashboard
        token={adminToken}
        adminUser={adminUser}
        onBack={() => {
          setShowAdmin(false)
          loadProducts()
        }}
        onLogout={() => {
          setAdminToken(null)
          setAdminUser(null)
        }}
      />
    )
  }

  // Order confirmation
  if (order) {
    return (
      <OrderConfirmation
        order={order}
        onContinueShopping={() => {
          setOrder(null)
          setShowCart(false)
          setShowCheckout(false)
          loadProducts()
        }}
      />
    )
  }

  // Checkout
  if (showCheckout) {
    return (
      <Checkout
        cart={cart}
        onBack={() => setShowCheckout(false)}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
        onCartClick={() => setShowCart(true)}
        onAdminClick={() => setShowAdmin(true)}
      />

      <Hero />

      {/* Categories */}
      <section
        id="categories"
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          Shop by Category
        </h2>

        <div className="flex flex-wrap gap-3">
          {categories.map(item => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-6 py-3 rounded-full font-semibold transition ${
                category === item
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-slate-700 border border-gray-200 hover:border-orange-500'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-6 py-10"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-orange-500 font-semibold">
              OUR COLLECTION
            </p>

            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Featured Products
            </h2>
          </div>

          <p className="text-gray-500">
            {filteredProducts.length} Products
          </p>
        </div>

        {productsLoading ? (
          <p className="text-center py-16 text-gray-500">
            Loading products from database...
          </p>
        ) : productsError ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">
              Unable to load products: {productsError}
            </p>

            <button
              onClick={loadProducts}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAdd={addToCart}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-16 text-gray-500">
            No products found. Try another search or add products from Admin Dashboard.
          </p>
        )}
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-slate-900 text-white text-center px-6 py-16"
      >
        <h2 className="text-3xl font-bold">
          Welcome to Z-Shop
        </h2>

        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Your trusted destination for quality products,
          amazing prices and a simple online shopping experience.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6">
        <p>© 2026 Z-Shop. All Rights Reserved.</p>

        <button
          onClick={() => setShowAdmin(true)}
          className="mt-3 text-orange-400 hover:text-white font-semibold"
        >
          Admin Dashboard →
        </button>
      </footer>

      {/* Cart */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={() => {
            if (cart.length === 0) return

            setShowCart(false)
            setShowCheckout(true)
          }}
        />
      )}

    </div>
  )
}

export default App
