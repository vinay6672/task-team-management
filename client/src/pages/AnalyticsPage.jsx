import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../store/taskSlice";
import { userService } from "../services/userService";
import { TaskCharts } from "../components/TaskCharts";
import { DashboardCards } from "../components/DashboardCards";
import { getInitials } from "../utils/formatters";

export const AnalyticsPage = () => {
    const dispatch = useDispatch();
    const stats = useSelector((state) => state.tasks.stats);
    const [team, setTeam] = useState([]);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        userService.getUsers()
            .then((res) => setTeam(res.users || []))
            .catch((err) => console.error("Error loading team:", err));
    }, [dispatch]);

    return (
        <div className="page-wrapper">
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                    Analytics & Reporting
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                    Detailed breakdown of task metrics, completion rates, and team members.
                </p>
            </div>

            <DashboardCards />
            <TaskCharts />

            <div className="card" style={{ marginTop: "2rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                    👥 Team Members ({team.length})
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
                    {team.map((member) => (
                        <div key={member._id} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.875rem",
                            padding: "0.875rem 1rem",
                            backgroundColor: "var(--bg-main)",
                            borderRadius: "0.75rem",
                            border: "1px solid var(--border-color)"
                        }}>
                            <div className="avatar">
                                {getInitials(member.firstName, member.lastName)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                                    {member.firstName} {member.lastName}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                    {member.email} • <span style={{ textTransform: "capitalize" }}>{member.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
