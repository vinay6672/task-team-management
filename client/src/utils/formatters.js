export const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

export const getInitials = (firstName = "", lastName = "") => {
    const f = firstName ? firstName.charAt(0).toUpperCase() : "";
    const l = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${f}${l}` || "U";
};

export const getStatusBadgeClass = (status) => {
    switch (status) {
        case "Completed":
            return "badge-completed";
        case "In Progress":
            return "badge-in-progress";
        case "Pending":
            return "badge-pending";
        default:
            return "badge-default";
    }
};

export const getPriorityBadgeClass = (priority) => {
    switch (priority) {
        case "High":
            return "badge-priority-high";
        case "Medium":
            return "badge-priority-medium";
        case "Low":
            return "badge-priority-low";
        default:
            return "badge-default";
    }
};
