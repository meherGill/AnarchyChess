import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {find: "@enums", replacement: path.resolve(__dirname, './src/shared/enums') },
      {find: "@components/*", replacement: path.resolve(__dirname, './src/components/*') },
      {find: "@shared/*", replacement: path.resolve(__dirname, './src/shared/*') },

    ]
  },
 
})
