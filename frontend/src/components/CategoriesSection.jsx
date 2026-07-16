import "./CategoriesSection.css"; 

function CategoriesSection() {
  const categories = [
    {
      icon: "🍽️",
      title: "Caterers",
      description:
        "Professional food and beverage services for weddings, parties, and corporate events.",
    },
    {
      icon: "🏛️",
      title: "Event Venues",
      description:
        "Discover beautiful indoor and outdoor locations for every type of celebration.",
    },
    {
      icon: "🌸",
      title: "Decorations",
      description:
        "Creative themes, floral arrangements, stage design, and complete event styling.",
    },
    {
      icon: "📷",
      title: "Photography & Videography",
      description:
        "Capture your special moments with experienced visual storytellers.",
    },
    {
      icon: "🎤",
      title: "Event Management",
      description:
        "Complete planning and coordination services for stress-free events.",
    },
  ];

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
          {categories.map((category) => (
            <div key={category.title} className="category-card">
              <div className="category-icon">
                {category.icon}
              </div>

              <h3 className="category-card-title">
                {category.title}
              </h3>

              <p className="category-card-desc">
                {category.description}
              </p>

              <button className="category-btn">
                Explore →
              </button>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

export default CategoriesSection;