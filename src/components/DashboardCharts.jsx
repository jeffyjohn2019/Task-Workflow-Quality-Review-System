import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function DashboardCharts() {
    //  Bar Chart Data (Monthly Report)
    const barData = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: "Project 1",
                data: [4, 6, 8, 5, 9, 3, 7, 6, 5, 8, 4, 6],
                backgroundColor: "#e31a4c",
                borderRadius: 6,
            },
            {
                label: "Project 2",
                data: [3, 5, 6, 4, 7, 2, 6, 5, 4, 7, 3, 5],
                backgroundColor: "#4CAF50",
                borderRadius: 6,
            },
        ],
    };

    // Doughnut Chart Data (Project Status)
    const doughnutData = {
        labels: ["Completed", "Pending"],
        datasets: [
            {
                data: [12, 5],
                backgroundColor: ["#3b82f6", "#e31a4c"],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/*  Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                <h3 className="text-center text-sm font-bold mb-4">
                    Monthly Report
                </h3>
                <Bar data={barData} options={options} />
            </div>

            {/*  Doughnut Chart */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-sm font-bold mb-4 text-center">
                    Projects Status Report
                </h3>
                <Doughnut data={doughnutData} options={options} />
            </div>

        </div>
    );
}