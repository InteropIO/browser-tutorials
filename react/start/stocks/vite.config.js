import react from "@vitejs/plugin-react";

export default {
    base: "/stocks",
    plugins: [react()],
    server: {
        port: 3001,
        open: true
    }
};
