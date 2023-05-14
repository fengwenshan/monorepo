import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@happy-h5': path.resolve(__dirname, '../happy-h5/src/components')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/letter': {
        target: 'http://124.221.248.143:8082',
        // target就是你要访问的目标地址，可以是基础地址，这样方便在这个网站的其他api口调用数据
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/testaxios/, ''),
        // 要记得加rewrite这句
      },
    },
  },
})
