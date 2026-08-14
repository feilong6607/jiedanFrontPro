# 前后端连接调试清单（前端 CloudStudio / 后端 Railway）

## 架构
- 前端：CloudStudio 静态托管
  - 落地页：https://fc493d60ec344009ba3f413d2ecb9860.sh3.agentos-app.net
  - 生成器：https://a550142c956a4753bbaed732edbc0e1f.gz1.agentos-app.net
- 后端：Railway（动态域名 `https://<xxx>.up.railway.app` 或自定义域名）
- 桥接：前端 `src/config.js` 读取顺序 = `VITE_API_BASE`（构建期）> URL `?api=` > 空。
  运行时靠 `?api=` 把前端指向 Railway 后端，无需重新构建。

## 调试四步（由外到内）

### 第 1 层：后端公网可达性（先排这个）
直接打后端健康接口：
- 浏览器打开 `https://<railway-url>/health` → 应返回 JSON 且 200。
- 终端：`curl -i https://<railway-url>/health`
- 不通 → 后端没起 / Railway 域名错 / 服务崩溃。去看 Railway 日志。

### 第 2 层：前端有没有指对后端
打开前端时 URL 必须带参数：
- 落地页：`https://fc493d60ec344009ba3f413d2ecb9860.sh3.agentos-app.net/?api=https://<railway-url>`
- 生成器：`https://a550142c956a4753bbaed732edbc0e1f.gz1.agentos-app.net/?api=https://<railway-url>`

⚠️ 坑：`?api=` 的值**不要带末尾斜杠**。代码拼的是 `${API_BASE}/api/...`（见 App.vue:20/59/78），
带斜杠会变成 `//api/...` 导致 404。Railway 域名本身无斜杠，直接贴 `https://xxx.up.railway.app` 即可。

### 第 3 层：CORS 是否放行
- 后端 `AppConfig.allowedOriginsRaw` 默认 `*` → 放行所有来源，调试期不会卡 CORS。
- 只在 Railway 环境变量里**显式设了 ALLOWED_ORIGINS 且没含 CloudStudio 域名**才会被浏览器拦截。
- 调试期建议：保持默认 `*`；或设为
  `ALLOWED_ORIGINS=https://fc493d60ec344009ba3f413d2ecb9860.sh3.agentos-app.net,https://a550142c956a4753bbaed732edbc0e1f.gz1.agentos-app.net`
- 注意：origins 含 `*` 时 `allowCredentials=false`（见 CorsConfig.java:30）；前端 fetch 默认不带 credentials，匹配。

### 第 4 层：浏览器 DevTools 看真实请求
F12 → Network，触发一次"订阅/下单"，看 `/api/...` 那条：
- 200 + 有响应 → 通了。
- Console 报 `blocked by CORS policy` → 第 3 层问题。
- `net::ERR_*` / 无法连接 → 第 1、2 层（地址错或后端没起）。
- 404 → 路径拼错（多半 `?api=` 多了斜杠，或后端没部署对应路由）。

## 长期方案（免每次手加 ?api=）
- 构建期注入：构建前端时设 `VITE_API_BASE=https://<railway-url>`，地址写死进产物，重新部署前端即可。
- 或给 Railway 后端绑自定义域名，把 `config.js` 默认读该域名。

## 顺手检查（部署必看）
- Railway 后端需挂 **Volume** 并设 `STORE_DIR` 指向它，否则重启丢 orders/emails（用默认 `./data` 在 ephemeral 磁盘上会丢）。
- 支付回调 `ALI_NOTIFY_URL` / `WX_NOTIFY_URL` 必须是公网 HTTPS、指向 Railway 后端域名。
