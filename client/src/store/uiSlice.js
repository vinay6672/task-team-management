import { createSlice } from "@reduxjs/toolkit";

const initialDarkMode = localStorage.getItem("theme") === "dark" || false;

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        darkMode: initialDarkMode,
        sidebarOpen: false,
        toasts: [],
        taskModalOpen: false,
        editingTask: null,
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem("theme", state.darkMode ? "dark" : "light");
            if (state.darkMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        showToast: (state, action) => {
            // payload: { message, type: 'success'|'error'|'info', id: Date.now() }
            const toast = {
                id: Date.now(),
                message: action.payload.message,
                type: action.payload.type || "info"
            };
            state.toasts.push(toast);
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(t => t.id !== action.payload);
        },
        openTaskModal: (state, action) => {
            state.taskModalOpen = true;
            state.editingTask = action.payload || null;
        },
        closeTaskModal: (state) => {
            state.taskModalOpen = false;
            state.editingTask = null;
        }
    }
});

export const {
    toggleDarkMode,
    setSidebarOpen,
    toggleSidebar,
    showToast,
    removeToast,
    openTaskModal,
    closeTaskModal
} = uiSlice.actions;

export default uiSlice.reducer;
