import react from '@vitejs/plugin-react';

export default {
  base: '/client-details',
  plugins: [
    react(),
  ],
  server: {
    port: 3003,
    open: true
  },
};