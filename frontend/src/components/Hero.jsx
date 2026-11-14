
function Hero() {
  return (
    <section className="bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <span className="text-orange-400 font-semibold uppercase tracking-widest text-sm">
            Welcome to Z-Shop
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mt-5">
            Discover Your
            <span className="text-orange-500"> Perfect Style.</span>
          </h1>

          <p className="text-gray-300 text-lg mt-6 leading-relaxed max-w-lg">
            Explore premium products, discover amazing deals
            and enjoy a better online shopping experience.
          </p>

          <a
            href="#products"
            className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition"
          >
            Shop Now →
          </a>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
            alt="Modern shopping collection"
            className="w-full h-80 md:h-[430px] object-cover rounded-3xl shadow-2xl"
          />

          <div className="absolute bottom-5 left-5 bg-white text-slate-900 px-5 py-3 rounded-xl shadow-lg">
            <p className="font-bold">Your Style, Your Choice</p>
            <p className="text-sm text-gray-500">Shop with confidence</p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
