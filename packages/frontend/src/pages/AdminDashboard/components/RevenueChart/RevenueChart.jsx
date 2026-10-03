import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import "./RevenueChart.css";

const RevenueChart = ({ data = [] }) => {
  const revenueData = data;

  const barColors = [
    "#003d2c",
    "#1f5c49",
    "#4b806d",
    "#6fa08c",
    "#b8903d",
    "#d4b56a",
  ];

  const formatCurrency = (value) => {
    return `৳${value / 1000}k`;
  };

  const formatFullCurrency = (value) => {
    return `৳${value.toLocaleString("en-BD")}`;
  };

  return (
    <div className="revenue-chart-container">
      <div className="revenue-chart-header">
        <div>
          <h3>Revenue Analytics</h3>

          <p>Monthly platform earnings overview</p>
        </div>

        <span className="revenue-chart-period">Last 6 months</span>
      </div>

      <div className="revenue-chart">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={revenueData}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

            <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12 }} />

            <YAxis
              tickFormatter={formatCurrency}
              tickLine={false}
              width={55}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => [formatFullCurrency(value), "Revenue"]}
            />

            <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
