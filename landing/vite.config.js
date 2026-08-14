import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' 让构建产物使用相对路径，方便直接预览 dist/index.html 或部署到任意子目录
// emptyOutDir: false —— dist/generator 是嵌入的生成器子应用，构建时不要清空它
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: { emptyOutDir: false }
})
