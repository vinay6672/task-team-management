import React from "react";
import { useSelector } from "react-redux";

export const DashboardCards = () => {
    const stats = useSelector((state) => state.tasks.stats);

    const cards = [
        {
            title: "Total Tasks",
            value: stats.totalTasks || 0,
            icon: "📋",
            bg: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "#ffffff"
        },
        {
            title: "Pending",
            value: stats.pending || 0,
            icon: "⏳",
            bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "#ffffff"
        },
        {
            title: "In Progress",
            value: stats.inProgress || 0,
            icon: "⚡",
            bg: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            color: "#ffffff"
        },
        {
            title: "Completed",
            value: stats.completed || 0,
            icon: "✅",
            bg: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            color: "#ffffff"
        }
    ];

    return (
        <div className="dashboard-grid">
            {cards.map((card, idx) => (
                <div key={idx} className="card stat-card">
                    <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                        {card.icon}
                    </div>
                    <div className="stat-info">
                        <h4>{card.title}</h4>
                        <div className="stat-value">{card.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
