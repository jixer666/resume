/**
 * 模板市场重做·第一批物料：求职意向 / 教育背景 / 技能特长 的新版式。
 *
 * 这些版式逐条对照 wondercv 参考图：
 * - 竖线标签行、时间轴、左右分栏、表格式、卡片、标签云、进度条、深色侧栏白字
 * 用法：node .task/20260927-模板市场扩充/gen-v2-a.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')
const files = {}

/* ---------------- 求职意向 ---------------- */

// 求职意向·竖线标签行：左侧主题色竖线 + 逐行「标签：值」
files['Common/JobIntention/JobIntention2.vue'] = `<!-- 求职意向·竖线标签行：左侧主题色竖线 + 逐行「标签：值」 -->
<template>
  <div class="job-intention-content u-tag-div">
    <div v-show="modelData.isShow.intendedPositions" class="line u-tag-div">
      <span class="label u-tag-span">期望职位</span>
      <span class="value u-tag-span">{{ modelData.intendedPositions }}</span>
    </div>
    <div v-show="modelData.isShow.intendedCity" class="line u-tag-div">
      <span class="label u-tag-span">期望城市</span>
      <span class="value u-tag-span">{{ modelData.intendedCity }}</span>
    </div>
    <div v-show="modelData.isShow.expectSalary" class="line u-tag-div">
      <span class="label u-tag-span">期望薪资</span>
      <span class="value u-tag-span">{{ modelData.expectSalary }}</span>
    </div>
    <div v-show="modelData.isShow.jobSearchType" class="line u-tag-div">
      <span class="label u-tag-span">求职类型</span>
      <span class="value u-tag-span">{{ modelData.jobSearchType }}</span>
    </div>
    <div v-show="modelData.isShow.jobStatus" class="line u-tag-div">
      <span class="label u-tag-span">求职状态</span>
      <span class="value u-tag-span">{{ modelData.jobStatus }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IJOBINTENTION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IJOBINTENTION // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .job-intention-content {
  box-sizing: border-box;
  padding-top: 15px;
  padding-left: 12px;
  border-left: 3px solid v-bind('modelStyle.themeColor');
  .line {
    display: flex;
    align-items: baseline;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
    .label {
      width: 72px;
      flex-shrink: 0;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
    }
    .value {
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.titleColor');
      font-weight: 600;
    }
  }
}
</style>
`

// 求职意向·深色侧栏白字：白字逐行标签，供 leftRight 侧栏使用
files['Common/JobIntention/JobIntention3.vue'] = `<!-- 求职意向·深色侧栏白字：白字逐行「标签 值」，供侧栏使用 -->
<template>
  <div class="job-intention-content u-tag-div">
    <div v-show="modelData.isShow.intendedPositions" class="side-line u-tag-div">
      <span class="side-label u-tag-span">期望职位</span>
      <span class="side-value u-tag-span">{{ modelData.intendedPositions }}</span>
    </div>
    <div v-show="modelData.isShow.intendedCity" class="side-line u-tag-div">
      <span class="side-label u-tag-span">期望城市</span>
      <span class="side-value u-tag-span">{{ modelData.intendedCity }}</span>
    </div>
    <div v-show="modelData.isShow.expectSalary" class="side-line u-tag-div">
      <span class="side-label u-tag-span">期望薪资</span>
      <span class="side-value u-tag-span">{{ modelData.expectSalary }}</span>
    </div>
    <div v-show="modelData.isShow.jobSearchType" class="side-line u-tag-div">
      <span class="side-label u-tag-span">求职类型</span>
      <span class="side-value u-tag-span">{{ modelData.jobSearchType }}</span>
    </div>
    <div v-show="modelData.isShow.jobStatus" class="side-line u-tag-div">
      <span class="side-label u-tag-span">求职状态</span>
      <span class="side-value u-tag-span">{{ modelData.jobStatus }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IJOBINTENTION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IJOBINTENTION // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .job-intention-content {
  box-sizing: border-box;
  padding-top: 15px;
  .side-line {
    display: flex;
    align-items: baseline;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .side-label {
      width: 64px;
      flex-shrink: 0;
      font-size: 13px;
      color: rgb(255 255 255 / 0.62);
    }
    .side-value {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      word-break: break-all;
    }
  }
}
</style>
`

/* ---------------- 教育背景 ---------------- */

