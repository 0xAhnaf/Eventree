function CTASection() {

  return (

    <section id="vendor" className="bg-[#fffaf5] px-6 py-20">

      <div className="mx-auto max-w-5xl rounded-3xl bg-[#003d2c] px-8 py-16 text-center text-white md:px-16">


        <p className="text-sm uppercase tracking-[0.3em] text-[#d6b36a]">
          Start Your Journey
        </p>


        <h2 className="mt-4 font-serif text-3xl font-bold md:text-5xl">
          Ready To Create Your Perfect Event?
        </h2>


        <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-300">
          Whether you are planning an unforgettable event or growing your
          event business, EVENTREE helps you take the next step.
        </p>



        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">


          <button className="rounded-md bg-[#d6b36a] px-8 py-3 font-semibold text-[#003d2c] hover:bg-[#e4c37d]">
            Browse Vendors
          </button>


          <button className="rounded-md border border-white px-8 py-3 font-semibold text-white hover:bg-white hover:text-[#003d2c]">
            Become a Vendor
          </button>


        </div>


      </div>

    </section>

  )

}


export default CTASection