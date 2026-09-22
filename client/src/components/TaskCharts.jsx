import React from "react";
import { useSelector } from "react-redux";

export const TaskCharts = () => {
    const stats = useSelector((state) => state.tasks.stats);
    const total = stats.totalTasks || 1; // avoid division by zero

    const pendingPct = Math.round(((stats.pending || 0) / total) * 100);
    const progressPct = Math.round(((stats.inProgress || 0) / total) * 100);
    const completedPct = Math.round(((stats.completed || 0) / total) * 100);

    const pb = stats.priorityBreakdown || { low: 0, medium: 0, high: 0 };
    const highPct = Math.round(((pb.high || 0) / total) * 100);
    const medPct = Math.round(((pb.medium || 0) / total) * 100);
    const lowPct = Math.round(((pb.low || 0) / total) * 100);

    return (
        <div className="charts-grid">
            <div className="card">
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    📊 Task Distribution by Status
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
                            <span style={{ fontWeight: 600 }}>Completed ({stats.completed || 0})</span>
                            <span style={{ fontWeight: 700, color: "#16a34a" }}>{completedPct}%</span>
                        </div>
                        <div style={{ height: "10px", backgroundColor: "var(--bg-main)", borderRadius: "5px", overflow: "hidden" }}>
                            <div style={{ width: `${completedPct}%`, height: "100%", backgroundColor: "#16a34a", transition: "width 0.5s ease" }} />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
                            <span style={{ fontWeight: 600 }}>In Progress ({stats.inProgress || 0})</span>
                            <span style={{ fontWeight: 700, color: "#0284c7" }}>{progressPct}%</span>
                        </div>
                        <div style={{ height: "10px", backgroundColor: "var(--bg-main)", borderRadius: "5px", overflow: "hidden" }}>
                            <div style={{ width: `${progressPct}%`, height: "100%", backgroundColor: "#0284c7", transition: "width 0.5s ease" }} />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
                            <span style={{ fontWeight: 600 }}>Pending ({stats.pending || 0})</span>
                            <span style={{ fontWeight: 700, color: "#d97706" }}>{pendingPct}%</span>
                        </div>
                        <div style={{ height: "10px", backgroundColor: "var(--bg-main)", borderRadius: "5px", overflow: "hidden" }}>
                            <div style={{ width: `${pendingPct}%`, height: "100%", backgroundColor: "#d97706", transition: "width 0.5s ease" }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    🎯 Priority Distribution
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
                            <span style={{ fontWeight: 600 }}>High Priority ({pb.high || 0})</span>
                            <span style={{ fontWeight: 700, color: "#dc2626" }}>{highPct}%</span>
                        </div>
                        <div style={{ height: "10px", backgroundColor: "var(--bg-main)", borderRadius: "5px", overflow: "hidden" }}>
                            <div style={{ width: `${highPct}%`, height: "100%", backgroundColor: "#dc2626", transition: "width 0.5s ease" }} />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
                            <span style={{ fontWeight: 600 }}>Medium Priority ({pb.medium || 0})</span>
                            <span style={{ fontWeight: 700, color: "#ea580c" }}>{medPct}%</span>
                        </div>
                        <div style={{ height: "10px", backgroundColor: "var(--bg-main)", borderRadius: "5px", overflow: "hidden" }}>
                            <div style={{ width: `${medPct}%`, height: "100%", backgroundColor: "#ea580c", transition: "width 0.5s ease" }} />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
                            <span style={{ fontWeight: 600 }}>Low Priority ({pb.low || 0})</span>
                            <span style={{ fontWeight: 700, color: "#64748b" }}>{lowPct}%</span>
                        </div>
                        <div style={{ height: "10px", backgroundColor: "var(--bg-main)", borderRadius: "5px", overflow: "hidden" }}>
                            <div style={{ width: `${lowPct}%`, height: "100%", backgroundColor: "#64748b", transition: "width 0.5s ease" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
