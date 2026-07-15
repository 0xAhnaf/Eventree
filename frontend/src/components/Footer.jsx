function Footer() {

  return (
    <footer className="bg-[#00291f] px-6 py-14 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">


        {/* Brand */}
        <div>

          <h2 className="font-serif text-3xl font-bold">
            EVENTREE
          </h2>


          <p className="mt-4 leading-7 text-gray-300">
            A smart event vendor marketplace connecting customers with
            professional event service providers for seamless planning and
            memorable experiences.
          </p>

        </div>



        {/* Quick Links */}
        <div>

          <h3 className="mb-5 font-serif text-xl font-bold">
            Quick Links
          </h3>


          <ul className="space-y-3 text-gray-300">

            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Home
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Browse Vendors
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Categories
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                How It Works
              </a>
            </li>

          </ul>

        </div>




        {/* For Users */}
        <div>

          <h3 className="mb-5 font-serif text-xl font-bold">
            For Users
          </h3>


          <ul className="space-y-3 text-gray-300">

            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Customer Login
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Register
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                My Bookings
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Favorites
              </a>
            </li>

          </ul>

        </div>




        {/* Vendor */}
        <div>

          <h3 className="mb-5 font-serif text-xl font-bold">
            For Vendors
          </h3>


          <ul className="space-y-3 text-gray-300">

            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Become a Vendor
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Vendor Dashboard
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Subscription
              </a>
            </li>


            <li>
              <a href="#" className="hover:text-[#d6b36a]">
                Contact Support
              </a>
            </li>

          </ul>

        </div>


      </div>




      {/* Bottom */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-sm text-gray-400">

        © 2026 EVENTREE. All rights reserved.

      </div>


    </footer>
  )
}


export default Footer