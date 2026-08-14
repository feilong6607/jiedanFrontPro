// 后端 API 地址。
// 优先级：构建期 VITE_API_BASE > URL 上的 ?api= 参数 > 默认 Railway 后端。
// 已部署后端：https://backend-production-0226d.up.railway.app
// 本地联调可临时加 ?api=http://127.0.0.1:3000 覆盖，无需重新构建。
export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  new URLSearchParams(location.search).get('api') ||
  'https://backend-production-0226d.up.railway.app'
