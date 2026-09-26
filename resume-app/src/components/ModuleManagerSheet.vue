<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import { MATERIAL_JSON } from '@/schema/materialList'
import MODEL_DATA_JSON from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'

/**
 * 模块管理弹层：编辑页与预览页共用同一份实现，保证两处行为完全一致。
 *
 * 内部直接改 store.current（上移 / 下移 / 显隐 / 删除 / 新增），每次改动 emit `change`
 * 让宿主页面决定怎么落库（编辑页 autoSave、预览页额外重排分页）。
 * 点模块行进入模块设置（皮肤 / 标题），设置面板叠在管理面板之上。
 */
defineOptions({ name: 'ModuleManagerSheet' })

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'change'): void
}>()

const store = useResumeStore()
const components = computed(() => store.components)

/** 模块设置面板当前操作的模块 keyId */
const settingKeyId = ref('')
const showModuleSetting = ref(false)

/** 全部可新增的模块（按物料清单去重） */
const allModels = computed(() => {
  const models: string[] = []
  Object.values(MATERIAL_JSON).forEach((list) => {
    list.forEach((one) => {
      if (!models.includes(one.model))
        models.push(one.model)
    })
  })
  return models
})
/** 还能新增的模块：同一类模块一份简历里只放一个 */
const addableModels = computed(() => {
  const used = components.value.map(one => one.model)
  return allModels.value.filter(model => !used.includes(model))
})

/** 弹层被关掉时收起内部设置面板，避免下次打开残留 */
watch(() => props.visible, (visible) => {
  if (!visible)
    showModuleSetting.value = false
})

/** 模块标题：优先取数据里的 title，再退回模块默认名 */
function moduleTitle(item: IMATERIALITEM): string {
  const title = (item.data as { title?: string } | undefined)?.title
  return String(title || MODEL_DATA_JSON[item.model]?.title || item.cptTitle || '模块')
}

function close() {
  emit('close')
}

/** 打开某个模块的设置面板（皮肤选择 + 可编辑时改标题） */
function openModuleSetting(item: IMATERIALITEM) {
  settingKeyId.value = item.keyId
  showModuleSetting.value = true
}

function closeModuleSetting() {
  showModuleSetting.value = false
  emit('change')
}

function toggleModule(item: IMATERIALITEM) {
  store.toggleModule(item.keyId)
  emit('change')
}

function moveModule(from: number, to: number) {
  store.moveModule(from, to)
  emit('change')
}

function removeModule(item: IMATERIALITEM) {
  store.removeModule(item.keyId)
  emit('change')
}

function addModule(model: string) {
  store.addModule(model)
  emit('change')
}
</script>

<template>
  <view class="module-manager">
    <view v-if="visible" class="mask" @click="close">
      <view class="sheet sheet--tall" @click.stop>
        <text class="sheet-title">模块管理</text>
        <scroll-view scroll-y class="sheet-scroll">
          <view
            v-for="(item, index) in components"
            :key="item.keyId"
            class="module-row"
            :class="{ 'module-row--off': !item.show }"
          >
            <view class="module-main" hover-class="module-main--press" @click="openModuleSetting(item)">
              <text class="module-name">{{ moduleTitle(item) }}</text>
              <text class="module-state">{{ item.show ? '显示中' : '已隐藏' }}</text>
            </view>
            <view class="module-acts">
              <view class="icon-btn" hover-class="icon-btn--press" @click="moveModule(index, index - 1)">
                <mp-icon name="ui-up" color="#64748b" size="26px" />
              </view>
              <view class="icon-btn" hover-class="icon-btn--press" @click="moveModule(index, index + 1)">
                <mp-icon name="ui-down" color="#64748b" size="26px" />
              </view>
              <view class="icon-btn" hover-class="icon-btn--press" @click="toggleModule(item)">
                <mp-icon :name="item.show ? 'ui-view' : 'ui-view-off'" color="#64748b" size="26px" />
              </view>
              <view class="icon-btn" hover-class="icon-btn--press" @click="removeModule(item)">
                <mp-icon name="ui-trash" color="#ef4444" size="26px" />
              </view>
            </view>
          </view>
          <view v-if="addableModels.length" class="add-grid">
            <view
              v-for="model in addableModels"
              :key="model"
              class="add-chip"
              hover-class="add-chip--press"
              @click="addModule(model)"
            >
              ＋ {{ MODEL_DATA_JSON[model]?.title || model }}
            </view>
          </view>
          <text v-else class="module-empty">
            全部模块都已添加
          </text>
        </scroll-view>
      </view>
    </view>

    <module-setting-sheet :visible="showModuleSetting" :key-id="settingKeyId" @close="closeModuleSetting" />
  </view>
</template>

<style scoped lang="scss">
@import '../style/editor-sheet.scss';

.module-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: #f8fafc;

  &--off {
    opacity: 0.55;
  }
}

.module-main {
  min-width: 0;
  flex: 1;

  &--press {
    opacity: 0.6;
  }
}

.module-name {
  display: block;
  overflow: hidden;
  color: #172b4d;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-state {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}

.module-acts {
  display: flex;
  flex: none;
  align-items: center;
  margin-left: 10px;
}

.icon-btn {
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  border-radius: 9px;
  background-color: #fff;

  &--press {
    background-color: #e2e8f0;
  }
}

.add-grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 14px;
}

.add-chip {
  margin: 0 8px 8px 0;
  padding: 7px 12px;
  border-radius: 15px;
  background-color: #eff6ff;
  color: var(--wot-color-theme, #0957de);
  font-size: 12px;

  &--press {
    background-color: #dbeafe;
  }
}

.module-empty {
  display: block;
  margin-top: 16px;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}
</style>

<style lang="scss">
@keyframes sheet-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
