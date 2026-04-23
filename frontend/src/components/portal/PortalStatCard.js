import React from "react";
import trendDark from "../../assets/trend-dark.png";
import barChartDark from "../../assets/bar-chart-dark.png";
import pieChartColor from "../../assets/pie-chart-color.png";
import pieChartColorTwo from "../../assets/pie-chart-color-2.png";
import pieChartColorThree from "../../assets/pie-chart-color-3.png";
import barChartColor from "../../assets/bar-chart-color.png";

const statIcons = [
  trendDark,
  barChartDark,
  pieChartColor,
  pieChartColorTwo,
  pieChartColorThree,
  barChartColor,
];

function PortalStatCard({ item, index }) {
  const iconIndex =
    Number.isInteger(index) ? index :
    Number.isInteger(item?.id) ? item.id - 1 :
    0;

  const icon = statIcons[iconIndex % statIcons.length];

  return (
    <div className="portal-stat-card">
      <div className="portal-stat-card__icon-image-wrap">
        <img
          src={icon}
          alt={item.title}
          className="portal-stat-card__icon-image"
        />
      </div>

      <div className="portal-stat-card__content">
        <h3>{item.title}</h3>
        <strong>{item.value}</strong>
        {item.subtitle && <p>{item.subtitle}</p>}
      </div>
    </div>
  );
}

export default PortalStatCard;