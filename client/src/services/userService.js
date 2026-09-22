import api from "./api";

export const userService = {
    getUsers: async () => {
        const response = await api.get("/api/users");
        return response.data;
    }
};
