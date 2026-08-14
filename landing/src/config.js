// 后端 API 地址。
// 优先级：构建期 VITE_API_BASE > URL 上的 ?api= 参数 > 空（同源，通常不适用）。
// 本地/未部署后端时，可在落地页 URL 后加 ?api=https://你的后端地址 临时联调，无需重新构建。
export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  new URLSearchParams(location.search).get('api') ||
  ''
