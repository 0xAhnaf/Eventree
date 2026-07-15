function ProblemsSection() {

  const problems = [
    {
      number: "01",
      title: "Finding Trusted Vendors Is Difficult",
      description:
        "People often search across different platforms, social media pages, and personal recommendations to find reliable event vendors."
    },
    {
      number: "02",
      title: "Comparing Services Takes Time",
      description:
        "It is difficult to compare prices, packages, reviews, and services when vendor information is scattered."
    },
    {
      number: "03",
      title: "Availability Is Uncertain",
      description:
        "Customers may spend hours communicating with vendors only to discover their preferred date is unavailable."
    },
    {
      number: "04",
      title: "Communication Becomes Complicated",
      description:
        "Managing calls, messages, requirements, and booking details across different platforms creates confusion."
    }
  ];


  return (
    <section className="bg-white px-6 py-20">

      <div className="mx-auto max-w-7xl">


        {/* Heading */}
        <div className="mb-14 max-w-3xl">

          <p className="text-sm uppercase tracking-[0.3em] text-[#b0873c]">
            The Challenge
          </p>


          <h2 className="mt-3 font-serif text-3xl font-bold text-[#003d2c] md:text-5xl">
            Event Planning Should Not Feel Complicated
          </h2>


          <p className="mt-5 leading-7 text-gray-600">
            Planning an event is exciting, but finding the right vendors,
            comparing options, and managing communication often becomes
            stressful.
          </p>

        </div>



        {/* Problems Grid */}
        <div className="grid gap-6 md:grid-cols-2">


          {problems.map((problem)=>(
            
            <div
              key={problem.number}
              className="group rounded-2xl border border-[#eee3d7] bg-[#fffaf5] p-8 transition hover:-translate-y-2"
            >


              <div className="flex items-start gap-5">


                <div className="font-serif text-4xl font-bold text-[#d6b36a]">
                  {problem.number}
                </div>


                <div>

                  <h3 className="font-serif text-2xl font-bold text-[#003d2c]">
                    {problem.title}
                  </h3>


                  <p className="mt-3 leading-7 text-gray-600">
                    {problem.description}
                  </p>

                </div>


              </div>


            </div>

          ))}


        </div>


      </div>


    </section>
  )
}


export default ProblemsSection