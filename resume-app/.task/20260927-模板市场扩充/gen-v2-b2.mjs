/** 模板市场重做·第二批之二：四类经历的表格式 / 卡片 / 深色侧栏版式 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')
const files = {}

const EXP = [
  { dir: 'WorkExperience', type: 'IWORKEXPERIENCE', kebab: 'work-experience', no: 22, name: 'companyName', nameShow: 'companyName', subs: ['posts', 'department'], content: 'jobContent' },
  { dir: 'ProjectExperience', type: 'IPROJECTEXPERIENCE', kebab: 'project-experience', no: 22, name: 'projectName', nameShow: 'projectName', subs: ['posts'], content: 'projectContent' },
  { dir: 'CampusExperience', type: 'ICAMPUSEXPERIENCE', kebab: 'campus-experience', no: 22, name: 'campusBriefly', nameShow: 'campusBriefly', subs: ['campusDuty'], content: 'campusContent' },
  { dir: 'InternshipExperience', type: 'IINTERNSHIPEXPERIENCE', kebab: 'internship-experience', no: 22, name: 'companyName', nameShow: 'companyName', subs: ['posts', 'department'], content: 'jobContent' },
]

function table(m) {
  const subs = m.subs.map(f => `          <span v-if="modelData.isShow.${f}" class="sub-item u-tag-span">{{ item.${f} }}</span>`).join('\n')
  const subShow = m.subs.map(f => `modelData.isShow.${f}`).join(' || ')
  return `<!-- ${m.dir}·表格式：顶部细线分隔行，名称粗体与日期同行，副信息与描述在下方 -->
<template>
  <div class="${m.kebab}-content u-tag-div">
    <div class="${m.kebab}-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="row u-tag-div">
        <div class="head u-tag-div">
          <span v-if="modelData.isShow.${m.nameShow}" class="head-title u-tag-span">{{ item.${m.name} }}</span>
          <span v-if="modelData.isShow.date" class="head-date u-tag-span">{{ formatDate(item.date) }}</span>
        </div>
        <div v-if="${subShow}" class="sub u-tag-div">
${subs}
        </div>
        <div v-if="item.${m.content}" class="content u-tag-div">
          <RichTextView :html="item.${m.content}" :model-style="modelStyle" extra-style="letter-spacing:1px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ${m.type} } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ${m.type}
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .${m.kebab}-content {
  box-sizing: border-box;
  .${m.kebab}-list {
    padding-top: 15px;
    box-sizing: border-box;
    .row {
      box-sizing: border-box;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 16px);
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .head-title {
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: 600;
          letter-spacing: 1px;
        }
        .head-date {
          flex-shrink: 0;
          margin-left: 12px;
          font-size: v-bind('modelStyle.textFontSize');
          color: #9ca3af;
        }
      }
      .sub {
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;
        .sub-item {
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
          margin-right: 12px;
        }
      }
      .content {
        margin-top: 6px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        line-height: 1.5;
        text-align: justify;
      }
    }
  }
}
</style>
`
}

function card(m) {
  const subs = m.subs.map(f => `          <span v-if="modelData.isShow.${f}" class="sub-item u-tag-span">{{ item.${f} }}</span>`).join('\n')
  const subShow = m.subs.map(f => `modelData.isShow.${f}`).join(' || ')
  return `<!-- ${m.dir}·卡片：浅主题色底圆角卡片，左侧主题色竖条做重点 -->
<template>
  <div class="${m.kebab}-content u-tag-div">
    <div class="${m.kebab}-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="card u-tag-div">
        <div class="head u-tag-div">
          <span v-if="modelData.isShow.${m.nameShow}" class="head-title u-tag-span">{{ item.${m.name} }}</span>
          <span v-if="modelData.isShow.date" class="head-date u-tag-span">{{ formatDate(item.date) }}</span>
        </div>
        <div v-if="${subShow}" class="sub u-tag-div">
${subs}
        </div>
        <div v-if="item.${m.content}" class="content u-tag-div">
          <RichTextView :html="item.${m.content}" :model-style="modelStyle" extra-style="letter-spacing:1px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ${m.type} } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: ${m.type}
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 卡片底取主题色兑白，左侧竖条用主题色本身做重点 */
const cardColor = computed(() => lightenColor(props.modelStyle.themeColor, 0.95))
</script>

<style lang="scss" scoped>
  .${m.kebab}-content {
  box-sizing: border-box;
  .${m.kebab}-list {
    padding-top: 15px;
    box-sizing: border-box;
    .card {
      box-sizing: border-box;
      padding: 10px 14px;
      border-left: 3px solid v-bind('modelStyle.themeColor');
      border-radius: 4px;
      background-color: v-bind('cardColor');
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 14px);
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .head-title {
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: 600;
          letter-spacing: 1px;
        }
        .head-date {
          flex-shrink: 0;
          margin-left: 12px;
          font-size: v-bind('modelStyle.textFontSize');
          color: #9ca3af;
        }
      }
      .sub {
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;
        .sub-item {
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
          margin-right: 12px;
        }
      }
      .content {
        margin-top: 6px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        line-height: 1.5;
        text-align: justify;
      }
    }
  }
}
</style>
`
}

function sidebar(m) {
  const subs = m.subs.map(f => `          <span v-if="modelData.isShow.${f}" class="side-sub u-tag-span">{{ item.${f} }}</span>`).join('\n')
  const subShow = m.subs.map(f => `modelData.isShow.${f}`).join(' || ')
  return `<!-- ${m.dir}·深色侧栏白字：白字名称与副信息，供 leftRight 侧栏使用 -->
<template>
  <div class="${m.kebab}-content u-tag-div">
    <div class="${m.kebab}-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="side-item u-tag-div">
        <div v-if="modelData.isShow.${m.nameShow}" class="side-title u-tag-span">{{ item.${m.name} }}</div>
        <div v-if="${subShow}" class="side-sub-row u-tag-div">
${subs}
        </div>
        <div v-if="modelData.isShow.date" class="side-date u-tag-span">{{ formatDate(item.date) }}</div>
        <div v-if="item.${m.content}" class="side-content u-tag-div">
          <RichTextView :html="item.${m.content}" :model-style="modelStyle" extra-style="letter-spacing:1px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ${m.type} } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ${m.type}
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .${m.kebab}-content {
  box-sizing: border-box;
  padding-top: 15px;
  .${m.kebab}-list {
    .side-item {
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 16px);
      }
      .side-title {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        letter-spacing: 1px;
      }
      .side-sub-row {
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;
        .side-sub {
          font-size: 13px;
          color: rgb(255 255 255 / 0.68);
          margin-right: 10px;
        }
      }
      .side-date {
        display: block;
        margin-top: 4px;
        font-size: 13px;
        color: rgb(255 255 255 / 0.68);
      }
      .side-content {
        margin-top: 6px;
        font-size: 13px;
        color: rgb(255 255 255 / 0.78);
        line-height: 1.5;
      }
    }
  }
}
</style>
`
}

for (const m of EXP) {
  files[`Common/${m.dir}/${m.dir}${m.no + 2}.vue`] = table(m)
  files[`Common/${m.dir}/${m.dir}${m.no + 3}.vue`] = card(m)
  files[`Common/${m.dir}/${m.dir}${m.no + 4}.vue`] = sidebar(m)
}

let written = 0
for (const [rel, src] of Object.entries(files)) {
  const target = resolve(appRoot, 'src/material', rel)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, src, 'utf8')
  written += 1
}
console.log(`第二批之二已生成 ${written} 个文件`)