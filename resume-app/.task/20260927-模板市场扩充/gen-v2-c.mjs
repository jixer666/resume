/** 模板市场重做·第三批：标题族 22–26 与名片版式 13–17 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')
const files = {}

files['ModelTitle/ModelTitle22/ModelTitle.vue'] = `<!-- 模块公共标题：主题色标题字 + 全宽主题色细下划线（wondercv 最典型的红头款） -->
<template>
  <div class="model-title-22-box u-tag-div">
    <h1 class="u-tag-h1">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .model-title-22-box {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 8px;
  margin-bottom: 12px;
  border-bottom: 2px solid v-bind('modelStyle.themeColor');
  .u-tag-h1 {
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 600;
    color: v-bind('modelStyle.themeColor');
    letter-spacing: 2px;
  }
}
</style>
`

files['ModelTitle/ModelTitle23/ModelTitle.vue'] = `<!-- 模块公共标题：主题色圆形图标 + 标题 -->
<template>
  <div class="model-title-23-box u-tag-div">
    <div class="title-icon u-tag-div">▸</div>
    <h1 class="u-tag-h1">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .model-title-23-box {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  .title-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 10px;
    font-size: 11px;
    color: #fff;
    background-color: v-bind('modelStyle.themeColor');
  }
  .u-tag-h1 {
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 600;
    color: v-bind('modelStyle.secondTitleColor');
    letter-spacing: 1px;
  }
}
</style>
`

files['ModelTitle/ModelTitle24/ModelTitle.vue'] = `<!-- 模块公共标题：主题色标题字 + 全宽浅灰细线 + 左侧短主题色粗线 -->
<template>
  <div class="model-title-24-box u-tag-div">
    <h1 class="u-tag-h1">
      {{ title }}
    </h1>
    <div class="title-line u-tag-div">
      <div class="title-line-accent u-tag-div" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .model-title-24-box {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 7px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  .u-tag-h1 {
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 600;
    color: v-bind('modelStyle.themeColor');
    letter-spacing: 2px;
  }
  .title-line {
    position: relative;
    width: 100%;
    height: 3px;
    margin-top: 5px;
    .title-line-accent {
      width: 56px;
      height: 3px;
      background-color: v-bind('modelStyle.themeColor');
    }
  }
}
</style>
`

files['ModelTitle/ModelTitle25/ModelTitle.vue'] = `<!-- 模块公共标题：深色粗体标题 + 全宽深色粗线（左粗右细），国企 / 法律等稳重风格 -->
<template>
  <div class="model-title-25-box u-tag-div">
    <h1 class="u-tag-h1">
      {{ title }}
    </h1>
    <div class="title-line u-tag-div" />
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .model-title-25-box {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  .u-tag-h1 {
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 700;
    color: v-bind('modelStyle.secondTitleColor');
    letter-spacing: 3px;
  }
  .title-line {
    width: 100%;
    height: 3px;
    margin-top: 7px;
    background: linear-gradient(to right, v-bind('modelStyle.themeColor') 0, v-bind('modelStyle.themeColor') 30%, #d7dbe2 30%, #d7dbe2 100%);
  }
}
</style>
`

files['ModelTitle/ModelTitle26/ModelTitle.vue'] = `<!-- 模块公共标题：白字标题 + 白色半透明细线（深色侧栏专用） -->
<template>
  <div class="model-title-26-box u-tag-div">
    <h1 class="u-tag-h1">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .model-title-26-box {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 7px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgb(255 255 255 / 0.32);
  .u-tag-h1 {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 2px;
  }
}
</style>
`

files['Common/BaseInfo/BaseInfo13.vue'] = `<!-- 基础资料·居中姓名：姓名居中 + 联系方式一行居中 + 底部主题色细线（无头像） -->
<template>
  <div class="base-info-common-13-box u-tag-div">
    <h1 class="name u-tag-h1">{{ modelData.name }}</h1>
    <div class="meta u-tag-div">
      <template v-for="(item, index) in metaList" :key="index">
        <span class="meta-item u-tag-span">{{ item }}</span>
        <span v-if="index !== metaList.length - 1" class="meta-sep u-tag-span">|</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

const isShow = computed(() => props.modelData.isShow || {})

/** 一行联系方式：按「年龄 / 城市 / 经验 / 电话 / 邮箱」的顺序拼，空项自动跳过 */
const metaList = computed(() => {
  const data = props.modelData
  const show = isShow.value as Record<string, boolean>
  const list: string[] = []
  if (show.age && data.age)
    list.push(\`\${data.age}岁\`)
  if (show.address && data.address)
    list.push(String(data.address))
  if (show.workService && data.workService)
    list.push(\`\${data.workService}年经验\`)
  if (show.phoneNumber && data.phoneNumber)
    list.push(String(data.phoneNumber))
  if (show.email && data.email)
    list.push(String(data.email))
  return list
})
</script>

<style lang="scss" scoped>
  .base-info-common-13-box {
  width: 100%;
  box-sizing: border-box;
  padding-top: v-bind('modelStyle.pTop');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  padding-bottom: 12px;
  margin-bottom: v-bind('modelStyle.mBottom');
  border-bottom: 2px solid v-bind('modelStyle.themeColor');
  .name {
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    color: v-bind('modelStyle.titleColor');
    letter-spacing: 3px;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    .meta-item {
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
    }
    .meta-sep {
      margin: 0 10px;
      color: #d1d5db;
    }
  }
}
</style>
`

files['Common/BaseInfo/BaseInfo14.vue'] = `<!-- 基础资料·居中圆头像：圆形头像居中在上 + 姓名居中 + 联系方式一行居中 + 底部主题色细线 -->
<template>
  <div class="base-info-common-14-box u-tag-div">
    <div v-show="isShow.avatar" class="avatar-row u-tag-div">
      <circle-avatar :model-data="modelData" width="96px" height="96px" />
    </div>
    <h1 class="name u-tag-h1">{{ modelData.name }}</h1>
    <div class="meta u-tag-div">
      <template v-for="(item, index) in metaList" :key="index">
        <span class="meta-item u-tag-span">{{ item }}</span>
        <span v-if="index !== metaList.length - 1" class="meta-sep u-tag-span">|</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

const isShow = computed(() => props.modelData.isShow || {})

/** 一行联系方式：按「年龄 / 城市 / 经验 / 电话 / 邮箱」的顺序拼，空项自动跳过 */
const metaList = computed(() => {
  const data = props.modelData
  const show = isShow.value as Record<string, boolean>
  const list: string[] = []
  if (show.age && data.age)
    list.push(\`\${data.age}岁\`)
  if (show.address && data.address)
    list.push(String(data.address))
  if (show.workService && data.workService)
    list.push(\`\${data.workService}年经验\`)
  if (show.phoneNumber && data.phoneNumber)
    list.push(String(data.phoneNumber))
  if (show.email && data.email)
    list.push(String(data.email))
  return list
})
</script>

<style lang="scss" scoped>
  .base-info-common-14-box {
  width: 100%;
  box-sizing: border-box;
  padding-top: v-bind('modelStyle.pTop');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  padding-bottom: 12px;
  margin-bottom: v-bind('modelStyle.mBottom');
  border-bottom: 2px solid v-bind('modelStyle.themeColor');
  .avatar-row {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }
  .name {
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    color: v-bind('modelStyle.titleColor');
    letter-spacing: 3px;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    .meta-item {
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
    }
    .meta-sep {
      margin: 0 10px;
      color: #d1d5db;
    }
  }
}
</style>
`

files['Common/BaseInfo/BaseInfo15.vue'] = `<!-- 基础资料·主题色通栏：整幅主题色横幅压白字姓名与联系方式，右侧圆形头像 -->
<template>
  <div class="base-info-common-15-box u-tag-div">
    <div class="banner u-tag-div">
      <div class="info u-tag-div">
        <h1 class="banner-name u-tag-h1">{{ modelData.name }}</h1>
        <div class="banner-meta u-tag-div">
          <span v-show="isShow.phoneNumber" class="u-tag-span">{{ modelData.phoneNumber }}</span>
          <span v-show="isShow.email" class="u-tag-span">{{ modelData.email }}</span>
        </div>
      </div>
      <div v-show="isShow.avatar" class="banner-avatar u-tag-div">
        <circle-avatar :model-data="modelData" width="84px" height="84px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { reactive } from 'vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

const isShow = reactive(props.modelData.isShow)
</script>

<style lang="scss" scoped>
  .base-info-common-15-box {
  width: 100%;
  box-sizing: border-box;
  .banner {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 18px v-bind('modelStyle.pLeftRight');
    background-color: v-bind('modelStyle.themeColor');
    .info {
      flex: 1;
      min-width: 0;
      .banner-name {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        letter-spacing: 3px;
      }
      .banner-meta {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
        .u-tag-span {
          font-size: v-bind('modelStyle.textFontSize');
          color: rgb(255 255 255 / 0.86);
          margin-right: 16px;
        }
      }
    }
    .banner-avatar {
      flex-shrink: 0;
      margin-left: 20px;
    }
  }
}
</style>
`

files['Common/BaseInfo/BaseInfo16.vue'] = `<!-- 基础资料·深色通栏：近黑通栏压白字姓名与联系方式，右侧方形头像 -->
<template>
  <div class="base-info-common-16-box u-tag-div">
    <div class="banner u-tag-div">
      <div class="info u-tag-div">
        <h1 class="banner-name u-tag-h1">{{ modelData.name }}</h1>
        <div class="banner-meta u-tag-div">
          <span v-show="isShow.age" class="u-tag-span">{{ modelData.age }}岁</span>
          <span v-show="isShow.address" class="u-tag-span">{{ modelData.address }}</span>
          <span v-show="isShow.workService" class="u-tag-span">{{ modelData.workService }}年经验</span>
        </div>
        <div class="banner-meta u-tag-div">
          <span v-show="isShow.phoneNumber" class="u-tag-span">{{ modelData.phoneNumber }}</span>
          <span v-show="isShow.email" class="u-tag-span">{{ modelData.email }}</span>
        </div>
      </div>
      <div v-show="isShow.avatar" class="banner-avatar u-tag-div">
        <square-avatar :model-data="modelData" width="92px" height="92px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { reactive } from 'vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

const isShow = reactive(props.modelData.isShow)
</script>

<style lang="scss" scoped>
  .base-info-common-16-box {
  width: 100%;
  box-sizing: border-box;
  .banner {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 20px v-bind('modelStyle.pLeftRight');
    border-bottom: 3px solid v-bind('modelStyle.themeColor');
    background-color: #1f2937;
    .info {
      flex: 1;
      min-width: 0;
      .banner-name {
        font-size: 25px;
        font-weight: 700;
        color: #fff;
        letter-spacing: 3px;
      }
      .banner-meta {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
        .u-tag-span {
          font-size: v-bind('modelStyle.textFontSize');
          color: rgb(255 255 255 / 0.78);
          margin-right: 16px;
        }
      }
    }
    .banner-avatar {
      flex-shrink: 0;
      margin-left: 20px;
    }
  }
}
</style>
`

files['Common/BaseInfo/BaseInfo17.vue'] = `<!-- 基础资料·深色侧栏白字：白字姓名与联系方式，供 leftRight 侧栏使用 -->
<template>
  <div class="base-info-common-17-box u-tag-div">
    <div v-show="isShow.avatar" class="side-avatar u-tag-div">
      <circle-avatar :model-data="modelData" width="80px" height="80px" />
    </div>
    <h1 class="side-name u-tag-h1">{{ modelData.name }}</h1>
    <div class="side-meta u-tag-div">
      <span v-show="isShow.age" class="side-line u-tag-span">{{ modelData.age }}岁</span>
      <span v-show="isShow.address" class="side-line u-tag-span">{{ modelData.address }}</span>
      <span v-show="isShow.workService" class="side-line u-tag-span">{{ modelData.workService }}年经验</span>
    </div>
    <div class="side-meta u-tag-div">
      <span v-show="isShow.phoneNumber" class="side-line u-tag-span">{{ modelData.phoneNumber }}</span>
      <span v-show="isShow.email" class="side-line u-tag-span">{{ modelData.email }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { reactive } from 'vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

const isShow = reactive(props.modelData.isShow)
</script>

<style lang="scss" scoped>
  .base-info-common-17-box {
  width: 100%;
  box-sizing: border-box;
  padding-top: 22px;
  .side-avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
    :deep(.circle-avatar-box) {
      border-color: rgb(255 255 255 / 0.4);
    }
  }
  .side-name {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 2px;
    text-align: center;
  }
  .side-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    .side-line {
      font-size: 13px;
      color: rgb(255 255 255 / 0.78);
      line-height: 1.7;
      word-break: break-all;
      text-align: center;
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
console.log(`第三批已生成 ${written} 个文件`)