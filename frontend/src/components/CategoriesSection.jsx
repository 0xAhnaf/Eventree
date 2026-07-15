function CategoriesSection() {

  const categories = [
    {
      icon: "🍽️",
      title: "Caterers",
      description:
        "Professional food and beverage services for weddings, parties, and corporate events."
    },
    {
      icon: "🏛️",
      title: "Event Venues",
      description:
        "Discover beautiful indoor and outdoor locations for every type of celebration."
    },
    {
      icon: "🌸",
      title: "Decorations",
      description:
        "Creative themes, floral arrangements, stage design, and complete event styling."
    },
    {
      icon: "📷",
      title: "Photography & Videography",
      description:
        "Capture your special moments with experienced visual storytellers."
    },
    {
      icon: "🎤",
      title: "Event Management",
      description:
        "Complete planning and coordination services for stress-free events."
    }
  ];


  return (
    
    <section id="categories" className="bg-[#fffaf5] px-6 py-20">

      <div className="mx-auto max-w-7xl">


        {/* Heading */}
        <div className="mb-14 text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-[#b0873c]">
            Explore Services
          </p>


          <h2 className="mt-3 font-serif text-3xl font-bold text-[#003d2c] md:text-5xl">
            Find The Right Vendor For Your Event
          </h2>


          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            From food and venues to decoration and photography,
            EVENTREE connects you with professional event specialists.
          </p>

        </div>



        {/* Category Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">


          {categories.map((category)=> (

            <div
              key={category.title}
              className="group rounded-2xl border border-[#eee3d7] bg-white p-6 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
            >


              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f0eb] text-3xl transition group-hover:bg-[#003d2c]">
                {category.icon}
              </div>


              <h3 className="font-serif text-xl font-bold text-[#003d2c]">
                {category.title}
              </h3>


              <p className="mt-3 text-sm leading-6 text-gray-600">
                {category.description}
              </p>


              <button className="mt-5 text-sm font-semibold text-[#b0873c]">
                Explore →
              </button>


            </div>

          ))}


        </div>


      </div>

    </section>
  )
}


export default CategoriesSection