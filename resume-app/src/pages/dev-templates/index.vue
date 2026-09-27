<script lang="ts" setup>
/**
 * 开发期模板版式核对页（临时）：从真实接口拉全部模板，逐套 createResume 后整页渲染 A4。
 *
 * 只在本地 dev 跑，配合无头浏览器截图使用，不进小程序包、不面向用户；核对完即删。
 * `?codes=a,b,c` 只渲染指定几套，方便按批截图。
 */
import type { IResumeTemplate } from '@/schema/templates'
import ResumeRender from '@/components/ResumeRender/ResumeRender.vue'
import { useResumeStore } from '@/store/resume'
import { useTemplateStore } from '@/store/template'

defineOptions({ name: 'DevTemplates' })
definePage({
  style: {
    navigationBarTitleText: '模板版式核对',
  },
})

const templateStore = useTemplateStore()
const resumeStore = useResumeStore()

/** 真实接口数据已就绪：分页拉全后才逐套 createResume 渲染 */
const ready = ref(false)

const current = ref('')

onLoad(async (query) => {
  current.value = query?.codes ? String(query.codes) : ''
  await templateStore.fetchList()
  for (let i = 0; i < 20 && templateStore.hasMore; i++)
    await templateStore.fetchMore()
  ready.value = true
})

const items = computed(() => {
  if (!ready.value)
    return []
  const wanted = current.value ? current.value.split(',') : []
  return templateStore.list
    .filter(tpl => !wanted.length || wanted.includes(tpl.code))
    .map((tpl: IResumeTemplate) => {
      const json = resumeStore.createResume(tpl.code)
      return { code: tpl.code, name: tpl.name, json: JSON.parse(JSON.stringify(json)) }
    })
})
</script>

<template>
  <view class="page">
    <view v-for="item in items" :key="item.code" class="cell">
      <text class="cell__name">{{ item.code }} · {{ item.name }}</text>
      <view class="cell__paper">
        <ResumeRender :json="item.json" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding: 12px;
  background-color: #f2f3f5;
}

.cell {
  width: 794px;
  margin: 0 auto 24px;
  background-color: #fff;
}

.cell__name {
  display: block;
  padding: 6px 10px;
  color: #86909c;
  font-size: 12px;
}

.cell__paper {
  width: 794px;
  border: 1px solid #e5e6eb;
}
</style>
