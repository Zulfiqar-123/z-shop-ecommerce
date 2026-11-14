
function Navbar({ cartCount, search, setSearch, onCartClick, onAdminClick }) {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">

        <a href="#" className="text-3xl font-extrabold text-slate-900">
          Z-<span className="text-orange-500">SHOP</span>
        </a>

        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#" className="hover:text-orange-500">Home</a>
          <a href="#products" className="hover:text-orange-500">Shop</a>
          <a href="#categories" className="hover:text-orange-500">Categories</a>
          <a href="#about" className="hover:text-orange-500">About</a>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-36 sm:w-52 px-4 py-2 rounded-full border border-gray-200 outline-none focus:border-orange-500"
          />

          <button
            onClick={onAdminClick}
            className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition font-semibold"
          >
            Admin Dashboard
          </button>

          <button
            onClick={onCartClick}
            className="bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-orange-500 transition"
          >
            🛒 Cart ({cartCount})
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