// 教育背景·时间轴：左圆点竖线 + 学校粗体/日期右对齐 + 专业学历 + 主修课程
files['Common/EduBackground/EduBackground5.vue'] = `<!-- 教育背景·时间轴：左圆点竖线 + 学校粗体与日期同行 + 专业学历与主修课程 -->
<template>
  <div class="edu-background-content u-tag-div">
    <div class="edu-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
        <div class="timeline u-tag-div">
          <div class="dot u-tag-div" />
          <div v-if="index !== modelData.LIST.length - 1" class="line u-tag-div" />
        </div>
        <div class="body u-tag-div">
          <div class="head u-tag-div">
            <span v-if="modelData.isShow.schoolName" class="school u-tag-span">{{ item.schoolName }}</span>
            <span v-if="modelData.isShow.date" class="date u-tag-span">{{ formatDate(item.date) }}</span>
          </div>
          <div v-if="modelData.isShow.specialized || modelData.isShow.degree" class="sub u-tag-div">
            <span v-if="modelData.isShow.specialized" class="u-tag-span">{{ item.specialized }}</span>
            <span v-if="modelData.isShow.degree" class="u-tag-span">{{ item.degree }}</span>
          </div>
          <div v-if="modelData.isShow.majorCourse" class="course u-tag-div">
            <RichTextView :html="item.majorCourse" :model-style="modelStyle" extra-style="letter-spacing:1px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IEDUBACKGROUND } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .edu-background-content {
  box-sizing: border-box;
  .edu-list {
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
        margin-left: 12px;
        .head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          .school {
            font-size: v-bind('modelStyle.titleFontSize');
            color: v-bind('modelStyle.titleColor');
            font-weight: 600;
            letter-spacing: 1px;
          }
          .date {
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
          .u-tag-span {
            font-size: v-bind('modelStyle.textFontSize');
            color: v-bind('modelStyle.textColor');
            margin-right: 12px;
          }
        }
        .course {
          margin-top: 6px;
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
`

// 教育背景·左右分栏：左侧窄栏日期与学历，右侧学校/专业/主修课程
files['Common/EduBackground/EduBackground6.vue'] = `<!-- 教育背景·左右分栏：左侧窄栏日期与学历，右侧学校专业与主修课程 -->
<template>
  <div class="edu-background-content u-tag-div">
    <div class="edu-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="row u-tag-div">
        <div class="left u-tag-div">
          <span v-if="modelData.isShow.date" class="date u-tag-span">{{ formatDate(item.date) }}</span>
          <span v-if="modelData.isShow.degree" class="degree u-tag-span">{{ item.degree }}</span>
        </div>
        <div class="right u-tag-div">
          <span v-if="modelData.isShow.schoolName" class="school u-tag-span">{{ item.schoolName }}</span>
          <span v-if="modelData.isShow.specialized" class="major u-tag-span">{{ item.specialized }}</span>
          <p v-if="modelData.isShow.majorCourse" class="course u-tag-p">
            <RichTextView :html="item.majorCourse" :model-style="modelStyle" extra-style="letter-spacing:1px" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IEDUBACKGROUND } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .edu-background-content {
  box-sizing: border-box;
  .edu-list {
    padding-top: 15px;
    box-sizing: border-box;
    .row {
      display: flex;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 18px);
      }
      .left {
        width: 30%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-right: 12px;
        .date {
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.themeColor');
          font-weight: 600;
          letter-spacing: 1px;
        }
        .degree {
          margin-top: 4px;
          font-size: v-bind('modelStyle.textFontSize');
          color: #9ca3af;
        }
      }
      .right {
        flex: 1;
        min-width: 0;
        .school {
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: 600;
          letter-spacing: 1px;
        }
        .major {
          margin-left: 10px;
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
        }
        .course {
          margin-top: 6px;
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
`

// 教育背景·表格式：顶部细线 + 学校粗体与日期同行 + 专业学位灰色 + 主修课程
files['Common/EduBackground/EduBackground7.vue'] = `<!-- 教育背景·表格式：顶部细线分隔，学校粗体与日期同行，专业学历与主修课程 -->
<template>
  <div class="edu-background-content u-tag-div">
    <div class="edu-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="row u-tag-div">
        <div class="head u-tag-div">
          <span v-if="modelData.isShow.schoolName" class="school u-tag-span">{{ item.schoolName }}</span>
          <span v-if="modelData.isShow.specialized" class="major u-tag-span">{{ item.specialized }}</span>
          <span v-if="modelData.isShow.degree" class="degree u-tag-span">{{ item.degree }}</span>
          <span v-if="modelData.isShow.date" class="date u-tag-span">{{ formatDate(item.date) }}</span>
        </div>
        <p v-if="modelData.isShow.majorCourse" class="course u-tag-p">
          <RichTextView :html="item.majorCourse" :model-style="modelStyle" extra-style="letter-spacing:1px" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IEDUBACKGROUND } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .edu-background-content {
  box-sizing: border-box;
  .edu-list {
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
        align-items: baseline;
        .school {
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: 600;
          letter-spacing: 1px;
        }
        .major {
          margin-left: 12px;
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
        }
        .degree {
          margin-left: 10px;
          font-size: v-bind('modelStyle.textFontSize');
          color: v-bind('modelStyle.textColor');
        }
        .date {
          flex: 1;
          text-align: right;
          font-size: v-bind('modelStyle.textFontSize');
          color: #9ca3af;
        }
      }
      .course {
        margin-top: 6px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        line-height: 1.5;
      }
    }
  }
}
</style>
`

