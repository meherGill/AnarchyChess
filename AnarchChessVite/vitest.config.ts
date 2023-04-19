import { defineConfig } from "vitest/config";
import path from 'path'


export default defineConfig({
    resolve: {
        alias: [
          {find: "@enums", replacement: path.resolve(__dirname, './src/enums') },
        ]
      },
    test: {
        globals: true,
        environment: 'jsdom',
       
    }
});