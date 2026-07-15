function HowItWorks() {

  const steps = [
    {
      number: "01",
      title: "Search Vendors",
      description:
        "Explore professional vendors from different categories including catering, venues, decoration, and photography."
    },
    {
      number: "02",
      title: "Filter & Compare",
      description:
        "Compare vendors based on category, budget, location, ratings, services, and availability."
    },
    {
      number: "03",
      title: "Select Your Vendor",
      description:
        "Choose the vendor that matches your event requirements and preferences."
    },
    {
      number: "04",
      title: "Checkout & Payment",
      description:
        "Complete your booking process through a secure and simple payment system."
    },
    {
      number: "05",
      title: "Unlock Contact & Chat",
      description:
        "After payment, access vendor contact details and communicate directly through the platform."
    }
  ];


  return (
    <section id="how-it-works" className="bg-white px-6 py-20">

      <div className="mx-auto max-w-7xl">


        {/* Heading */}
        <div className="mb-14 text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-[#b0873c]">
            Simple Process
          </p>


          <h2 className="mt-3 font-serif text-3xl font-bold text-[#003d2c] md:text-5xl">
            How EVENTREE Works
          </h2>


          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            From discovering vendors to connecting with professionals,
            EVENTREE makes event planning simple and organised.
          </p>

        </div>



        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-5">


          {steps.map((step, index) => (

            <div
              key={step.number}
              className="relative text-center"
            >

              {/* Number */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#003d2c] font-serif text-xl font-bold text-white">
                {step.number}
              </div>


              <h3 className="font-serif text-xl font-bold text-[#003d2c]">
                {step.title}
              </h3>


              <p className="mt-3 text-sm leading-6 text-gray-600">
                {step.description}
              </p>


              {/* Line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[65%] top-8 hidden h-[2px] w-full bg-[#d6b36a] md:block"></div>
              )}

            </div>

          ))}


        </div>


      </div>

    </section>
  )
}


export default HowItWorks