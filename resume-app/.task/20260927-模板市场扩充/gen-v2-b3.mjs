/** 模板市场重做·第二批之三：荣誉奖项 / 兴趣爱好 / 自我评价 / 作品展示 的新版式 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')
const files = {}

files['Common/Awards/Awards4.vue'] = `<!-- 荣誉奖项·圆点列表：主题色圆点 + 奖项名粗体 + 等级主题色 + 时间右对齐 -->
<template>
  <div class="awards-content u-tag-div">
    <div class="awards-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="award u-tag-div">
        <span class="dot u-tag-span" />
        <span v-if="modelData.isShow.awardsName" class="award-name u-tag-span">{{ item.awardsName }}</span>
        <span v-if="modelData.isShow.awardsGrade" class="award-grade u-tag-span">{{ item.awardsGrade }}</span>
        <span v-if="modelData.isShow.date" class="award-date u-tag-span">{{ formatDate(item.date) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAWARDS } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IAWARDS
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .awards-content {
  box-sizing: border-box;
  .awards-list {
    padding-top: 15px;
    box-sizing: border-box;
    .award {
      display: flex;
      align-items: baseline;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 12px);
      }
      .dot {
        width: 6px;
        height: 6px;
        flex-shrink: 0;
        border-radius: 50%;
        background-color: v-bind('modelStyle.themeColor');
        margin-right: 10px;
        align-self: center;
      }
      .award-name {
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: 600;
        letter-spacing: 1px;
      }
      .award-grade {
        margin-left: 10px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.themeColor');
      }
      .award-date {
        flex: 1;
        text-align: right;
        font-size: v-bind('modelStyle.textFontSize');
        color: #9ca3af;
      }
    }
  }
}
</style>
`

files['Common/Awards/Awards5.vue'] = `<!-- 荣誉奖项·表格式：顶部细线分隔行，奖项名粗体与时间同行 -->
<template>
  <div class="awards-content u-tag-div">
    <div class="awards-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="award u-tag-div">
        <span v-if="modelData.isShow.awardsName" class="award-name u-tag-span">{{ item.awardsName }}</span>
        <span v-if="modelData.isShow.awardsGrade" class="award-grade u-tag-span">{{ item.awardsGrade }}</span>
        <span v-if="modelData.isShow.date" class="award-date u-tag-span">{{ formatDate(item.date) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAWARDS } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IAWARDS
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .awards-content {
  box-sizing: border-box;
  .awards-list {
    padding-top: 15px;
    box-sizing: border-box;
    .award {
      display: flex;
      align-items: baseline;
      box-sizing: border-box;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 12px);
      }
      .award-name {
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: 600;
        letter-spacing: 1px;
      }
      .award-grade {
        margin-left: 10px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.themeColor');
      }
      .award-date {
        flex: 1;
        text-align: right;
        font-size: v-bind('modelStyle.textFontSize');
        color: #9ca3af;
      }
    }
  }
}
</style>
`

files['Common/Awards/Awards6.vue'] = `<!-- 荣誉奖项·深色侧栏白字：白字奖项名与等级，供侧栏使用 -->
<template>
  <div class="awards-content u-tag-div">
    <div class="awards-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="side-award u-tag-div">
        <span v-if="modelData.isShow.awardsName" class="side-name u-tag-span">{{ item.awardsName }}</span>
        <span v-if="modelData.isShow.awardsGrade" class="side-grade u-tag-span">{{ item.awardsGrade }}</span>
        <span v-if="modelData.isShow.date" class="side-date u-tag-span">{{ formatDate(item.date) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAWARDS } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IAWARDS
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .awards-content {
  box-sizing: border-box;
  padding-top: 15px;
  .awards-list {
    .side-award {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 10px);
      }
      .side-name {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        letter-spacing: 1px;
      }
      .side-grade {
        margin-left: 8px;
        font-size: 13px;
        color: rgb(255 255 255 / 0.68);
      }
      .side-date {
        margin-left: auto;
        flex-shrink: 0;
        font-size: 13px;
        color: rgb(255 255 255 / 0.6);
      }
    }
  }
}
</style>
`

files['Common/Hobbies/Hobbies3.vue'] = `<!-- 兴趣爱好·标签云：顿号分隔的爱好用浅主题色圆角药丸连排 -->
<template>
  <div class="hobbies-content u-tag-div">
    <div v-if="useTags" class="hobby-list u-tag-div">
      <span v-for="(tag, index) in tags" :key="index" class="tag u-tag-span">{{ tag }}</span>
    </div>
    <RichTextView v-else :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
  </div>
</template>

<script setup lang="ts">
import type { IHOBBIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: IHOBBIES
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 与技能标签同一套拆分口径：段落与顿号都算分隔 */
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

