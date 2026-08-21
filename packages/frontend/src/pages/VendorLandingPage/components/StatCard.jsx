import "./StatCard.css";

function StatCard({ icon, iconVariant = "revenue", label, value, trend, trendDirection = "up" }) {
  return (
    <div className="stat-card-VLP">
      <div className="stat-card-top-VLP">
        <span className={`stat-icon-VLP stat-icon-${iconVariant}-VLP`}>
          {icon}
        </span>

        {trend && (
          <span className={`stat-trend-VLP stat-trend-${trendDirection}-VLP`}>
            {trend}
          </span>
        )}
      </div>

      <p className="stat-label-VLP">{label}</p>
      <h3 className="stat-value-VLP">{value}</h3>
    </div>
  );
}

export default StatCard;
