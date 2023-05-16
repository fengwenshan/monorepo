
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://admin.liuligen.com',
        // target就是你要访问的目标地址，可以是基础地址，这样方便在这个网站的其他api口调用数据
        // ws: true,
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/testaxios/, ''),
        // 要记得加rewrite这句
      },
    },
  },
});