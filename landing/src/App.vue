<script setup>
import { ref, computed } from 'vue'
import QRCode from 'qrcode'
import { API_BASE } from './config.js'

// 生成器地址：开发态指向本地 preview；生产态指向独立的生成器部署（CloudStudio 每次重发会换域名，须同步更新）
const GENERATOR_URL =
  import.meta.env.MODE === 'development'
    ? 'http://127.0.0.1:4174/'
    : 'https://a550142c956a4753bbaed732edbc0e1f.gz1.agentos-app.net/'

// ===== 邮箱订阅 =====
const email = ref('')
const subscribed = ref(false)
const subError = ref('')
async function onSubmit() {
  subError.value = ''
  if (!email.value.includes('@')) return
  try {
    const r = await fetch(`${API_BASE}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    if (r.ok) subscribed.value = true
    else { const j = await r.json().catch(() => ({})); subError.value = j.error || '订阅失败' }
  } catch (e) {
    subError.value = '无法连接后端，请确认后端已部署并配置 API_BASE'
  }
}

// ===== 支付弹窗 =====
const payModal = ref(false)
const payChannel = ref('wechat')
const payOrder = ref(null)      // { orderId, payUrl, channel, license? }
const payQr = ref('')
const payError = ref('')
const payPaid = ref(false)
const payProductName = ref('')
let pollTimer = null

function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null } }

async function openPay(product, name) {
  payProductName.value = name
  payChannel.value = 'wechat'
  payError.value = ''
  payPaid.value = false
  payOrder.value = null
  payQr.value = ''
  payModal.value = true
  await createOrder(product, 'wechat')
}

async function createOrder(product, channel) {
  payError.value = ''
  payChannel.value = channel
  try {
    const r = await fetch(`${API_BASE}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, channel }),
    })
    const j = await r.json()
    if (!r.ok) { payError.value = j.error || '创建订单失败'; return }
    payOrder.value = j
    payQr.value = await QRCode.toDataURL(j.payUrl, { width: 240, margin: 1 })
    startPoll(j.orderId)
  } catch (e) {
    payError.value = '无法连接后端，请确认后端已部署并配置 API_BASE'
  }
}

