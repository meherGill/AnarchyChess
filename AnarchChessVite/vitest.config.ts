import { defineConfig } from "vitest/config";
import path from 'path'


export default defineConfig({
    resolve: {
        alias: [
          {find: "@enums", replacement: path.resolve(__dirname, './src/shared/enums') },
          {find: "@components/*", replacement: path.resolve(__dirname, './src/components/*') },
          {find: "@shared/*", replacement: path.resolve(__dirname, './src/shared/*') },

        ]
      },
    test: {
        globals: true,
        environment: 'jsdom',
       
    }
});