const tagBg = computed(() => lightenColor(props.modelStyle.themeColor, 0.9))
</script>

<style lang="scss" scoped>
  .hobbies-content {
  box-sizing: border-box;
  padding-top: 15px;
  .hobby-list {
    display: flex;
    flex-wrap: wrap;
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 12px;
      margin: 0 8px 8px 0;
      border-radius: 999px;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.themeColor');
      background-color: v-bind('tagBg');
    }
  }
}
</style>
`

files['Common/Hobbies/Hobbies4.vue'] = `<!-- 兴趣爱好·图标行：主题色圆点打头，爱好名用竖线分隔连排 -->
<template>
  <div class="hobbies-content u-tag-div">
    <div v-if="useTags" class="hobby-row u-tag-div">
      <template v-for="(tag, index) in tags" :key="index">
        <span class="hobby u-tag-span">
          <span class="dot u-tag-span" />{{ tag }}
        </span>
        <span v-if="index !== tags.length - 1" class="sep u-tag-span">|</span>
      </template>
    </div>
    <RichTextView v-else :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
  </div>
</template>

<script setup lang="ts">
import type { IHOBBIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'

const props = defineProps<{
  modelData: IHOBBIES
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 与技能标签同一套拆分口径：段落与顿号都算分隔 */
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
  .hobbies-content {
  box-sizing: border-box;
  padding-top: 15px;
  .hobby-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .hobby {
      display: inline-flex;
      align-items: center;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
      font-weight: v-bind('modelStyle.textFontWeight');
      letter-spacing: 1px;
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: v-bind('modelStyle.themeColor');
        margin-right: 6px;
      }
    }
    .sep {
      margin: 0 10px;
      color: #d1d5db;
    }
  }
}
</style>
`

files['Common/Hobbies/Hobbies5.vue'] = `<!-- 兴趣爱好·深色侧栏白字：白字爱好标签，供侧栏使用 -->
<template>
  <div class="hobbies-content u-tag-div">
    <div v-if="useTags" class="hobby-list u-tag-div">
      <span v-for="(tag, index) in tags" :key="index" class="tag u-tag-span">{{ tag }}</span>
    </div>
    <RichTextView v-else :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
  </div>
</template>