function startPoll(orderId) {
  stopPoll()
  pollTimer = setInterval(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/order/${orderId}`)
      const j = await r.json()
      if (j.status === 'paid') {
        payPaid.value = true
        payOrder.value = { ...payOrder.value, license: j.license }
        stopPoll()
      }
    } catch (e) { /* 忽略轮询错误，继续 */ }
  }, 2000)
}

function closePay() { stopPoll(); payModal.value = false }

// 支付成功后跳转生成器（带 license token）
const genUnlockUrl = computed(() =>
  payPaid.value && payOrder.value?.license
    ? `${GENERATOR_URL}?pro=${encodeURIComponent(payOrder.value.license)}`
    : ''
)
</script>

<template>
  <div class="page">
    <header class="nav">
      <div class="container nav-inner">
        <div class="brand">接单护盾</div>
        <nav class="nav-links">
          <a href="#pain">痛点</a>
          <a href="#guard">防坑机制</a>
          <a href="#demo">演示</a>
          <a href="#trial">免费版</a>
          <a href="#pricing">价格</a>
        </nav>
      </div>
    </header>

    <!-- ① Hero -->
    <section class="hero">
      <div class="container hero-inner">
        <span class="badge">偏后端程序员 · 平台外私活专用</span>
        <h1>接私活，先穿盔甲</h1>
        <p class="lead">
          合同、报价单、需求确认单、验收单——填张表就生成，全程留痕。<br />
          把接单的杂事自动化，安心把一单干完、把钱拿到手。
        </p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#trial">免费试用</a>
          <a class="btn btn-ghost" :href="GENERATOR_URL" target="_blank" rel="noopener">打开生成器</a>
        </div>
        <p class="hero-sub">不用注册，打开就能生成合同和接单确认单</p>
      </div>
    </section>

    <!-- ② 痛点 -->
    <section id="pain" class="section-soft">
      <div class="container">
        <h2 class="sec-title">这些坑，接私活十有八九遇过</h2>
        <div class="cards">
          <div class="card">
            <div class="card-ico">⚠</div>
            <h3>做完说"不合格"，尾款拖半年</h3>
            <p>需求没写清验收标准，对方一句"不对"，你就说不清，尾款永远在路上。</p>
          </div>
          <div class="card">
            <div class="card-ico">⚠</div>
            <h3>报价被一压再压</h3>
            <p>不懂怎么报才不被压价，辛苦活越做越亏，最后对方还嫌你贵。</p>
          </div>
          <div class="card">
            <div class="card-ico">⚠</div>
            <h3>需求反复变，白干三倍</h3>
            <p>口头增项没边界，需求会一改再改，你干的活是谈好的三倍。</p>
          </div>
          <div class="card">
            <div class="card-ico">⚠</div>
            <h3>全靠微信口头约定</h3>
            <p>没书面留痕，对方翻脸不认，你连证据都拿不出。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ②b 防坑机制 -->
    <section id="guard">
      <div class="container">
        <h2 class="sec-title">它怎么帮你挡坑</h2>
        <p class="sec-lead">不是给你一份"看起来很厉害"的合同模板，而是把"扯皮"提前堵死。</p>
        <div class="guards">
          <div class="guard">
            <div class="guard-no">01</div>
            <h3>验收标准写进需求确认单</h3>
            <p>每一项目标、边界、交付物，双方在需求确认单上签字确认，事后不能随便加戏。</p>
          </div>
          <div class="guard">
            <div class="guard-no">02</div>
            <h3>异议必须"指条款 + 出证据"</h3>
            <p>合同明定：说不合格，必须具体引用哪一条需求、附上什么证据，空口"不对"无效。</p>
          </div>
          <div class="guard">
            <div class="guard-no">03</div>
            <h3>验收单不通过就强制选原因</h3>
            <p>生成器里验收单若不通过，必须选"哪条需求不达标 + 证据"，否则单子交不出去。</p>
          </div>
          <div class="guard">
            <div class="guard-no">04</div>
            <h3>全程留痕，举证在你手里</h3>
            <p>报价、确认、交付、验收四件套成套，真闹到纠纷，你手里有链完整的证据。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ③ 演示 -->
    <section id="demo" class="section-soft">
      <div class="container">
        <h2 class="sec-title">生成器长这样</h2>
        <div class="demo-frame demo-frame--tall">
          <div class="demo-bar"><span></span><span></span><span></span></div>
          <div class="demo-body demo-body--flush">
            <iframe
              :src="GENERATOR_URL"
              title="接单护盾生成器"
              class="demo-iframe"
              loading="lazy"
            ></iframe>
          </div>
        </div>
        <div class="demo-actions">
          <a class="btn btn-primary" :href="GENERATOR_URL" target="_blank" rel="noopener">打开完整生成器（新窗口）</a>
        </div>
      </div>
    </section>

    <!-- ④ 免费版 + 邮箱订阅 -->
    <section id="trial">
      <div class="container trial">
        <div class="trial-left">
          <h2 class="sec-title">免费版，先穿盔甲</h2>
          <p>合同 + 接单确认单，免费生成，先体验再决定。</p>
          <p class="muted">不用注册，打开就能用。</p>
          <a class="btn btn-primary" :href="GENERATOR_URL" target="_blank" rel="noopener">打开免费版</a>
        </div>
        <div class="trial-right">
          <h3>订阅更新，抢早鸟</h3>
          <p class="muted">留下邮箱，早鸟开放与模板更新第一时间通知你。</p>
          <form v-if="!subscribed" class="sub-form" @submit.prevent="onSubmit">
            <input v-model="email" type="email" placeholder="you@example.com" required />
            <button class="btn btn-accent" type="submit">订阅</button>
          </form>
          <p v-else class="ok-msg">已记录，早鸟开放时第一时间通知你 ✓</p>
          <p v-if="subError" class="err-msg">{{ subError }}</p>
        </div>
      </div>
    </section>

    <!-- ⑤ 价格 -->
    <section id="pricing" class="section-soft">
      <div class="container">
        <h2 class="sec-title">一次买断，不订阅</h2>
        <div class="tiers">
          <div class="tier">
            <div class="tier-name">免费版</div>
            <div class="tier-price">¥0</div>
            <ul class="tier-points">
              <li>合同生成</li>
              <li>接单确认单生成</li>
              <li>基础留痕</li>
            </ul>
            <a class="btn btn-ghost btn-block" :href="GENERATOR_URL" target="_blank" rel="noopener">打开免费版</a>
          </div>
          <div class="tier tier--hot">
            <div class="tier-flag">前 100 名</div>
            <div class="tier-name">早鸟版</div>
            <div class="tier-price">¥9.9</div>
            <ul class="tier-points">
              <li>四件套：合同 / 报价 / 需求确认 / 验收</li>
              <li>接单确认单</li>
              <li>全程留痕模板</li>
            </ul>
            <button class="btn btn-primary btn-block" @click="openPay('earlybird', '接单护盾 早鸟版')">领取早鸟价</button>
          </div>
          <div class="tier">
            <div class="tier-name">正式版</div>
            <div class="tier-price">¥39</div>
            <ul class="tier-points">
              <li>同早鸟全部内容</li>
              <li>后续模板更新</li>
              <li>买断，不月付</li>
            </ul>
            <button class="btn btn-ghost btn-block" @click="openPay('pro', '接单护盾 正式版')">购买正式版</button>
          </div>
        </div>
        <p class="disclaimer">
          ⚠️ 本工具及模板仅供参考，<strong>不构成法律意见</strong>。金额较大或关系复杂请先咨询执业律师。
        </p>
      </div>
    </section>

    <!-- ⑥ 页脚 -->
    <footer class="footer">
      <div class="container footer-inner">
        <div>
          <div class="brand">接单护盾</div>
          <p class="muted">偏后端程序员平台外私活防坑工具包</p>
        </div>
        <div class="footer-links">
          <a href="https://github.com/" target="_blank" rel="noopener">GitHub</a>
          <a href="#">使用条款</a>
          <a href="#">联系</a>
          <a href="#">微信（可选钩子）</a>
        </div>
      </div>
    </footer>

    <!-- 支付弹窗 -->
    <div v-if="payModal" class="modal-mask" @click.self="closePay">
      <div class="modal">
        <button class="modal-close" @click="closePay">×</button>
        <h3 v-if="!payPaid" class="modal-title">扫码支付 · {{ payProductName }}</h3>
        <div v-if="!payPaid">
          <div class="pay-channels">
            <button :class="['ch', { on: payChannel === 'wechat' }]" @click="createOrder(payOrder?.product || 'earlybird', 'wechat')">微信支付</button>
            <button :class="['ch', { on: payChannel === 'alipay' }]" @click="createOrder(payOrder?.product || 'earlybird', 'alipay')">支付宝</button>
          </div>
          <p v-if="payError" class="err-msg center">{{ payError }}</p>
          <div v-else-if="payQr" class="qr-wrap">
            <img :src="payQr" alt="支付二维码" class="qr" />
            <p class="qr-tip">请用{{ payChannel === 'wechat' ? '微信' : '支付宝' }}扫一扫完成支付</p>
            <p class="qr-status">支付后本页自动跳转解锁…</p>
          </div>
          <p v-else class="qr-tip center">正在生成订单…</p>
        </div>
        <div v-else class="pay-success">
          <div class="ok-big">✓ 支付成功，已解锁</div>
          <p>高级版模板已解锁，打开生成器即可使用全部四件套 + 接单确认单。</p>
          <a class="btn btn-primary btn-block" :href="genUnlockUrl" target="_blank" rel="noopener">打开生成器（高级版）</a>
          <p class="muted small">提示：解锁凭证已随链接携带，无需再次付费。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav { border-bottom: 1px solid var(--border); background: #fff; position: sticky; top: 0; z-index: 10; }
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 60px; }
.brand { font-weight: 500; font-size: 18px; color: var(--primary); }
.nav-links a { margin-left: 20px; color: var(--text-soft); font-size: 14px; }

.hero { background: linear-gradient(180deg, #f0f6ff 0%, #ffffff 100%); }
.hero-inner { text-align: center; padding: 80px 0 64px; }
.badge { display: inline-block; background: var(--primary-soft); color: var(--primary); font-size: 13px; padding: 6px 14px; border-radius: 999px; margin-bottom: 20px; }
.hero h1 { font-size: 44px; font-weight: 800; letter-spacing: -1px; }
.lead { font-size: 18px; color: var(--text-soft); margin: 20px 0 32px; }
.hero-cta { display: flex; gap: 14px; justify-content: center; }
.hero-sub { margin-top: 16px; font-size: 13px; color: #9aa; }

.sec-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 14px; }
.sec-lead { text-align: center; color: var(--text-soft); margin-bottom: 36px; font-size: 15px; }

.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
.card-ico { font-size: 22px; color: #d85a30; margin-bottom: 10px; }
.card h3 { font-size: 17px; margin-bottom: 8px; }
.card p { color: var(--text-soft); font-size: 14px; line-height: 1.6; }

.guards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.guard { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
.guard-no { font-size: 28px; font-weight: 800; color: var(--primary-soft); margin-bottom: 8px; }
.guard h3 { font-size: 17px; margin-bottom: 8px; }
.guard p { color: var(--text-soft); font-size: 14px; line-height: 1.6; }

.demo-frame { max-width: 760px; margin: 0 auto; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.demo-bar { background: #eef2f7; padding: 10px; display: flex; gap: 6px; }
.demo-bar span { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; }
.demo-body { height: 320px; display: flex; align-items: center; justify-content: center; background: #fafbfc; }
.demo-frame--tall .demo-body { height: auto; }
.demo-body--flush { padding: 0; }
.demo-iframe { width: 100%; height: 620px; border: 0; display: block; }
.demo-actions { text-align: center; margin-top: 18px; }

.trial { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
.trial-left .sec-title, .trial-right h3 { text-align: left; margin-bottom: 12px; }
.trial-left p { color: var(--text-soft); font-size: 15px; }
.muted { color: var(--text-soft); font-size: 14px; }
.sub-form { display: flex; gap: 10px; margin: 16px 0; }
.sub-form input { flex: 1; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; }
.ok-msg { color: var(--accent); font-weight: 500; margin-top: 16px; }
.err-msg { color: #d8503a; font-size: 13px; margin-top: 10px; }
.err-msg.center, .qr-tip.center { text-align: center; }

.tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 880px; margin: 0 auto; }
.tier { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 28px 24px; text-align: center; position: relative; }
.tier--hot { border-color: var(--primary); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12); }
.tier-flag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 12px; padding: 4px 12px; border-radius: 999px; }
.tier-name { font-size: 15px; color: var(--text-soft); }
.tier-price { font-size: 36px; font-weight: 800; margin: 8px 0 16px; }
.tier-points { list-style: none; padding: 0; margin: 0 0 20px; text-align: left; }
.tier-points li { font-size: 14px; color: var(--text-soft); padding: 8px 0; border-bottom: 1px dashed var(--border); }
.tier-points li:last-child { border-bottom: 0; }
.btn-block { display: block; width: 100%; box-sizing: border-box; }

.disclaimer { font-size: 12px; color: var(--text-soft); margin-top: 28px; text-align: center; max-width: 640px; margin-left: auto; margin-right: auto; }

.footer { background: #0b1220; color: #c4cfdc; padding: 40px 0; }
.footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.footer .brand { color: #fff; }
.footer-links a { color: #9aa6b5; margin-left: 18px; font-size: 14px; }

.btn { display: inline-block; padding: 12px 22px; border-radius: 10px; font-size: 15px; font-weight: 500; text-decoration: none; cursor: pointer; border: 1px solid transparent; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: #1d4ed8; }
.btn-ghost { background: #fff; color: var(--primary); border-color: var(--border); }
.btn-accent { background: var(--accent); color: #fff; }

/* 支付弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #fff; border-radius: 16px; padding: 28px; width: 340px; max-width: 92vw; position: relative; text-align: center; }
.modal-close { position: absolute; top: 10px; right: 14px; border: 0; background: none; font-size: 24px; color: #94a3b8; cursor: pointer; }
.modal-title { font-size: 18px; margin-bottom: 16px; }
.pay-channels { display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; }
.ch { padding: 8px 16px; border: 1px solid var(--border); border-radius: 8px; background: #fff; cursor: pointer; font-size: 14px; }
.ch.on { border-color: var(--primary); color: var(--primary); font-weight: 600; }
.qr-wrap { padding: 8px 0; }
.qr { width: 220px; height: 220px; margin: 0 auto; display: block; }
.qr-tip { font-size: 13px; color: var(--text-soft); margin-top: 12px; }
.qr-status { font-size: 12px; color: #9aa; margin-top: 4px; }
.pay-success .ok-big { font-size: 20px; font-weight: 700; color: #16a34a; margin-bottom: 10px; }
.pay-success p { font-size: 14px; color: var(--text-soft); margin-bottom: 16px; }
.pay-success .small { font-size: 12px; margin-top: 10px; }

@media (max-width: 760px) {
  .cards, .guards, .tiers, .trial { grid-template-columns: 1fr; }
  .hero h1 { font-size: 32px; }
  .nav-links a { margin-left: 12px; font-size: 13px; }
}
</style>
