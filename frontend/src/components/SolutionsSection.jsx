function SolutionsSection() {

  const solutions = [
    {
      number: "01",
      title: "One Platform For Every Event Need",
      description:
        "Find caterers, venues, decorators, photographers, and event managers in one organised marketplace."
    },
    {
      number: "02",
      title: "Smart Search & Easy Comparison",
      description:
        "Search vendors by category, location, budget, rating, and availability to make better decisions."
    },
    {
      number: "03",
      title: "Verified Vendor Information",
      description:
        "Explore vendor profiles with services, pricing, portfolio images, and important business details."
    },
    {
      number: "04",
      title: "Simple Booking Experience",
      description:
        "Select your preferred vendor, complete payment, and unlock direct communication through the platform."
    },
    {
      number: "05",
      title: "Availability Management",
      description:
        "Check vendor schedules and avoid conflicts before making your final booking decision."
    },
    {
      number: "06",
      title: "Better Communication",
      description:
        "Keep booking information and conversations organised through a dedicated platform experience."
    }
  ];


  return (
    <section className="bg-[#003d2c] px-6 py-20 text-white">

      <div className="mx-auto max-w-7xl">


        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b36a]">
            Our Solution
          </p>


          <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
            A Smarter Way To Plan Events
          </h2>


          <p className="mt-5 leading-7 text-gray-300">
            EVENTREE simplifies the entire event planning journey by
            connecting customers with professional vendors through one
            seamless platform.
          </p>

        </div>



        {/* Solution Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


          {solutions.map((solution)=>(

            <div
              key={solution.number}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-2 hover:bg-white/10"
            >

              <div className="mb-5 font-serif text-4xl font-bold text-[#d6b36a]">
                {solution.number}
              </div>


              <h3 className="font-serif text-2xl font-bold">
                {solution.title}
              </h3>


              <p className="mt-4 leading-7 text-gray-300">
                {solution.description}
              </p>


            </div>

          ))}


        </div>


      </div>

    </section>
  )
}


export default SolutionsSection