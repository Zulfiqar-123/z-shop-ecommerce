
function ProductCard({ id, name, price, image, category, onAdd }) {
  const handleAddToCart = () => {
   const handleAddToCart = () => {
  if (typeof onAdd === 'function') {
    onAdd({
      id,
      name,
      price: Number(price),
      image,
      category
    })
  }
}

    if (typeof onAdd === 'function') {
      onAdd({
        id,
        name,
        price: Number(price),
        image,
        category
      })
    } else {
      alert('Add to Cart function is not connected!')
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 group">

      <div className="overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      <div className="p-5">
        <p className="text-orange-500 text-sm font-semibold uppercase">
          {category}
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-2">
          {name}
        </h3>

        <div className="flex justify-between items-center mt-4">
          <p className="text-2xl font-extrabold text-slate-900">
            Rs. {Number(price).toLocaleString()}
          </p>

          <span className="text-yellow-500">★★★★★</span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-5 w-full bg-slate-900 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer relative z-10"
        >
          + Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
