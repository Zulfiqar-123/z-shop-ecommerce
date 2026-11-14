
function Cart({ cart, onClose, onUpdateQuantity, onRemove, onCheckout }) {

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex justify-end">

      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b shrink-0">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Shopping Cart
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {cartCount} items
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="text-3xl text-gray-500 hover:text-red-500 cursor-pointer"
          >
            ×
          </button>

        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">

          {cart.length === 0 ? (

            <div className="text-center py-20">

              <div className="text-6xl mb-4">🛒</div>

              <h3 className="text-xl font-bold">
                Your cart is empty
              </h3>

              <p className="text-gray-500 mt-2">
                Add some products to get started.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 bg-orange-500 hover:bg-slate-900 text-white px-6 py-3 rounded-xl transition"
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <div className="space-y-6">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-5"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                  />

                  <div className="flex-1">

                    <h3 className="font-bold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="text-orange-500 font-bold mt-1">
                      Rs. {Number(item.price).toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg border hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg border hover:bg-gray-100"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="font-bold">
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>

                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 text-sm mt-4 hover:underline"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Fixed Cart Footer */}
        {cart.length > 0 && (

          <div className="border-t p-6 bg-white shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">

            <div className="flex justify-between text-lg font-bold mb-5">

              <span>Total Amount</span>

              <span className="text-orange-500">
                Rs. {total.toLocaleString()}
              </span>

            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="w-full bg-orange-500 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition cursor-pointer text-lg"
            >
              Proceed to Checkout →
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-3 text-gray-500 py-2 hover:text-orange-500"
            >
              Continue Shopping
            </button>

          </div>

        )}

      </div>

    </div>
  )
}

export default Cart