// 教育背景·深色侧栏白字：白字学校与专业学历，供侧栏使用
files['Common/EduBackground/EduBackground8.vue'] = `<!-- 教育背景·深色侧栏白字：白字学校与专业学历，供侧栏使用 -->
<template>
  <div class="edu-background-content u-tag-div">
    <div class="edu-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="side-item u-tag-div">
        <div v-if="modelData.isShow.schoolName" class="side-school u-tag-span">{{ item.schoolName }}</div>
        <div v-if="modelData.isShow.specialized || modelData.isShow.degree" class="side-sub u-tag-div">
          <span v-if="modelData.isShow.specialized" class="u-tag-span">{{ item.specialized }}</span>
          <span v-if="modelData.isShow.degree" class="u-tag-span">{{ item.degree }}</span>
        </div>
        <div v-if="modelData.isShow.date" class="side-date u-tag-span">{{ formatDate(item.date) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IEDUBACKGROUND } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .edu-background-content {
  box-sizing: border-box;
  padding-top: 15px;
  .edu-list {
    .side-item {
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 16px);
      }
      .side-school {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        letter-spacing: 1px;
      }
      .side-sub {
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;
        .u-tag-span {
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
    }
  }
}
</style>
`

/* ---------------- 技能特长 ---------------- */

// 技能特长·引导点线：技能名与点线延伸
files['Common/SkillSpecialties/SkillSpecialties7.vue'] = `<!-- 技能特长·引导点线：技能名粗体 + 点线延伸到右端 + 熟练度 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <div v-if="useTags" class="skill-list u-tag-div">
      <div v-for="(tag, index) in tags" :key="index" class="skill u-tag-div">
        <span class="name u-tag-span">{{ tag }}</span>
        <span class="dot-line u-tag-span" />
      </div>
    </div>
    <RichTextView v-else :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
  </div>
</template>

<script setup lang="ts">
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: ISKILLSPECIALTIES
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 与标签云同一套拆分口径：段落与顿号都算分隔 */
const tags = computed(() => {
  const html = String(props.modelData.content || '')
    .replace(/<\\/(p|div|li)>/gi, '\\n')
    .replace(/<br\\s*\\/?>/gi, '\\n')
  return html
    .replace(/<[^>]+>/g, '')
    .split(/[、，,;；\\n]+/)
    .map(tag => tag.trim())
    .filter(Boolean)
})

const useTags = computed(() => tags.value.length > 1)

/** 点线比正文浅，只做视觉引导 */
const lineColor = computed(() => lightenColor(props.modelStyle.themeColor, 0.55))
</script>

<style lang="scss" scoped>
  .skill-specialties-content {
  box-sizing: border-box;
  padding-top: 15px;
  .skill-list {
    .skill {
      display: flex;
      align-items: baseline;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 10px);
      }
      .name {
        flex-shrink: 0;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: 600;
        letter-spacing: 1px;
      }
      .dot-line {
        flex: 1;
        margin-left: 10px;
        border-bottom: 1px dotted v-bind('lineColor');
      }
    }
  }
}
</style>
`

