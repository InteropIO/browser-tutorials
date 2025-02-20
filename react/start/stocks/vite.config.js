import react from '@vitejs/plugin-react';

export default {
  base: '/stocks',
  plugins: [
    react(),
  ],
  server: {
    open: true,
    port: 3001,
  },
};
