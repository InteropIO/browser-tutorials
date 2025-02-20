import react from "@vitejs/plugin-react"

export default {
    base: "/portfolio-downloader",
    plugins: [react()],
    server: {
        port: 9400,
        open: true
    }
}