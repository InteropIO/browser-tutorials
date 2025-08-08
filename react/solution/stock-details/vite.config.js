import react from "@vitejs/plugin-react";

export default {
    base: "/details",
    plugins: [react()],
    server: {
        port: 3002,
        open: true
    }
};
