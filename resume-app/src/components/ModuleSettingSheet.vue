<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import MODEL_DATA_JSON from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'

/**
 * 模块设置弹层：模块小标题（按模块决定是否开放）+ 皮肤选择。
 *
 * 换皮肤只改 cptName / cptTitle / style，业务数据原样保留（store.changeVariant），
 * 对应任务文档 P3.5 的验收「同一份数据切换皮肤后内容不丢」。
 *
 * 组件样式隔离：mp 端页面样式进不到组件内部，所以这里自己 `@import` 共用弹层样式。
 */
defineOptions({ name: 'ModuleSettingSheet' })

const props = defineProps<{
  /** 是否展示 */
  visible: boolean
  /** 目标模块的 keyId */
  keyId: string
}>()
const emit = defineEmits<{ close: [] }>()

const store = useResumeStore()

const item = computed<IMATERIALITEM | undefined>(() => store.findModuleByKey(props.keyId))
/** 该模块的全部皮肤：自定义模块的 3 套皮肤共用一个物料分组，只能按 model 定位 */
const variants = computed(() => (item.value ? store.variantsOf(item.value.model) : []))

const moduleName = computed(() => {
  const one = item.value
  return String(MODEL_DATA_JSON[one?.model || '']?.title || one?.cptTitle || '模块')
})

/**
 * `data.title` 只有会被物料 `<ModelTitle>` 渲染成模块小标题的模块才能改：
 * RESUME_TITLE 拿它当简历大标题内容，CUSTOM_* 压根不渲染它，都排除在外。
 */
const canEditTitle = computed(() => {
  const model = item.value?.model || ''
  return !!item.value?.data && model !== 'RESUME_TITLE' && !model.startsWith('CUSTOM')
})

/** 标题草稿：打开面板 / 换模块时从数据里带入 */
const titleDraft = ref('')
watch(() => [props.visible, props.keyId], () => {
  titleDraft.value = String((item.value?.data as { title?: string } | undefined)?.title || '')
}, { immediate: true })

/** 标题留空视为不改，避免把模块小标题清成空白 */
function confirmTitle() {
  const value = titleDraft.value.trim()
  if (!canEditTitle.value || !value)
    return
  store.updateModuleTitle(props.keyId, value)
}

function selectVariant(cptName: string) {
  store.changeVariant(props.keyId, cptName)
}

function close() {
  confirmTitle()
  emit('close')
}
</script>

<template>
  <view v-if="visible && item" class="mask" @click="close">
    <view class="sheet" @click.stop>
      <text class="sheet-title">模块设置</text>
      <text class="sheet-sub">{{ moduleName }}</text>

      <template v-if="canEditTitle">
        <text class="sheet-label">模块标题</text>
        <input
          class="sheet-input"
          type="text"
          :value="titleDraft"
          :maxlength="10"
          placeholder="模块标题"
          placeholder-class="sheet-placeholder"
          @input="titleDraft = $event.detail.value"
          @blur="confirmTitle"
          @confirm="confirmTitle"
        >
      </template>

      <text class="sheet-label">皮肤样式</text>
      <scroll-view scroll-y class="sheet-scroll">
        <view class="skin-grid">
          <view
            v-for="(variant, index) in variants"
            :key="variant.cptName"
            class="skin-chip"
            :class="{ 'skin-chip--on': variant.cptName === item.cptName }"
            hover-class="skin-chip--press"
            @click="selectVariant(variant.cptName)"
          >
            <text class="skin-name">样式 {{ index + 1 }}</text>
            <text class="skin-state">{{ variant.cptName === item.cptName ? '使用中' : '点击切换' }}</text>
          </view>
        </view>
      </scroll-view>

      <view class="sheet-cancel" hover-class="sheet-cancel--press" @click="close">
        完成
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '../style/editor-sheet.scss';

.skin-grid {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.skin-chip {
  box-sizing: border-box;
  width: calc(33.33% - 8px);
  margin: 10px 8px 0 0;
  padding: 10px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: #f8fafc;
  text-align: center;

  &--on {
    border-color: var(--wot-color-theme, #0957de);
    background-color: #eef4ff;
  }

  &--press {
    background-color: #e2e8f0;
  }
}

.skin-name {
  display: block;
  color: #172b4d;
  font-size: 13px;
  font-weight: 600;
}

.skin-state {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}
</style>

<style lang="scss">
/* 与 index.vue 一致：关键帧必须写在非 scoped 块里，scoped 块内的 @keyframes 会被编译改名而引用不会同步 */
@keyframes sheet-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
