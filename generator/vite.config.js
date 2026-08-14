import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 用相对路径，方便直接部署到 Vercel / GitHub Pages / 任意静态托管
// emptyOutDir: false —— 避免沙箱 safe-delete 在清空 dist 时卡死（构建会直接覆盖产物）
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: { emptyOutDir: false },
})
