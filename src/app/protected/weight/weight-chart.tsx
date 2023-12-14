import React from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

interface WeightData {
	date: string;
	weight: number;
}

interface WeightChartProps {
	data: WeightData[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
	const chartData = {
		labels: data.map((item) => item.date),
		datasets: [
			{
				label: "Weight",
				data: data.map((item) => item.weight),
				borderColor: "#2D9CDB",
				tension: 0.1,
				pointRadius: 5, // Adjust the radius of the points
				pointBackgroundColor: "#fff", // Point fill color
				pointBorderColor: "#fff", // Point border color
				pointBorderWidth: 2,
			},
		],
	};
	const chartOptions = {
		scales: {
			x: {
				ticks: {
					color: "#FFF",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.1)", // Change X-axis gridline colors
					// Other gridline properties...
				},
			},
			y: {
				grid: {
					color: "rgba(255, 255, 255, 0.1)", // Change Y-axis gridline colors
					// Other gridline properties...
				},
				ticks: {
					color: "#FFF",
				},
			},
		},
		// ... other options
	};

	return <Line data={chartData} options={chartOptions} />;
};

export default WeightChart;
