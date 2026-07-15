import { motion } from "framer-motion";


function Hero() {
  return (
    <section id="home" className="relative flex min-h-[650px] items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3')",
        }}
      ></div>


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>


      {/* Content Animation */}
      <motion.div

        initial={{ opacity: 0, y: 40 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.8 }}

        className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"

      >

        <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#d6b36a]">
          Smart Event Marketplace
        </p>


        <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
          Plan Your Perfect Event With Trusted Vendors
        </h1>


        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-200 md:text-lg">
          Find, compare, and book verified event professionals in one place.
        </p>


        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">


          <button
            className="rounded-md bg-[#003d2c] px-8 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-[#00513b]"
          >
            Browse Vendors
          </button>


          <button
            className="rounded-md border border-white px-8 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#003d2c]"
          >
            Become a Vendor
          </button>


        </div>


      </motion.div>


    </section>
  )
}


export default Hero