/** 模板市场重做·第二批之一：四类经历的时间轴版式 */
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

function timeline(m) {
  const subs = m.subs.map(f => `            <span v-if="modelData.isShow.${f}" class="sub-item u-tag-span">{{ item.${f} }}</span>`).join('\n')
  const subShow = m.subs.map(f => `modelData.isShow.${f}`).join(' || ')
  return `<!-- ${m.dir}·时间轴：左侧圆点竖线，名称粗体与日期同行，副信息与描述在右侧 -->
<template>
  <div class="${m.kebab}-content u-tag-div">
    <div class="${m.kebab}-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
        <div class="timeline u-tag-div">
          <div class="dot u-tag-div" />
          <div v-if="index !== modelData.LIST.length - 1" class="line u-tag-div" />
        </div>
        <div class="body u-tag-div">
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
    .list {
      display: flex;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 20px);
      }
      .timeline {
        width: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        padding-top: 4px;
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: v-bind('modelStyle.themeColor');
          flex-shrink: 0;
        }
        .line {
          flex: 1;
          width: 1px;
          background-color: #e5e7eb;
          margin-top: 4px;
        }
      }
      .body {
        flex: 1;
        min-width: 0;
        margin-left: 12px;
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
            font-size: v-bind('modelStyle.titleFontSize');
            color: #9ca3af;
          }
        }
        .sub {
          display: flex;
          flex-wrap: wrap;
          margin-top: 4px;
          .sub-item {
            font-size: v-bind('modelStyle.textFontSize');
            color: v-bind('modelStyle.themeColor');
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
}
</style>
`
}

function split(m) {
  const subs = m.subs.map(f => `            <span v-if="modelData.isShow.${f}" class="sub-item u-tag-span">{{ item.${f} }}</span>`).join('\n')
  const subShow = m.subs.map(f => `modelData.isShow.${f}`).join(' || ')
  return `<!-- ${m.dir}·左右分栏：左侧窄栏时间与名称，右侧副信息与描述 -->
<template>
  <div class="${m.kebab}-content u-tag-div">
    <div class="${m.kebab}-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="row u-tag-div">
        <div class="left u-tag-div">
          <span v-if="modelData.isShow.date" class="date u-tag-span">{{ formatDate(item.date) }}</span>
          <span v-if="modelData.isShow.${m.nameShow}" class="name u-tag-span">{{ item.${m.name} }}</span>
        </div>
        <div class="right u-tag-div">
          <div v-if="${subShow}" class="sub u-tag-div">
${subs}
          </div>
          <div v-if="item.${m.content}" class="content u-tag-div">
            <RichTextView :html="item.${m.content}" :model-style="modelStyle" extra-style="letter-spacing:1px" />
          </div>
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
      display: flex;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 20px);
      }
      .left {
        width: 30%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-right: 14px;
        .date {
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.themeColor');
          font-weight: 600;
          letter-spacing: 1px;
        }
        .name {
          margin-top: 4px;
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: 600;
          line-height: 1.4;
        }
      }
      .right {
        flex: 1;
        min-width: 0;
        .sub {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 6px;
          .sub-item {
            font-size: v-bind('modelStyle.textFontSize');
            color: #6b7280;
            margin-right: 12px;
          }
        }
        .content {
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
          font-weight: v-bind('modelStyle.textFontWeight');
          line-height: 1.5;
          text-align: justify;
        }
      }
    }
  }
}
</style>
`
}

for (const m of EXP) {
  files[`Common/${m.dir}/${m.dir}${m.no}.vue`] = timeline(m)
  files[`Common/${m.dir}/${m.dir}${m.no + 1}.vue`] = split(m)
}

let written = 0
for (const [rel, src] of Object.entries(files)) {
  const target = resolve(appRoot, 'src/material', rel)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, src, 'utf8')
  written += 1
}
console.log(`第二批之一已生成 ${written} 个文件`)