// 技能特长·左右分栏：左侧技能名主题色粗体，右侧描述
files['Common/SkillSpecialties/SkillSpecialties8.vue'] = `<!-- 技能特长·左右分栏：左侧技能名主题色粗体，右侧描述 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <div v-if="useTags" class="skill-list u-tag-div">
      <div v-for="(tag, index) in tags" :key="index" class="skill u-tag-div">
        <span class="name u-tag-span">{{ tag }}</span>
      </div>
    </div>
    <RichTextView v-else :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
  </div>
</template>

<script setup lang="ts">
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: ISKILLSPECIALTIES
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 与标签云同一套拆分口径：段落与顿号都算分隔 */
const tags = computed(() => {
  const html = String(props.modelData.content || '')
    .replace(/<\\/(p|div|li)>/gi, '\\n')
    .replace(/<br\\s*\\/?>/gi, '\\n')
  return html
    .replace(/<[^>]+>/g, '')
    .split(/[、，,;；\\n]+/)
    .map(tag => tag.trim())
    .filter(Boolean)
})

const useTags = computed(() => tags.value.length > 1)

/** 左侧技能名底色取主题色兑白，主题色字压在上层 */
const nameBg = computed(() => lightenColor(props.modelStyle.themeColor, 0.9))
</script>

<style lang="scss" scoped>
  .skill-specialties-content {
  box-sizing: border-box;
  padding-top: 15px;
  .skill-list {
    display: flex;
    flex-wrap: wrap;
    .skill {
      margin: 0 8px 8px 0;
      .name {
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
        padding: 3px 12px;
        border-left: 3px solid v-bind('modelStyle.themeColor');
        border-radius: 2px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: 600;
        background-color: v-bind('nameBg');
        letter-spacing: 1px;
      }
    }
  }
}
</style>
`

// 技能特长·深色侧栏白字：白字技能标签，供侧栏使用
files['Common/SkillSpecialties/SkillSpecialties9.vue'] = `<!-- 技能特长·深色侧栏白字：白字技能标签，供侧栏使用 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <div v-if="useTags" class="skill-list u-tag-div">
      <span v-for="(tag, index) in tags" :key="index" class="tag u-tag-span">{{ tag }}</span>
    </div>
    <RichTextView v-else :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
  </div>
</template>

<script setup lang="ts">
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'

const props = defineProps<{
  modelData: ISKILLSPECIALTIES
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 与标签云同一套拆分口径：段落与顿号都算分隔 */
const tags = computed(() => {
  const html = String(props.modelData.content || '')
    .replace(/<\\/(p|div|li)>/gi, '\\n')
    .replace(/<br\\s*\\/?>/gi, '\\n')
  return html
    .replace(/<[^>]+>/g, '')
    .split(/[、，,;；\\n]+/)
    .map(tag => tag.trim())
    .filter(Boolean)
})

const useTags = computed(() => tags.value.length > 1)
</script>

<style lang="scss" scoped>
  .skill-specialties-content {
  box-sizing: border-box;
  padding-top: 15px;
  .skill-list {
    display: flex;
    flex-wrap: wrap;
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      margin: 0 8px 8px 0;
      border-radius: 999px;
      font-size: 13px;
      color: #fff;
      background-color: rgb(255 255 255 / 0.18);
    }
  }
}
</style>
`

// 技能特长·卡片网格：两列浅底卡片，每张卡片一个技能标签
files['Common/SkillSpecialties/SkillSpecialties10.vue'] = `<!-- 技能特长·卡片网格：两列浅主题色卡片，每张卡片一个技能标签 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <div v-if="useTags" class="skill-grid u-tag-div">
      <div v-for="(tag, index) in tags" :key="index" class="skill u-tag-div">
        <span class="name u-tag-span">{{ tag }}</span>
      </div>
    </div>
    <RichTextView v-else :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
  </div>
</template>

<script setup lang="ts">
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: ISKILLSPECIALTIES
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 与标签云同一套拆分口径：段落与顿号都算分隔 */
const tags = computed(() => {
  const html = String(props.modelData.content || '')
    .replace(/<\\/(p|div|li)>/gi, '\\n')
    .replace(/<br\\s*\\/?>/gi, '\\n')
  return html
    .replace(/<[^>]+>/g, '')
    .split(/[、，,;；\\n]+/)
    .map(tag => tag.trim())
    .filter(Boolean)
})

const useTags = computed(() => tags.value.length > 1)

/** 卡片底色取主题色兑白，左边一条主题色竖线做重点 */
const cardColor = computed(() => lightenColor(props.modelStyle.themeColor, 0.94))
</script>

<style lang="scss" scoped>
  .skill-specialties-content {
  box-sizing: border-box;
  padding-top: 15px;
  .skill-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
    .skill {
      box-sizing: border-box;
      padding: 8px 12px;
      border-left: 3px solid v-bind('modelStyle.themeColor');
      border-radius: 3px;
      background-color: v-bind('cardColor');
      .name {
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: 600;
        letter-spacing: 1px;
      }
    }
  }
}
</style>
`

let written = 0
for (const [rel, src] of Object.entries(files)) {
  const target = resolve(appRoot, 'src/material', rel)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, src, 'utf8')
  written += 1
}
console.log(`第一批物料已生成 ${written} 个文件`)