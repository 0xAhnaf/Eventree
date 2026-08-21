import {
  Utensils,
  Landmark,
  Flower2,
  Camera,
  Mic2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "./CategoriesSection.css";

function CategoriesSection() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Utensils,
      title: "Caterers",
      categoryValue: "Caterers",
      description:
        "Professional food and beverage services for weddings, parties, and corporate events.",
    },
    {
      icon: Landmark,
      title: "Event Venues",
      categoryValue: "Event Venues",
      description:
        "Discover beautiful indoor and outdoor locations for every type of celebration.",
    },
    {
      icon: Flower2,
      title: "Decorations",
      categoryValue: "Decorations",
      description:
        "Creative themes, floral arrangements, stage design, and complete event styling.",
    },
    {
      icon: Camera,
      title: "Photography & Videography",
      categoryValue: "Photography & Videography",
      description:
        "Capture your special moments with experienced visual storytellers.",
    },
    {
      icon: Mic2,
      title: "Event Management",
      categoryValue: "Event Management",
      description:
        "Complete planning and coordination services for stress-free events.",
    },
  ];

  const handleCategoryClick = (category) => {
    navigate(
      `/browse-vendor?category=${encodeURIComponent(category)}`
    );
  };

  return (
    <section id="categories" className="categories-section">
      <div className="categories-container">

        {/* Heading */}
        <div className="categories-header">
          <p className="categories-subtitle">
            Explore Services
          </p>

          <h2 className="categories-title">
            Find The Right Vendor For Your Event
          </h2>

          <p className="categories-description">
            From food and venues to decoration and photography, EVENTREE connects
            you with professional event specialists.
          </p>
        </div>

        {/* Category Cards */}
        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div key={category.title} className="category-card">
                <div className="category-icon">
                  <Icon size={28} />
                </div>

                <h3 className="category-card-title">
                  {category.title}
                </h3>

                <p className="category-card-desc">
                  {category.description}
                </p>

                <button
                  type="button"
                  className="category-btn"
                  onClick={() =>
                    handleCategoryClick(category.categoryValue)
                  }
                >
                  Explore →
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default CategoriesSection;