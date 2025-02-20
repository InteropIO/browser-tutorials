import react from '@vitejs/plugin-react';

export default {
  base: '/details',
  plugins: [
    react(),
  ],
  server: {
    open: true,
    port: 3002,
  },
};
