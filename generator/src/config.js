// 后端 API 地址（用于校验 license token）。
// 优先级：构建期 VITE_API_BASE > URL 上的 ?api= 参数 > 空（同源，通常不适用）。
// 未部署后端时，可在生成器 URL 后加 ?api=https://你的后端地址 临时联调。
export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  new URLSearchParams(location.search).get('api') ||
  ''

// 未解锁时，引导用户去落地页购买。可经 VITE_LANDING_URL 覆盖。
export const LANDING_URL =
  import.meta.env.VITE_LANDING_URL ||
  'https://fc493d60ec344009ba3f413d2ecb9860.sh3.agentos-app.net'