<script setup lang="ts">
import type { IHOBBIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'

const props = defineProps<{
  modelData: IHOBBIES
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 与技能标签同一套拆分口径：段落与顿号都算分隔 */
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
  .hobbies-content {
  box-sizing: border-box;
  padding-top: 15px;
  .hobby-list {
    display: flex;
    flex-wrap: wrap;
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      margin: 0 8px 8px 0;
      border-radius: 3px;
      font-size: 13px;
      color: #fff;
      background-color: rgb(255 255 255 / 0.16);
    }
  }
}
</style>
`

files['Common/SelfEvaluation/SelfEvaluation3.vue'] = `<!-- 自我评价·浅色卡片：浅主题色底圆角卡片包裹正文 -->
<template>
  <div class="self-evaluation-content u-tag-div">
    <div class="card u-tag-div">
      <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISELFEVALUATION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: ISELFEVALUATION
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 卡片底取主题色兑白，保证正文深色字始终可读 */
const cardColor = computed(() => lightenColor(props.modelStyle.themeColor, 0.95))
</script>

<style lang="scss" scoped>
  .self-evaluation-content {
  box-sizing: border-box;
  padding-top: 15px;
  .card {
    box-sizing: border-box;
    padding: 12px 14px;
    border-radius: 4px;
    background-color: v-bind('cardColor');
  }
}
</style>
`

files['Common/SelfEvaluation/SelfEvaluation4.vue'] = `<!-- 自我评价·缩进引用：整段左缩进，左上角主题色折角引号 -->
<template>
  <div class="self-evaluation-content u-tag-div">
    <div class="quote u-tag-div">
      <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISELFEVALUATION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ISELFEVALUATION
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .self-evaluation-content {
  box-sizing: border-box;
  padding-top: 15px;
  .quote {
    position: relative;
    box-sizing: border-box;
    padding-left: 18px;
    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 0;
      width: 10px;
      height: 10px;
      border-top: 3px solid v-bind('modelStyle.themeColor');
      border-left: 3px solid v-bind('modelStyle.themeColor');
    }
  }
}
</style>
`

files['Common/SelfEvaluation/SelfEvaluation5.vue'] = `<!-- 自我评价·深色侧栏白字：白字正文，供侧栏使用 -->
<template>
  <div class="self-evaluation-content u-tag-div">
    <div class="side-text u-tag-div">
      <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:1px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISELFEVALUATION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ISELFEVALUATION
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .self-evaluation-content {
  box-sizing: border-box;
  padding-top: 15px;
  .side-text {
    font-size: 13px;
    color: rgb(255 255 255 / 0.78);
    line-height: 1.6;
    text-align: justify;
  }
}
</style>
`

files['Common/WorksDisplay/WorksDisplay2.vue'] = `<!-- 作品展示·卡片网格：两列浅主题色卡片，作品名粗体与链接 -->
<template>
  <div class="works-display-content u-tag-div">
    <div class="works-grid u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="work u-tag-div">
        <h1 class="work-name u-tag-h1">{{ item.worksName }}</h1>
        <text class="work-link u-tag-a" @click="copyWorksLink(item.worksLink)">{{ item.worksLink }}</text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IWORKSDISPLAY } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: IWORKSDISPLAY
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 卡片底取主题色兑白，作品名用标题色压在上层 */
const cardColor = computed(() => lightenColor(props.modelStyle.themeColor, 0.95))

/** 小程序没有 <a>，点击复制链接（H5 端同样可用，不影响导出 PDF） */
function copyWorksLink(link?: string) {
  if (!link)
    return
  uni.setClipboardData({
    data: link,
    success: () => uni.showToast({ title: '链接已复制', icon: 'none' }),
  })
}
</script>

<style lang="scss" scoped>
  .works-display-content {
  box-sizing: border-box;
  .works-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 12px;
    padding-top: 15px;
    box-sizing: border-box;
    .work {
      box-sizing: border-box;
      padding: 10px 12px;
      border-radius: 4px;
      background-color: v-bind('cardColor');
      .work-name {
        margin: 0;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: 600;
        letter-spacing: 1px;
      }
      .work-link {
        display: block;
        margin-top: 5px;
        font-size: 13px;
        color: v-bind('modelStyle.themeColor');
        word-break: break-all;
      }
    }
  }
}
</style>
`

files['Common/WorksDisplay/WorksDisplay3.vue'] = `<!-- 作品展示·深色侧栏白字：白字作品名与链接，供侧栏使用 -->
<template>
  <div class="works-display-content u-tag-div">
    <ul class="works-list u-tag-ul">
      <li v-for="(item, index) in modelData.LIST" :key="index" class="side-work u-tag-li">
        <h1 class="side-name u-tag-h1">{{ item.worksName }}</h1>
        <text class="side-link u-tag-a" @click="copyWorksLink(item.worksLink)">{{ item.worksLink }}</text>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { IWORKSDISPLAY } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IWORKSDISPLAY
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 小程序没有 <a>，点击复制链接（H5 端同样可用，不影响导出 PDF） */
function copyWorksLink(link?: string) {
  if (!link)
    return
  uni.setClipboardData({
    data: link,
    success: () => uni.showToast({ title: '链接已复制', icon: 'none' }),
  })
}
</script>

<style lang="scss" scoped>
  .works-display-content {
  box-sizing: border-box;
  padding-top: 15px;
  .works-list {
    .side-work {
      list-style: none;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 12px);
      }
      .side-name {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        letter-spacing: 1px;
      }
      .side-link {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: rgb(255 255 255 / 0.7);
        word-break: break-all;
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
console.log(`第二批之三已生成 ${written} 个文件`)