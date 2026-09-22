import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (filterParams, { rejectWithValue }) => {
        try {
            return await taskService.getTasks(filterParams);
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch tasks"
            );
        }
    }
);

export const fetchDashboardStats = createAsyncThunk(
    "tasks/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            return await taskService.getDashboardStats();
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch dashboard stats"
            );
        }
    }
);

export const addNewTask = createAsyncThunk(
    "tasks/addNewTask",
    async (taskData, { rejectWithValue, dispatch }) => {
        try {
            const data = await taskService.createTask(taskData);
            dispatch(fetchDashboardStats());
            return data.task;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to create task"
            );
        }
    }
);

export const updateExistingTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, taskData }, { rejectWithValue, dispatch }) => {
        try {
            const data = await taskService.updateTask(id, taskData);
            dispatch(fetchDashboardStats());
            return data.task;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update task"
            );
        }
    }
);

export const deleteExistingTask = createAsyncThunk(
    "tasks/deleteTask",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await taskService.deleteTask(id);
            dispatch(fetchDashboardStats());
            return id;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete task"
            );
        }
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        items: [],
        stats: {
            totalTasks: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            priorityBreakdown: { low: 0, medium: 0, high: 0 }
        },
        loading: false,
        error: null,
        filters: {
            search: "",
            status: "All",
            priority: "All",
            sort: "desc"
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {
                search: "",
                status: "All",
                priority: "All",
                sort: "desc"
            };
        },
        clearTaskError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchTasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.tasks || [];
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchDashboardStats
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                if (action.payload?.stats) {
                    state.stats = action.payload.stats;
                }
            })
            // addNewTask
            .addCase(addNewTask.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // updateExistingTask
            .addCase(updateExistingTask.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // deleteExistingTask
            .addCase(deleteExistingTask.fulfilled, (state, action) => {
                state.items = state.items.filter(t => t._id !== action.payload);
            });
    }
});

export const { setFilters, resetFilters, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
