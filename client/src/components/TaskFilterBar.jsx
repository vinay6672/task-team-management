import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../store/taskSlice";
import { useDebounce } from "../hooks/useDebounce";

export const TaskFilterBar = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.tasks.filters);

    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Trigger filter dispatch on debounced search change
    useEffect(() => {
        dispatch(setFilters({ search: debouncedSearch }));
    }, [debouncedSearch, dispatch]);

    const handleStatusChange = (e) => {
        dispatch(setFilters({ status: e.target.value }));
    };

    const handlePriorityChange = (e) => {
        dispatch(setFilters({ priority: e.target.value }));
    };

    const handleSortChange = (e) => {
        dispatch(setFilters({ sort: e.target.value }));
    };

    const handleReset = () => {
        setSearchTerm("");
        dispatch(resetFilters());
    };

    return (
        <div className="filter-bar">
            <div className="search-input-group">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="form-input search-input"
                    placeholder="Search tasks by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <select
                    className="form-select"
                    value={filters.status}
                    onChange={handleStatusChange}
                    style={{ width: "auto", minWidth: "130px" }}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    className="form-select"
                    value={filters.priority}
                    onChange={handlePriorityChange}
                    style={{ width: "auto", minWidth: "130px" }}
                >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <select
                    className="form-select"
                    value={filters.sort}
                    onChange={handleSortChange}
                    style={{ width: "auto", minWidth: "140px" }}
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                    <option value="dueDateAsc">Due Date (Earliest)</option>
                    <option value="dueDateDesc">Due Date (Latest)</option>
                </select>

                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};
