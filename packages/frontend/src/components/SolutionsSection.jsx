import "./SolutionsSection.css";

function SolutionsSection() {
  const solutions = [
    {
      number: "01",
      title: "One Platform For Every Event Need",
      description:
        "Find caterers, venues, decorators, photographers, and event managers in one organised marketplace.",
    },
    {
      number: "02",
      title: "Smart Search & Easy Comparison",
      description:
        "Search vendors by category, location, budget, rating, and availability to make better decisions.",
    },
    {
      number: "03",
      title: "Verified Vendor Information",
      description:
        "Explore vendor profiles with services, pricing, portfolio images, and important business details.",
    },
    {
      number: "04",
      title: "Simple Booking Experience",
      description:
        "Select your preferred vendor, complete payment, and unlock direct communication through the platform.",
    },
    {
      number: "05",
      title: "Availability Management",
      description:
        "Check vendor schedules and avoid conflicts before making your final booking decision.",
    },
    {
      number: "06",
      title: "Better Communication",
      description:
        "Keep booking information and conversations organised through a dedicated platform experience.",
    },
  ];

  return (
    <section className="solutions-section">
      <div className="solutions-container">
        {/* Heading */}
        <div className="solutions-header">
          <p className="solutions-subtitle">Our Solution</p>

          <h2 className="solutions-title">A Smarter Way To Plan Events</h2>

          <p className="solutions-header-desc">
            EVENTREE simplifies the entire event planning journey by connecting
            customers with professional vendors through one seamless platform.
          </p>
        </div>

        {/* Solution Cards */}
        <div className="solutions-grid">
          {solutions.map((solution) => (
            <div key={solution.number} className="solution-card">
              <div className="solution-number">{solution.number}</div>

              <h3 className="solution-card-title">{solution.title}</h3>

              <p className="solution-card-desc">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionsSection;
