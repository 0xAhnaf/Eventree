import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/eventree-logo2.png";


function Navbar() {

  const [open, setOpen] = useState(false);


  return (
    <header className="bg-white shadow-sm">


      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">


        {/* Logo Section */}
        <a 
          href="#home"
          className="flex shrink-0 items-center gap-2"
        >

          <img 
            src={logo}
            alt="EVENTREE Logo"
            className="h-10 w-auto object-contain"
          />


          <span className="font-serif text-xl font-bold tracking-wide text-[#003d2c]">
            EVENTREE
          </span>

        </a>





        {/* Desktop Menu */}
        <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">


          <a 
            href="#home"
            className="text-sm text-gray-700 transition hover:text-[#003d2c]"
          >
            Home
          </a>


          <a 
            href="#"
            className="text-sm text-gray-700 transition hover:text-[#003d2c]"
          >
            Browse Vendors
          </a>


          <a 
            href="#categories"
            className="text-sm text-gray-700 transition hover:text-[#003d2c]"
          >
            Categories
          </a>


          <a 
            href="#how-it-works"
            className="text-sm text-gray-700 transition hover:text-[#003d2c]"
          >
            How It Works
          </a>


        </div>






        {/* Auth Buttons */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">


          {/* Login */}
          <button
            className="
            rounded-md
            border-2
            border-[#003d2c]
            bg-[#fffaf5]
            px-6
            py-2
            text-sm
            font-semibold
            text-[#003d2c]
            transition-all
            hover:bg-[#003d2c]
            hover:text-white
            "
          >
            Login
          </button>





          {/* Register */}
          <button
            className="
            rounded-md
            border-2
            border-[#003d2c]
            bg-[#fffaf5]
            px-5
            py-2
            text-sm
            font-semibold
            text-[#003d2c]
            transition-all
            hover:bg-[#003d2c]
            hover:text-white
            "
          >
            Register
          </button>


        </div>






        {/* Mobile Button */}
        <button
          className="text-[#003d2c] lg:hidden"
          onClick={() => setOpen(!open)}
        >

          {open ? <X size={28}/> : <Menu size={28}/>}

        </button>


      </nav>







      {/* Mobile Menu */}
      {open && (

        <div className="border-t bg-white px-6 py-5 lg:hidden">


          <div className="flex flex-col gap-5">


            <a href="#home" className="text-gray-700">
              Home
            </a>


            <a href="#" className="text-gray-700">
              Browse Vendors
            </a>


            <a href="#categories" className="text-gray-700">
              Categories
            </a>


            <a href="#how-it-works" className="text-gray-700">
              How It Works
            </a>





            <button
              className="
              rounded-md
              border-2
              border-[#d6b36a]
              px-5
              py-2
              text-left
              font-semibold
              text-[#003d2c]
              "
            >
              Login
            </button>





            <button
              className="
              rounded-md
              bg-[#003d2c]
              px-5
              py-2
              text-left
              font-semibold
              text-white
              "
            >
              Register
            </button>


          </div>


        </div>

      )}


    </header>
  )
}


export default Navbar;