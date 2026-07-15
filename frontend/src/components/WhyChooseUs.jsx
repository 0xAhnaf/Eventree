function WhyChooseUs() {

  const features = [
    {
      icon: "✓",
      title: "Trusted Event Vendors",
      description:
        "Discover professional vendors with organised profiles, services, and business information."
    },
    {
      icon: "⚡",
      title: "Easy Vendor Discovery",
      description:
        "Find the right vendor quickly using categories, search, filters, and preferences."
    },
    {
      icon: "🔍",
      title: "Smart Comparison",
      description:
        "Compare different vendors based on services, pricing, and availability before deciding."
    },
    {
      icon: "🔒",
      title: "Secure Booking Process",
      description:
        "Manage your booking journey through a simple and transparent platform experience."
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description:
        "Unlock vendor contact details and communicate easily after completing payment."
    },
    {
      icon: "📊",
      title: "Better Vendor Management",
      description:
        "Vendors can manage bookings, schedules, profiles, and business growth efficiently."
    }
  ];


  return (
    <section className="bg-[#003d2c] px-6 py-20 text-white">

      <div className="mx-auto max-w-7xl">


        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b36a]">
            Why EVENTREE
          </p>


          <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
            Making Event Planning Simple & Reliable
          </h2>


          <p className="mt-5 leading-7 text-gray-300">
            EVENTREE brings customers and professional vendors together
            through a smarter and more organised event planning experience.
          </p>

        </div>



        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


          {features.map((feature)=>(
            
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-2 hover:bg-white/10"
            >

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#d6b36a] text-xl font-bold text-[#003d2c]">
                {feature.icon}
              </div>


              <h3 className="font-serif text-2xl font-bold">
                {feature.title}
              </h3>


              <p className="mt-4 leading-7 text-gray-300">
                {feature.description}
              </p>

            </div>

          ))}


        </div>


      </div>

    </section>
  )
}


export default WhyChooseUs