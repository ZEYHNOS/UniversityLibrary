import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port : 3755,
    open: true, // 브라우저 자동 열기
    proxy: {
      '/user': {
        target: 'http://localhost:2866',
        changeOrigin: true,
        secure: false
      }
    }
  },
})
