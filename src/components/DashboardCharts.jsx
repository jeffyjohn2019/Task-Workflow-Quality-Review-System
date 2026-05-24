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

import { useSelector } from "react-redux";

export default function DashboardCharts() {
    const tasks = useSelector((state) => state.tasks.tasks);

    const monthlyCompleted = new Array(12).fill(0);
    tasks.forEach(t => {
        if ((t.status === "Completed" || t.status === "Reviewed") && t.endDate) {
            const date = new Date(t.endDate);
            if (!isNaN(date.getMonth())) {
                monthlyCompleted[date.getMonth()] += 1;
            }
        }
    });

    // Bar Chart Data (Monthly Report)
    const barData = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: "Completed Tasks",
                data: monthlyCompleted,
                backgroundColor: "#4CAF50",
                borderRadius: 6,
            }
        ],
    };

    const newCount = tasks.filter(t => t.status === "New").length;
    const pendingCount = tasks.filter(t => t.status === "In Progress").length;
    const completedCount = tasks.filter(t => t.status === "Completed").length;
    const inReviewCount = tasks.filter(t => t.status === "In Review").length;
    const reviewedCount = tasks.filter(t => t.status === "Reviewed").length;
    const blockedCount = tasks.filter(t => t.priority === "High" && t.status !== "Completed" && t.status !== "Reviewed").length;
    const rejectedCount = tasks.filter(t => t.status === "Rejected").length;

    const customStatuses = ["New", "Pending", "Completed", "In Review", "Reviewed", "Blocked", "Rejected"];
    const customColors = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#14b8a6", "#e31a4c", "#ef4444"];
    const dataCounts = [newCount, pendingCount, completedCount, inReviewCount, reviewedCount, blockedCount, rejectedCount];

    // Doughnut Chart Data (Project Status)
    const doughnutData = {
        labels: customStatuses,
        datasets: [
            {
                data: dataCounts,
                backgroundColor: customColors,
                borderWidth: 0,
            }
        ]
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