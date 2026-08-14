<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import { templates } from './templates.js'
import { API_BASE, LANDING_URL } from './config.js'

const emptyValues = (tpl) => {
  const o = {}
  tpl.groups.forEach((g) =>
    g.fields.forEach((f) => {
      o[f.key] = f.type === 'table' ? (f.defaultRows ? Array.from({ length: f.defaultRows }, () => ({})) : []) : ''
    })
  )
  return o
}

const store = reactive({})
templates.forEach((t) => (store[t.id] = emptyValues(t)))

const selectedId = ref('contract')
const current = computed(() => templates.find((t) => t.id === selectedId.value))
const form = computed(() => store[selectedId.value])

const filled = computed(() => current.value.render(form.value))
const previewHtml = computed(() => marked.parse(filled.value))

const selectTemplate = (id) => (selectedId.value = id)

const fillSample = () => {
  const base = emptyValues(current.value)
  const s = JSON.parse(JSON.stringify(current.value.sample || {}))
  Object.assign(base, s)
  store[selectedId.value] = base
}
const clearForm = () => (store[selectedId.value] = emptyValues(current.value))

// 表格行增删
const addRow = (field) => form.value[field.key].push({})
const removeRow = (field, i) => form.value[field.key].splice(i, 1)

// ===== license 解锁 =====
const unlocked = ref(false)
const checking = ref(true)
const unlockErr = ref('')

onMounted(async () => {
  let token = new URLSearchParams(location.search).get('pro')
  if (!token) token = localStorage.getItem('jh_token')
  if (token) {
    try {
      const r = await fetch(`${API_BASE}/api/license/verify?token=${encodeURIComponent(token)}`)
      const j = await r.json()
      if (j.valid) {
        unlocked.value = true
        localStorage.setItem('jh_token', token)
      }
    } catch (e) {
      unlockErr.value = '无法连接后端，请确认后端已部署（或带 ?api= 参数）'
    }
  }
  checking.value = false
})

// 未解锁时，pro 模板禁止导出
const canExport = computed(() => current.value.plan !== 'pro' || unlocked.value)

// 导出
const exportMd = () => {
  if (!canExport.value) return
  const blob = new Blob([filled.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${current.value.id}-${Date.now()}.md`
  a.click()
  URL.revokeObjectURL(url)
}
const exportPdf = () => { if (canExport.value) window.print() }
</script>

<template>
  <header class="app-header no-print">
    <div class="brand">
      <div class="brand-logo">盾</div>
      <div>
        <h1>接单护盾 · 私活防坑文档生成器</h1>
        <p>偏后端程序员 × 平台外私活 · 把口头约定变书面合意，全程留痕</p>
      </div>
    </div>
    <div class="toolbar">
      <button class="btn btn-ghost" @click="fillSample">填充示例</button>
      <button class="btn btn-ghost" @click="clearForm">清空</button>
      <button class="btn" :disabled="!canExport" @click="exportMd">导出 Markdown</button>
      <button class="btn btn-primary" :disabled="!canExport" @click="exportPdf">导出 PDF</button>
    </div>
  </header>

  <div class="layout">
    <!-- 左侧：模板选择 + 表单 -->
    <aside class="sidebar no-print">
      <div class="tpl-tabs">
        <button
          v-for="t in templates"
          :key="t.id"
          class="tpl-tab"
          :class="{ active: t.id === selectedId }"
          @click="selectTemplate(t.id)"
        >
          {{ t.title }}
          <span class="tag" :class="t.plan === 'free' ? 'tag-free' : 'tag-pro'">
            {{ t.plan === 'free' ? '免费' : '高级' }}
          </span>
        </button>
      </div>

      <div v-if="current.plan === 'pro' && !unlocked" class="pro-banner">
        🔒 高级版功能 · <a :href="LANDING_URL + '#pricing'" target="_blank" rel="noopener">去落地页购买后解锁</a>
      </div>
      <div v-else-if="current.plan === 'pro' && unlocked" class="pro-banner pro-banner--ok">
        ✅ 已解锁高级版，可生成并导出全部模板
      </div>
      <div v-if="unlockErr" class="pro-banner pro-banner--err">{{ unlockErr }}</div>

      <p class="tpl-desc">{{ current.desc }}</p>

      <div v-for="g in current.groups" :key="g.title" class="group">
        <h3>{{ g.title }}</h3>
        <div v-for="f in g.fields" :key="f.key" class="field">
          <!-- 可重复表格 -->
          <template v-if="f.type === 'table'">
            <label>{{ f.label }}</label>
            <div class="table-editor">
              <div class="table-row table-head">
                <span v-for="c in f.columns" :key="c.key">{{ c.label }}</span>
              </div>
              <div v-for="(row, i) in form[f.key]" :key="i" class="table-row">
                <input
                  v-for="c in f.columns"
                  :key="c.key"
                  v-model="row[c.key]"
                  :placeholder="c.label"
                />
              </div>
              <div class="table-actions">
                <button class="mini-btn" @click="addRow(f)">+ 添加一行</button>
                <button
                  class="mini-btn"
                  v-if="form[f.key].length > 1"
                  @click="removeRow(f, form[f.key].length - 1)"
                >
                  - 删除末行
                </button>
              </div>
            </div>
          </template>
          <!-- 普通字段 -->
          <template v-else>
            <label :for="f.key">{{ f.label }}</label>
            <textarea
              v-if="f.type === 'textarea'"
              :id="f.key"
              v-model="form[f.key]"
              :placeholder="f.placeholder"
            ></textarea>
            <input
              v-else
              :id="f.key"
              :type="f.type === 'number' ? 'number' : 'text'"
              v-model="form[f.key]"
              :placeholder="f.placeholder"
            />
          </template>
        </div>
      </div>
    </aside>

    <!-- 右侧：实时预览 -->
    <main class="preview-pane">
      <article class="doc" v-html="previewHtml"></article>
    </main>
  </div>
</template>

<style scoped>
.pro-banner {
  background: #33240f;
  color: var(--warn);
  border: 1px solid #5a4413;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12.5px;
  margin-bottom: 12px;
}
.pro-banner--ok {
  background: #0f2e1a;
  color: #4ade80;
  border-color: #1f5c38;
}
.pro-banner--err {
  background: #2e1414;
  color: #f87171;
  border-color: #5c1f1f;
}
:deep(.btn:disabled) {
  opacity: 0.45;
  cursor: not-allowed;
}
.tpl-desc {
  font-size: 12.5px;
  color: var(--muted);
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  margin: 0 0 16px;
}
</style>
