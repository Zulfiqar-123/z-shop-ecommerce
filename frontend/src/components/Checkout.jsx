
function Checkout({ cart, onBack, onPlaceOrder }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const customer = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      paymentMethod: formData.get('payment'),
    }

    onPlaceOrder(customer)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="text-orange-500 font-semibold mb-6"
        >
          ← Back to Shopping Cart
        </button>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">
              Customer Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full border rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="03XXXXXXXXX"
                  className="w-full border rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Delivery Address</label>
                <textarea
                  name="address"
                  required
                  rows="4"
                  placeholder="Enter your complete address"
                  className="w-full border rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Payment Method</label>
                <select
                  name="payment"
                  required
                  className="w-full border rounded-xl p-3 outline-none focus:border-orange-500"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition"
              >
                Place Order →
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold whitespace-nowrap">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-extrabold text-xl mt-6">
              <span>Total</span>
              <span className="text-orange-500">
                Rs. {total.toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Delivery charges are not included yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
