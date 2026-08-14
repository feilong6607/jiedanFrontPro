// 接单护盾 · 模板 schema + 渲染函数
// 与 product/templates/*.md 结构保持一致；生成器输出带通用免责声明。

const DISCLAIMER =
  '> ⚠️ **免责声明**：本文件由「接单护盾」生成，仅供参考，**不构成法律意见**。金额较大或关系复杂请先咨询执业律师。\n\n'

// 通用填充：把 {{key}} 替换为对应值；空值留空
function fill(body, v) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, k) => (v[k] != null ? v[k] : ''))
}

export const templates = [
  /* ============ 免费版：合同 ============ */
  {
    id: 'contract',
    title: '私活软件开发服务合同',
    plan: 'free',
    desc: '平台外私活正式合同：分期付款 / 变更书面确认 / 尾款前不交源码 / 逾期视为验收 / 异议须指具体条款+证据',
    groups: [
      { title: '基础信息', fields: [
        { key: 'contract_no', label: '合同编号', type: 'text', placeholder: 'HT-2026-001' },
        { key: 'sign_date', label: '签订日期', type: 'text', placeholder: '2026-08-13' },
        { key: 'sign_place', label: '签订地点', type: 'text', placeholder: '（在线签署）' },
      ]},
      { title: '双方信息', fields: [
        { key: 'party_a_name', label: '甲方（需求方）姓名/公司', type: 'text' },
        { key: 'party_a_contact', label: '甲方联系方式', type: 'text' },
        { key: 'party_b_name', label: '乙方（开发方）姓名/公司', type: 'text' },
        { key: 'party_b_contact', label: '乙方联系方式', type: 'text' },
      ]},
      { title: '项目范围', fields: [
        { key: 'project_name', label: '项目名称', type: 'text' },
        { key: 'scope_in', label: '开发内容（做什么）', type: 'textarea' },
        { key: 'scope_out', label: '明确不包含（不做什么）', type: 'textarea' },
        { key: 'tech_stack', label: '技术栈/运行环境', type: 'text', placeholder: 'Java + Vue3' },
      ]},
      { title: '交付与验收', fields: [
        { key: 'deliverables', label: '交付物清单', type: 'textarea' },
        { key: 'acceptance_criteria', label: '验收标准', type: 'textarea' },
        { key: 'review_days', label: '验收期（工作日）', type: 'number', placeholder: '5' },
      ]},
      { title: '报价与付款', fields: [
        { key: 'total_amount', label: '合同总金额(¥)', type: 'text', placeholder: '8000' },
        { key: 'total_amount_cn', label: '金额大写', type: 'text', placeholder: '捌仟元整' },
        { key: 'pay1_pct', label: '第一期比例%', type: 'text', placeholder: '40' },
        { key: 'pay1_amt', label: '第一期金额(¥)', type: 'text', placeholder: '3200' },
        { key: 'pay2_pct', label: '第二期比例%', type: 'text', placeholder: '40' },
        { key: 'pay2_amt', label: '第二期金额(¥)', type: 'text', placeholder: '3200' },
        { key: 'pay3_pct', label: '尾款比例%', type: 'text', placeholder: '20' },
        { key: 'pay3_amt', label: '尾款金额(¥)', type: 'text', placeholder: '1600' },
        { key: 'late_rate', label: '逾期违约金(‰/日)', type: 'text', placeholder: '3' },
        { key: 'late_days', label: '逾期暂停交付天数', type: 'text', placeholder: '15' },
      ]},
      { title: '争议解决', fields: [
        { key: 'dispute_venue', label: '管辖法院所在地', type: 'text', placeholder: '乙方所在地' },
      ]},
    ],
    sample: {
      contract_no: 'HT-2026-008', sign_date: '2026-08-15', sign_place: '（在线签署）',
      party_a_name: '王某（个人）', party_a_contact: 'wx: xxxxx',
      party_b_name: '李某（独立开发者）', party_b_contact: 'wx: yyyyy',
      project_name: '某电商后台数据看板', scope_in: '开发运营数据可视化看板，含 8 个图表页面与导出功能',
      scope_out: '不包含需求方内部 ERP 系统改造、不包含移动端', tech_stack: 'Java(Spring Boot) + Vue3',
      deliverables: '1) 看板前端源码 2) 后端接口服务 3) 部署文档', acceptance_criteria: '8 个图表按原型渲染、数据接口平均响应 < 500ms、提供部署文档可独立部署',
      review_days: '5', total_amount: '8000', total_amount_cn: '捌仟元整',
      pay1_pct: '40', pay1_amt: '3200', pay2_pct: '40', pay2_amt: '3200', pay3_pct: '20', pay3_amt: '1600',
      late_rate: '3', late_days: '15', dispute_venue: '乙方所在地',
    },
    render(v) {
      const body = `# 私活软件开发服务合同（平台外）

**合同编号**：{{contract_no}}
**签订日期**：{{sign_date}}
**签订地点**：{{sign_place}}

**甲方（需求方 / 委托方）**
姓名 / 公司：{{party_a_name}}
联系方式：{{party_a_contact}}

**乙方（开发方 / 受托方）**
姓名 / 公司：{{party_b_name}}
联系方式：{{party_b_contact}}

双方本着平等、自愿、诚实信用的原则，就甲方委托乙方进行软件开发事宜达成如下协议：

## 一、项目范围
1. 项目名称：{{project_name}}
2. 开发内容（做什么）：{{scope_in}}
3. 明确不包含（不做什么）：{{scope_out}}
4. 技术栈 / 运行环境：{{tech_stack}}

## 二、交付物与验收
1. 交付物清单：{{deliverables}}
2. 验收标准：{{acceptance_criteria}}
3. 甲方应在乙方提交后 **{{review_days}}** 个工作日内完成验收，并书面（含邮件 / 聊天记录）反馈；**逾期未提出明确书面异议的，视为验收通过**。
4. **异议的有效要件**：甲方提出异议（含"不合格""需重做"等否定意见）时，**必须指明其指向《需求确认单》中的具体哪一条未满足，并附上可验证的证据（如功能名称、报错截图、操作步骤、对比预期与实际结果）**。仅以"不满意""感觉不对""再改改"等**笼统否定、未指明具体条款及证据**的，不视为有效异议，超时（第 3 款）届满仍视为验收通过。乙方有权据此拒绝无依据的反复修改要求。

## 三、报价与付款
1. 合同总金额：人民币 **¥{{total_amount}}**（大写：{{total_amount_cn}}）。
2. 付款方式（双方约定）：
   - 第一期：签约后支付 **{{pay1_pct}}%**（¥{{pay1_amt}}）
   - 第二期：交付后支付 **{{pay2_pct}}%**（¥{{pay2_amt}}）
   - 第三期（尾款）：验收通过后支付 **{{pay3_pct}}%**（¥{{pay3_amt}}）
3. 甲方逾期付款的，应按未付金额每日 **{{late_rate}}‰** 向乙方支付违约金；逾期超过 **{{late_days}}** 日的，乙方有权暂停交付且不退还已收款项以外的义务。

## 四、需求变更
1. 甲方新增或调整需求，须以**书面形式**（邮件 / 正式聊天确认）提出，经双方确认工作量与费用后再实施。
2. 乙方有权拒绝未书面确认的需求变更，由此产生的工期顺延由双方协商。

## 五、知识产权与源码
1. 在甲方**付清全部款项前**，本项目相关代码、文档的知识产权归**乙方**所有。
2. 甲方付清全部款项后，乙方将对应交付物的知识产权转让给甲方（另有约定的除外）。
3. 乙方保留将通用组件、框架、方法论用于其他项目的权利。

## 六、保密
双方对在合作中获知的对方商业秘密、技术信息予以保密，未经对方书面同意不得向第三方披露。本条款在合同终止后继续有效。

## 七、争议解决
因本合同引起的争议，双方应友好协商；协商不成的，提交**{{dispute_venue}}**有管辖权的人民法院诉讼解决。

## 八、其他
1. 本合同一式两份，甲乙双方各执一份，具同等效力。
2. 本合同自双方签字（或电子确认）之日起生效。

**甲方（签字）**：＿＿＿＿＿＿＿＿　**日期**：＿＿＿＿
**乙方（签字）**：＿＿＿＿＿＿＿＿　**日期**：＿＿＿＿`
      return DISCLAIMER + fill(body, v)
    },
  },

  /* ============ 免费版：接单确认单 ============ */
  {
    id: 'deal-confirm',
    title: '接单确认单（轻量版）',
    plan: 'free',
    desc: '一页纸快速对齐 + 留证；非正式合同，适合小额短周期私活',
    groups: [
      { title: '基础信息', fields: [
        { key: 'confirm_date', label: '日期', type: 'text', placeholder: '2026-08-13' },
        { key: 'party_a_name', label: '甲方（需求方）', type: 'text' },
        { key: 'party_b_name', label: '乙方（开发方）', type: 'text' },
      ]},
      { title: '接单概要', fields: [
        { key: 'one_liner', label: '这一单做什么（一句话）', type: 'textarea' },
        { key: 'deliverables', label: '交付物', type: 'textarea' },
        { key: 'total_amount', label: '总金额(¥)', type: 'text', placeholder: '3000' },
      ]},
      { title: '付款与边界', fields: [
        { key: 'pay1_pct', label: '签约付%', type: 'text', placeholder: '50' },
        { key: 'pay2_pct', label: '交付付%', type: 'text', placeholder: '30' },
        { key: 'pay3_pct', label: '验收付尾款%', type: 'text', placeholder: '20' },
        { key: 'late_days', label: '逾期暂停交付天数', type: 'text', placeholder: '10' },
        { key: 'review_days', label: '逾期视为验收天数', type: 'text', placeholder: '5' },
      ]},
    ],
    sample: {
      confirm_date: '2026-08-15', party_a_name: '王某', party_b_name: '李某',
      one_liner: '帮做一个商品数据爬虫 + 定时入库的小工具',
      deliverables: '1) 爬虫脚本 2) 数据库表结构 3) 使用说明',
      total_amount: '3000', pay1_pct: '50', pay2_pct: '30', pay3_pct: '20',
      late_days: '10', review_days: '5',
    },
    render(v) {
      const body = `# 接单确认单（轻量版）

**日期**：{{confirm_date}}
**甲方（需求方）**：{{party_a_name}}　**乙方（开发方）**：{{party_b_name}}

## 一、这一单做什么（一句话）
{{one_liner}}

## 二、报价与付款
- 总金额：**¥{{total_amount}}**
- 付款：签约付 {{pay1_pct}}% → 交付付 {{pay2_pct}}% → 验收付尾款 {{pay3_pct}}%
- 增项：口头不算，须书面确认再改价

## 三、交付物
{{deliverables}}

## 四、三条铁约定（防坑核心）
1. **变更书面确认**：需求改动发文字确认，不然乙方有权不做、不算违约。
2. **尾款前不交源码**：全款结清才转让代码；拖款超 {{late_days}} 天，乙方可暂停并保留已收。
3. **逾期视为验收**：交活后 {{review_days}} 天内甲方没提书面异议，算验收过、该付尾款。

## 五、双方确认
本单为接单备忘，双方认可上述约定。
甲方（签字/确认）：＿＿＿＿　乙方（签字/确认）：＿＿＿＿`
      return DISCLAIMER + fill(body, v)
    },
  },

  /* ============ 高级版：报价单（可重复行） ============ */
  {
    id: 'quote',
    title: '软件开发项目报价单',
    plan: 'pro',
    desc: '工作项明细表 + 费用合计 + 付款方式；支持多行工作项',
    groups: [
      { title: '基础信息', fields: [
        { key: 'quote_no', label: '报价单编号', type: 'text', placeholder: 'BJ-2026-001' },
        { key: 'quote_date', label: '日期', type: 'text', placeholder: '2026-08-13' },
        { key: 'valid_until', label: '有效期至', type: 'text', placeholder: '2026-08-27' },
        { key: 'party_a_name', label: '甲方（需求方）', type: 'text' },
        { key: 'party_b_name', label: '乙方（开发方）', type: 'text' },
      ]},
      { title: '工作项明细', fields: [
        { key: 'items', type: 'table', defaultRows: 3, columns: [
          { key: 'name', label: '工作项' },
          { key: 'desc', label: '说明' },
          { key: 'hours', label: '工时(h)' },
          { key: 'rate', label: '单价(¥/h)' },
        ]},
      ]},
      { title: '费用合计', fields: [
        { key: 'total_hours', label: '合计工时(h)', type: 'text', placeholder: '40' },
        { key: 'total_amount', label: '合计金额(¥)', type: 'text', placeholder: '8000' },
        { key: 'total_amount_cn', label: '金额大写', type: 'text', placeholder: '捌仟元整' },
        { key: 'excludes', label: '不含（服务器/第三方等）', type: 'text', placeholder: '服务器费用、第三方服务订阅' },
      ]},
      { title: '付款方式', fields: [
        { key: 'pay1_pct', label: '签约付%', type: 'text', placeholder: '40' },
        { key: 'pay2_pct', label: '交付付%', type: 'text', placeholder: '40' },
        { key: 'pay3_pct', label: '验收付尾款%', type: 'text', placeholder: '20' },
      ]},
    ],
    sample: {
      quote_no: 'BJ-2026-001', quote_date: '2026-08-15', valid_until: '2026-08-29',
      party_a_name: '王某', party_b_name: '李某',
      items: [
        { name: '需求梳理与方案', desc: '功能清单与技术方案', hours: '6', rate: '200' },
        { name: '后端接口开发', desc: '12 个 RESTful 接口', hours: '24', rate: '200' },
        { name: '前端看板页面', desc: '8 个图表页', hours: '10', rate: '200' },
      ],
      total_hours: '40', total_amount: '8000', total_amount_cn: '捌仟元整',
      excludes: '服务器费用、第三方服务订阅、差旅',
      pay1_pct: '40', pay2_pct: '40', pay3_pct: '20',
    },
    render(v) {
      const items = Array.isArray(v.items) ? v.items : []
      const rows = items.map((it, i) => {
        const h = Number(it.hours || 0)
        const r = Number(it.rate || 0)
        const sub = h * r
        return `| ${i + 1} | ${it.name || ''} | ${it.desc || ''} | ${it.hours || ''} | ${it.rate || ''} | ${sub} |`
      }).join('\n')
      const body = `# 软件开发项目报价单

**报价单编号**：{{quote_no}}
**日期**：{{quote_date}}
**有效期至**：{{valid_until}}（逾期请重新询价）

**甲方（需求方）**：{{party_a_name}}
**乙方（开发方）**：{{party_b_name}}

## 一、工作项明细
| 序号 | 工作项 | 说明 | 预估工时(h) | 单价(¥/h) | 小计(¥) |
|------|--------|------|------------|-----------|---------|
${rows}

## 二、费用合计
- 合计工时：{{total_hours}} h
- 合计金额：**¥{{total_amount}}**（大写：{{total_amount_cn}}）
- 不含：{{excludes}}（如服务器费用、第三方服务订阅、差旅等）

## 三、付款方式
- 签约付 {{pay1_pct}}%，交付付 {{pay2_pct}}%，验收付尾款 {{pay3_pct}}%。
- 增项：以书面确认的需求变更单为准，另行计费。

## 四、增项与改价规则
- 需求新增 / 范围扩大，按上述单价重新估算并书面确认后执行。
- 本报价基于当前需求；若甲方在开发中途大幅调整方向，工期与费用相应调整。

**乙方确认**：＿＿＿＿＿＿＿＿　**甲方确认**：＿＿＿＿＿＿＿＿`
      return DISCLAIMER + fill(body, v)
    },
  },

  /* ============ 高级版：需求确认单 ============ */
  {
    id: 'requirement',
    title: '项目需求确认单',
    plan: 'pro',
    desc: '必做/选做拆分 + 非功能要求 + 验收标准，锁范围防需求反复变',
    groups: [
      { title: '基础信息', fields: [
        { key: 'project_name', label: '项目', type: 'text' },
        { key: 'confirm_date', label: '确认日期', type: 'text', placeholder: '2026-08-13' },
        { key: 'party_a_name', label: '甲方', type: 'text' },
        { key: 'party_b_name', label: '乙方', type: 'text' },
      ]},
      { title: '项目背景', fields: [
        { key: 'background', label: '项目背景', type: 'textarea' },
      ]},
      { title: '功能清单', fields: [
        { key: 'must1', label: '✅ 必做 1', type: 'text' },
        { key: 'must2', label: '✅ 必做 2', type: 'text' },
        { key: 'must3', label: '✅ 必做 3', type: 'text' },
        { key: 'opt1', label: '➕ 选做 1', type: 'text' },
        { key: 'opt2', label: '➕ 选做 2', type: 'text' },
      ]},
      { title: '非功能要求', fields: [
        { key: 'env', label: '运行环境/浏览器', type: 'text', placeholder: 'Chrome / Edge，服务端 Linux' },
        { key: 'perf', label: '性能要求', type: 'text', placeholder: '接口平均响应 < 500ms' },
        { key: 'security', label: '安全要求', type: 'text', placeholder: '不存储明文密码' },
      ]},
      { title: '验收标准', fields: [
        { key: 'crit1', label: '验收标准 1', type: 'text' },
        { key: 'crit2', label: '验收标准 2', type: 'text' },
      ]},
    ],
    sample: {
      project_name: '某电商后台数据看板', confirm_date: '2026-08-16',
      party_a_name: '王某', party_b_name: '李某',
      background: '运营需要每日查看核心指标，目前靠手工导出 Excel，效率低',
      must1: '8 个核心指标图表页', must2: '数据导出 Excel/CSV', must3: '按日期筛选',
      opt1: '移动端适配', opt2: '自动邮件日报',
      env: 'Chrome / Edge；服务端 Linux + MySQL', perf: '图表首屏 < 1.5s，接口 < 500ms',
      security: '仅内部使用，登录鉴权', crit1: '8 图表按原型渲染无误', crit2: '导出文件字段完整',
    },
    render(v) {
      const body = `# 项目需求确认单

**项目**：{{project_name}}
**确认日期**：{{confirm_date}}
**甲方**：{{party_a_name}}　**乙方**：{{party_b_name}}

## 一、项目背景
{{background}}

## 二、功能清单
**✅ 必做（本次交付范围）**
1. {{must1}}
2. {{must2}}
3. {{must3}}

**➕ 选做（视情况 / 另计费）**
1. {{opt1}}
2. {{opt2}}

## 三、非功能要求
- 运行环境 / 浏览器：{{env}}
- 性能要求：{{perf}}
- 安全要求：{{security}}

## 四、验收标准
1. {{crit1}}
2. {{crit2}}

## 五、关键约定
- 本确认单范围内的需求，乙方负责实现；**范围外需求须书面变更确认，另行计费**。
- 双方签字（或电子确认）后，本单作为合同 / 接单确认单的附件，具同等效力。

**甲方确认**：＿＿＿＿＿＿＿＿　**乙方确认**：＿＿＿＿＿＿＿＿`
      return DISCLAIMER + fill(body, v)
    },
  },

  /* ============ 高级版：验收单 ============ */
  {
    id: 'acceptance',
    title: '项目验收单',
    plan: 'pro',
    desc: '交付物核对 + 验收结论（不通过须勾选具体条款+证据）+ 尾款释放',
    groups: [
      { title: '基础信息', fields: [
        { key: 'project_name', label: '项目', type: 'text' },
        { key: 'accept_date', label: '验收日期', type: 'text', placeholder: '2026-08-30' },
        { key: 'party_a_name', label: '甲方', type: 'text' },
        { key: 'party_b_name', label: '乙方', type: 'text' },
      ]},
      { title: '交付物核对', fields: [
        { key: 'd1', label: '交付物 1', type: 'text' },
        { key: 'd1_status', label: '状态 1（✅已交付/⚠️待补）', type: 'text', placeholder: '✅已交付' },
        { key: 'd2', label: '交付物 2', type: 'text' },
        { key: 'd2_status', label: '状态 2', type: 'text', placeholder: '✅已交付' },
      ]},
      { title: '验收结论', fields: [
        { key: 'issues', label: '遗留问题（有条件通过时填）', type: 'textarea' },
        { key: 'req1_no', label: '不符项1 · 需求单编号', type: 'text', placeholder: '№2' },
        { key: 'req1_desc', label: '不符项1 · 条款描述', type: 'text' },
        { key: 'req1_evidence', label: '不符项1 · 证据', type: 'text' },
        { key: 'req2_no', label: '不符项2 · 需求单编号', type: 'text', placeholder: '№3' },
        { key: 'req2_desc', label: '不符项2 · 条款描述', type: 'text' },
        { key: 'reject_reason', label: '其他不符（注明编号）', type: 'text' },
      ]},
      { title: '尾款释放', fields: [
        { key: 'pay_deadline', label: '尾款支付截止日', type: 'text', placeholder: '2026-09-03' },
        { key: 'final_pay', label: '尾款金额(¥)', type: 'text', placeholder: '1600' },
      ]},
    ],
    sample: {
      project_name: '某电商后台数据看板', accept_date: '2026-08-30',
      party_a_name: '王某', party_b_name: '李某',
      d1: '看板前端源码', d1_status: '✅已交付', d2: '后端接口服务', d2_status: '✅已交付',
      issues: '图表配色微调，乙方 3 日内完成',
      req1_no: '№2', req1_desc: '必做2 数据导出', req1_evidence: '导出文件字段完整，已验证',
      req2_no: '№3', req2_desc: '必做3 日期筛选', req2_evidence: '筛选功能正常',
      reject_reason: '', pay_deadline: '2026-09-03', final_pay: '1600',
    },
    render(v) {
      const body = `# 项目验收单

**项目**：{{project_name}}
**验收日期**：{{accept_date}}
**甲方**：{{party_a_name}}　**乙方**：{{party_b_name}}

## 一、交付物核对
| 序号 | 交付物 | 状态（✅已交付 / ⚠️待补） |
|------|--------|--------------------------|
| 1 | {{d1}} | {{d1_status}} |
| 2 | {{d2}} | {{d2_status}} |

## 二、验收结论
- [ ] **通过**：符合需求确认单约定，甲方确认验收。
- [ ] **有条件通过**：存在下列遗留问题，甲方先付尾款、乙方限期修复。
     遗留问题：{{issues}}
- [ ] **不通过**：必须勾选下列不符项（对应《需求确认单》具体条款 + 可验证证据），仅写"不满意"不构成有效不通过：
      - [ ] 需求确认单 {{req1_no}}「{{req1_desc}}」未满足：证据 {{req1_evidence}}
      - [ ] 需求确认单 {{req2_no}}「{{req2_desc}}」未满足：证据 {{req2_evidence}}
      - [ ] 其他条款（注明编号）：{{reject_reason}}

## 三、尾款释放
- 结论为「通过」或「有条件通过」的，甲方应于 **{{pay_deadline}}** 前支付尾款 ¥{{final_pay}}。
- 尾款结清后，对应交付物知识产权按合同约定转让。

**甲方签字**：＿＿＿＿＿＿＿＿　**乙方签字**：＿＿＿＿＿＿＿＿`
      return DISCLAIMER + fill(body, v)
    },
  },
]

export const FREE_IDS = templates.filter((t) => t.plan === 'free').map((t) => t.id)
