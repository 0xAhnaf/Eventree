import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./ClientLandingPage.css";
import FilterSidebar from "../../components/FilterSidebar";
import VendorCard from "../../components/VendorCard";
import Pagination from "../../components/Pagination";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchPublicVendors } from "../../services/vendorApi.js";

const vendorsPerPage = 6;

const validCategories = [
  "Caterers",
  "Event Venues",
  "Decorations",
  "Photography & Videography",
  "Event Management",
  "Music & Entertainment",
];

const DEFAULT_PRICE_MAX = 50000;

// vendor.price is stored as a display string like "৳15,000" — pull out
// just the digits so it can be compared against the price filter.
const parsePrice = (price) => {
  const numeric = Number(String(price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const getStartingPrice = (vendor) => {
  if (vendor.startingPrice !== null && vendor.startingPrice !== undefined) {
    const startingPrice = Number(vendor.startingPrice);
    return Number.isFinite(startingPrice) ? startingPrice : null;
  }

  const parsedPrice = parsePrice(vendor.price);
  return parsedPrice > 0 ? parsedPrice : null;
};

export default function ClientLandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sortOption, setSortOption] = useState("recommended");

  const categoriesFromUrl = searchParams
    .getAll("category")
    .filter((category) => validCategories.includes(category));

  const [selectedCategories, setSelectedCategories] =
    useState(categoriesFromUrl);

  const [appliedFilters, setAppliedFilters] = useState({
    priceMax: DEFAULT_PRICE_MAX,
    minRating: 0,
    availabilityDate: "",
  });

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setLoadError("");

    fetchPublicVendors({
      availabilityDate: appliedFilters.availabilityDate,
    })
      .then((realVendors) => {
        if (isMounted) {
          setVendors(realVendors);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setVendors([]);
          setLoadError(error.message || "Could not load vendors.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [appliedFilters.availabilityDate]);

  useEffect(() => {
    setSelectedCategories(categoriesFromUrl);
    setCurrentPage(1);
  }, [searchParams.toString()]);

  const updateCategoryParams = (categories) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("category");

    categories.forEach((category) => {
      newSearchParams.append("category", category);
    });

    setSearchParams(newSearchParams);
  };

  const handleApplyFilters = ({ categories, ...filters }) => {
    setSelectedCategories(categories);
    setAppliedFilters(filters);
    setCurrentPage(1);
    updateCategoryParams(categories);
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(
          (category) =>
            vendor.category?.trim().toLowerCase() ===
            category.trim().toLowerCase(),
        );

      const vendorPrice = getStartingPrice(vendor);
      const matchesPrice =
        appliedFilters.priceMax >= DEFAULT_PRICE_MAX ||
        vendorPrice === null ||
        vendorPrice <= appliedFilters.priceMax;

      const matchesRating =
        appliedFilters.minRating === 0 ||
        (vendor.rating ?? 0) >= appliedFilters.minRating;

      return matchesCategory && matchesPrice && matchesRating;
    }).sort((firstVendor, secondVendor) => {
      if (sortOption === "top-rated") {
        return (secondVendor.rating ?? 0) - (firstVendor.rating ?? 0);
      }

      if (sortOption === "price-low-high") {
        return parsePrice(firstVendor.price) - parsePrice(secondVendor.price);
      }

      if (sortOption === "price-high-low") {
        return parsePrice(secondVendor.price) - parsePrice(firstVendor.price);
      }

      return String(firstVendor.name).localeCompare(String(secondVendor.name));
    });
  }, [vendors, selectedCategories, appliedFilters, sortOption]);

  const lastIndex = currentPage * vendorsPerPage;
  const firstIndex = lastIndex - vendorsPerPage;

  const currentVendors = filteredVendors.slice(firstIndex, lastIndex);

  return (
    <>
      <Navbar />

      <div className="browse-page-CLP">
        <section className="hero-CLP">
          <h1>Premium Vendors</h1>

          <p>
            Discover the finest curators for your most prestigious events, from
            floral designers to elite caterers.
          </p>
        </section>

        <div className="browse-container-CLP">
          <FilterSidebar
            selectedCategories={selectedCategories}
            priceMax={appliedFilters.priceMax}
            minRating={appliedFilters.minRating}
            availabilityDate={appliedFilters.availabilityDate}
            onApply={handleApplyFilters}
          />

          <main className="vendor-section-CLP">
            <div className="vendor-top-CLP">
              <p>
                Showing <strong>{filteredVendors.length}</strong>{" "}
                {selectedCategories.length === 0
                  ? "luxury vendors"
                  : "selected category vendors"}
              </p>

              <select
                value={sortOption}
                onChange={(event) => {
                  setSortOption(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="recommended">Recommended</option>

                <option value="top-rated">Top Rated</option>

                <option value="price-low-high">Price Low → High</option>

                <option value="price-high-low">Price High → Low</option>
              </select>
            </div>

            {selectedCategories.length > 0 && (
              <div className="selected-categories-CLP">
                <p>
                  Categories: <strong>{selectedCategories.join(", ")}</strong>
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="vendor-empty-CLP">
                <p>Loading vendors...</p>
              </div>
            ) : loadError ? (
              <div className="vendor-empty-CLP">
                <p>{loadError}</p>
              </div>
            ) : currentVendors.length > 0 ? (
              <div className="vendor-grid-CLP">
                {currentVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} eventId={searchParams.get("eventId")} />
                ))}
              </div>
            ) : (
              <div className="vendor-empty-CLP">
                <p>No vendors found in the selected categories.</p>
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
