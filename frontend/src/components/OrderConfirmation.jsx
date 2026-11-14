
function OrderConfirmation({ order, onContinueShopping }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-lg p-8">

        {/* Success Icon */}
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto">
            ✓
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mt-6">
            Order Confirmed!
          </h1>

          <p className="text-gray-500 mt-3">
            Thank you for shopping with Z-Shop.
            Your order has been placed successfully.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-2xl p-5 mt-8 text-center">
          <p className="text-gray-500 text-sm">Your Order ID</p>
          <h2 className="text-2xl font-extrabold text-orange-500 mt-2">
            {order.id}
          </h2>
        </div>

        {/* Customer Details */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Delivery Information
          </h2>

          <div className="space-y-2 text-gray-600">
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            <p><strong>Address:</strong> {order.customer.address}</p>
            <p><strong>Payment:</strong> {order.customer.payment}</p>
          </div>
        </div>

        {/* Ordered Products */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Ordered Products
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-slate-900">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-6 text-xl font-extrabold">
          <span>Total Paid / Payable</span>
          <span className="text-orange-500">
            Rs. {order.total.toLocaleString()}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Payment method: {order.customer.payment}
        </p>

        {/* Continue Shopping */}
        <button
          onClick={onContinueShopping}
          className="w-full mt-8 bg-slate-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition"
        >
          Continue Shopping →
        </button>

      </div>
    </div>
  )
}

export default OrderConfirmation
