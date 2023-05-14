import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import path from 'path'
// // https://vitejs.dev/config/

const __dirname = path.join(fileURLToPath(import.meta.url), '../')

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  server: {
    host: true
  },
  // build: {
  //   outDir: 'dist',
  //   lib: {
  //     entry: path.resolve(__dirname, './src/components/index.ts'),
  //     name: '@happy/h5',
  //     fileName: '@happy/h5',
  //     formats: ['es', 'umd'],
  //   },
  //   rollupOptions: {
  //     external: ['vue', 'vue-router'],
  //     output: {
  //       globals: { vue: 'Vue' }
  //     }
  //   }
  // }
})

