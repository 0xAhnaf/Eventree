import "./RevenueChart.css";

const defaultData = [
  { day: "Mon", height: 40 },
  { day: "Tue", height: 65 },
  { day: "Wed", height: 50 },
  { day: "Thu", height: 80 },
  { day: "Fri", height: 95 },
  { day: "Sat", height: 70 },
  { day: "Sun", height: 85 },
];

function RevenueChart({ data = defaultData, highlightDay = "Fri" }) {
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

      <div className="revenue-chart-bars-VLP">
        {data.map((item) => (
          <div
            key={item.day}
            className={`revenue-bar-VLP ${item.day === highlightDay ? "revenue-bar-active-VLP" : ""}`}
            style={{ height: `${item.height}%` }}
          ></div>
        ))}
      </div>

      <div className="revenue-chart-labels-VLP">
        {data.map((item) => (
          <span
            key={item.day}
            className={`revenue-label-VLP ${item.day === highlightDay ? "revenue-label-active-VLP" : ""}`}
          >
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}

export default RevenueChart;
