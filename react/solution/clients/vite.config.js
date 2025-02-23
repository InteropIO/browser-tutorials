import react from "@vitejs/plugin-react"

export default {
    base: "./",
    plugins: [
        react()
    ],
    server: {
        port: 3000,
        open: true
    }
}