import React from "react";
import "./ClientLandingPage.css";
import FilterSidebar from "../../components/FilterSidebar";
import VendorCard from "../../components/VendorCard";
import vendors from "../../components/vendors";
import Pagination from "../../components/Pagination";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";


const vendorsPerPage=6
export default function ClientLandingPage() {
  const [currentPage,setCurrentPage]=useState(1);
  const lastIndex = currentPage * vendorsPerPage;
  const firstIndex = lastIndex - vendorsPerPage;

  const currentVendors = vendors.slice(firstIndex, lastIndex);
  return (
    <>
    <Navbar/>
    <div className="browse-page-CLP">
      
      <section className="hero-CLP">

        <h1>Premium Vendors</h1>

        <p>
          Discover the finest curators for your most prestigious events,
          from floral designers to elite caterers.
        </p>

      </section>

      <div className="browse-container-CLP">

        <FilterSidebar />

        <main className="vendor-section-CLP">

          <div className="vendor-top-CLP">

            <p>
              Showing <strong>{vendors.length}</strong> luxury vendors
            </p>

            <select>

              <option>Recommended</option>

              <option>Top Rated</option>

              <option>Price Low → High</option>

              <option>Price High → Low</option>

            </select>

          </div>

          <div className="vendor-grid-CLP">

              {currentVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}

          </div>

          <Pagination
             totalVendors={vendors.length}
             vendorsPerPage={vendorsPerPage}
             currentPage={currentPage}
             setCurrentPage={setCurrentPage}
          />

        </main>

      </div>
      
    </div>
    <Footer/>
    </>
  );
}