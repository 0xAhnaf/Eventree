import "./RevenueChart.css";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function RevenueChart({ data, highlightDay, loading = false }) {
  const chartData =
    data && Array.isArray(data) && data.length > 0
      ? data
      : DAYS_OF_WEEK.map((day) => ({
          day,
          height: 0,
          revenue: 0,
          formatted_revenue: "৳0.00",
        }));

  const activeDay = highlightDay || "Mon";

  return (
    <div className="revenue-chart-VLP">
      <div className="revenue-chart-header-VLP">
        <h4 className="revenue-chart-title-VLP">Revenue Growth</h4>

        <div className="revenue-chart-legend-VLP">
          <span className="legend-item-VLP">
            <span className="legend-dot-VLP legend-dot-revenue-VLP"></span>
            Revenue
          </span>
          <span className="legend-item-VLP">
            <span className="legend-dot-VLP legend-dot-projection-VLP"></span>
            Projections
          </span>
        </div>
      </div>

      {loading ? (
        <div className="revenue-chart-bars-VLP">
          {DAYS_OF_WEEK.map((day, idx) => (
            <div
              key={day}
              className="revenue-bar-VLP revenue-skeleton-bar-VLP"
              style={{
                height: `${25 + ((idx * 15) % 50)}%`,
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <div className="revenue-chart-bars-VLP">
          {chartData.map((item) => {
            const isHighlight = item.day === activeDay;
            const tooltip = `${item.day}: ${item.formatted_revenue || (item.revenue != null ? `৳${Number(item.revenue).toLocaleString("en-BD")}` : `${item.height || 0}%`)}`;

            return (
              <div
                key={item.day}
                className={`revenue-bar-VLP ${isHighlight ? "revenue-bar-active-VLP" : ""}`}
                style={{
                  height: item.height > 0 ? `${item.height}%` : "6px",
                  opacity: item.height > 0 ? 1 : 0.35,
                }}
                title={tooltip}
              ></div>
            );
          })}
        </div>
      )}

      <div className="revenue-chart-labels-VLP">
        {DAYS_OF_WEEK.map((day) => (
          <span
            key={day}
            className={`revenue-label-VLP ${!loading && day === activeDay ? "revenue-label-active-VLP" : ""}`}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

export default RevenueChart;
