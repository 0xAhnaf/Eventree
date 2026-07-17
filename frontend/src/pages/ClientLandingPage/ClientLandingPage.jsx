import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./ClientLandingPage.css";
import FilterSidebar from "../../components/FilterSidebar";
import VendorCard from "../../components/VendorCard";
import vendors from "../../components/vendors";
import Pagination from "../../components/Pagination";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const vendorsPerPage = 6;

const validCategories = [
  "Caterers",
  "Event Venues",
  "Decorations",
  "Photography & Videography",
  "Event Management",
];

export default function ClientLandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const categoriesFromUrl = searchParams
    .getAll("category")
    .filter((category) => validCategories.includes(category));

  const [selectedCategories, setSelectedCategories] =
    useState(categoriesFromUrl);

  useEffect(() => {
    setSelectedCategories(categoriesFromUrl);
    setCurrentPage(1);
  }, [searchParams.toString()]);

  const updateCategoryParams = (categories) => {
    const newSearchParams = new URLSearchParams();

    categories.forEach((category) => {
      newSearchParams.append("category", category);
    });

    setSearchParams(newSearchParams);
  };

  const handleCategoryChange = (category) => {
    let updatedCategories;

    if (selectedCategories.includes(category)) {
      updatedCategories = selectedCategories.filter(
        (selectedCategory) => selectedCategory !== category
      );
    } else {
      updatedCategories = [...selectedCategories, category];
    }

    setSelectedCategories(updatedCategories);
    setCurrentPage(1);
    updateCategoryParams(updatedCategories);
  };

  const handleAllServices = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const filteredVendors = useMemo(() => {
    if (selectedCategories.length === 0) {
      return vendors;
    }

    return vendors.filter((vendor) =>
      selectedCategories.some(
        (category) =>
          vendor.category?.trim().toLowerCase() ===
          category.trim().toLowerCase()
      )
    );
  }, [selectedCategories]);

  const lastIndex = currentPage * vendorsPerPage;
  const firstIndex = lastIndex - vendorsPerPage;

  const currentVendors = filteredVendors.slice(
    firstIndex,
    lastIndex
  );

  return (
    <>
      <Navbar />

      <div className="browse-page-CLP">
        <section className="hero-CLP">
          <h1>Premium Vendors</h1>

          <p>
            Discover the finest curators for your most prestigious
            events, from floral designers to elite caterers.
          </p>
        </section>

        <div className="browse-container-CLP">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            onAllServices={handleAllServices}
          />

          <main className="vendor-section-CLP">
            <div className="vendor-top-CLP">
              <p>
                Showing{" "}
                <strong>{filteredVendors.length}</strong>{" "}
                {selectedCategories.length === 0
                  ? "luxury vendors"
                  : "selected category vendors"}
              </p>

              <select defaultValue="recommended">
                <option value="recommended">
                  Recommended
                </option>

                <option value="top-rated">
                  Top Rated
                </option>

                <option value="price-low-high">
                  Price Low → High
                </option>

                <option value="price-high-low">
                  Price High → Low
                </option>
              </select>
            </div>

            {selectedCategories.length > 0 && (
              <div className="selected-categories-CLP">
                <p>
                  Categories:{" "}
                  <strong>
                    {selectedCategories.join(", ")}
                  </strong>
                </p>
              </div>
            )}

            {currentVendors.length > 0 ? (
              <div className="vendor-grid-CLP">
                {currentVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                  />
                ))}
              </div>
            ) : (
              <div className="vendor-empty-CLP">
                <p>
                  No vendors found in the selected categories.
                </p>
              </div>
            )}

            {filteredVendors.length > vendorsPerPage && (
              <Pagination
                totalVendors={filteredVendors.length}
                vendorsPerPage={vendorsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}