import "./ProblemsSection.css";

function ProblemsSection() {
  const problems = [
    {
      number: "01",
      title: "Finding Trusted Vendors Is Difficult",
      description:
        "People often search across different platforms, social media pages, and personal recommendations to find reliable event vendors.",
    },
    {
      number: "02",
      title: "Comparing Services Takes Time",
      description:
        "It is difficult to compare prices, packages, reviews, and services when vendor information is scattered.",
    },
    {
      number: "03",
      title: "Availability Is Uncertain",
      description:
        "Customers may spend hours communicating with vendors only to discover their preferred date is unavailable.",
    },
    {
      number: "04",
      title: "Communication Becomes Complicated",
      description:
        "Managing calls, messages, requirements, and booking details across different platforms creates confusion.",
    },
  ];

  return (
    <section className="problems-section">
      <div className="problems-container">
        {/* Heading */}
        <div className="problems-header">
          <p className="problems-subtitle">The Challenge</p>

          <h2 className="problems-title">
            Event Planning Should Not Feel Complicated
          </h2>

          <p className="problems-header-desc">
            Planning an event is exciting, but finding the right vendors,
            comparing options, and managing communication often becomes
            stressful.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="problems-grid">
          {problems.map((problem) => (
            <div key={problem.number} className="problem-card">
              <div className="problem-card-content">
                <div className="problem-number">{problem.number}</div>

                <div>
                  <h3 className="problem-card-title">{problem.title}</h3>

                  <p className="problem-card-desc">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemsSection;
