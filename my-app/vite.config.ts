import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// this port should be the one your backend is running on
export default defineConfig({
  plugins: [react()],
})


