function JourneySection() {
  return (
    <section className="bg-[#fffaf5] px-6 py-20">

      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-12 text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-[#b0873c]">
            Simple Experience
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold text-[#003d2c] md:text-4xl">
            Your Journey Begins Here
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Whether you are planning a special event or growing your event
            business, EVENTREE connects you with the right opportunities.
          </p>

        </div>


        {/* Two Cards */}
        <div className="grid gap-8 md:grid-cols-2">


          {/* Customer */}
          <div className="rounded-2xl border border-[#eee3d7] bg-white p-10 shadow-sm transition hover:-translate-y-2">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f0eb] text-2xl">
              ✨
            </div>


            <h3 className="font-serif text-3xl font-bold text-[#003d2c]">
              Create Your Celebration
            </h3>


            <p className="mt-5 leading-7 text-gray-600">
              Find trusted event vendors, compare services, check availability,
              and book everything you need for your special moments.
            </p>


            <button className="mt-7 rounded-md bg-[#003d2c] px-6 py-3 text-sm font-medium text-white hover:bg-[#00513b]">
              Start Planning
            </button>


          </div>



          {/* Vendor */}
          <div className="rounded-2xl bg-[#003d2c] p-10 text-white shadow-lg transition hover:-translate-y-2">


            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#d6b36a] text-2xl">
              ⭐
            </div>


            <h3 className="font-serif text-3xl font-bold">
              Grow Your Event Business
            </h3>


            <p className="mt-5 leading-7 text-gray-200">
              Showcase your services, manage bookings, update availability,
              and connect with customers looking for professional vendors.
            </p>


            <button className="mt-7 rounded-md bg-[#d6b36a] px-6 py-3 text-sm font-medium text-[#003d2c] hover:bg-[#e4c37d]">
              Join as Vendor
            </button>


          </div>


        </div>

      </div>

    </section>
  )
}

export default JourneySection