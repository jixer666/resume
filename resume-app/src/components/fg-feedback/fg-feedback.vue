<script lang="ts" setup>
import { useConfigStore } from '@/store/config'
import { copyText } from '@/utils/clipboard'

/**
 * 问题反馈入口：贴在页面右边缘的竖排标签 + QQ 群号弹层，页面里写一个 `<fg-feedback />` 即可。
 *
 * 是否展示与群号都由后端配置控制（config 表的 globalConfig.feedbackSheet，
 * 经 ConfigController `/config/resume` 下发，见 store/config）：显式 `enabled: false` 才隐藏，
 * 配置没拉到时保持展示，群号没配时弹层里提示暂未配置。
 *
 * 竖排标签固定在页面右边缘（参考超级简历的「更多活动」），简历 / 模板再多也不会被顶出屏幕；
 * 小程序端不支持 `writing-mode`，所以四个字拆成单字纵向排列。
 *
 * 小程序里没法直接唤起 QQ 加群，所以群号做成可复制：
 * 点「复制群号」后打开 QQ 搜索群号即可加入。
 */
defineOptions({ name: 'FgFeedback' })

const configStore = useConfigStore()

/** 竖排标签文案：拆成单字逐字纵向排列 */
const CHARS = ['问', '题', '反', '馈']
/** 弹层是否展示 */
const visible = ref(false)

/**
 * 入口是否展示：由后端 globalConfig.feedbackSheet.enabled 控制，显式 false 才隐藏。
 * 配置没拉到（接口失败 / 还没下发）时保持展示 —— 反馈入口不该因为一次网络失败就消失。
 */
const enabled = computed(() => configStore.feedbackSheet?.enabled !== false)
/** QQ 群号：后端没配时为空串，弹层里按「暂未配置」处理 */
const qqGroupNumber = computed(() => configStore.feedbackSheet?.qqGroupNumber || '')

onMounted(() => {
  // App.vue 启动时已预拉一次，这里再兜一次：首次进页面时配置可能还在路上
  configStore.ensureLoaded()
})

/** 复制群号：拿到群号后打开 QQ 搜索加入（小程序里没法直接唤起 QQ 加群） */
function copyQqGroupNumber() {
  copyText(qqGroupNumber.value, '群号已复制')
}
</script>

<template>
  <!-- 必须保持单根节点：mp 端靠父级 class 透传到子组件根节点 -->
  <view class="fg-feedback-root">
    <!-- 贴在页面右边缘的竖排标签：滚动时始终可见 -->
    <view v-if="enabled" class="entry" hover-class="entry--press" @click="visible = true">
      <text v-for="char in CHARS" :key="char" class="entry-char">{{ char }}</text>
    </view>

    <view v-if="visible" class="mask">
      <view class="mask__backdrop" @click="visible = false" />
      <view class="sheet" @click.stop>
        <text class="sheet-title">问题反馈群</text>
        <text class="sheet-sub">使用中遇到任何问题，都可以加群反馈</text>

        <!-- 群号已配置：展示群号 + 复制按钮 -->
        <view v-if="qqGroupNumber">
          <view class="qq">
            <text class="qq-label">QQ群号</text>
            <text class="qq-value">{{ qqGroupNumber }}</text>
          </view>
          <text class="qq-tip">复制群号后打开 QQ，搜索群号即可加入</text>

          <view class="qq-btn" hover-class="qq-btn--press" @click="copyQqGroupNumber">
            复制群号
          </view>
        </view>
        <!-- 群号没配时的兜底：入口照常展示，给出明确原因 -->
        <text v-else class="qq-empty">暂无群号，请稍等片刻哦~</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 组件样式隔离：mp 端页面样式进不到组件内部，所以这里自己 `@import` 共用弹层样式 */
@import '../../style/editor-sheet.scss';

/* -------- 右边缘竖排标签 -------- */
/* 白底 + 主题色淡色边框 + 主题色文字：比纯灰边框更容易被看到，又不至于像实心按钮那样抢眼 */
.entry {
  position: fixed;
  right: 0;
  top: 58%;
  z-index: 10;
  display: flex;
  width: 28px;
  padding: 10px 0;
  flex-direction: column;
  align-items: center;
  border: 1px solid #bfdbfe;
  border-right: none;
  border-radius: 8px 0 0 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(31 35 41 / 8%);
}

.entry--press {
  background-color: #f2f3f5;
}

.entry-char {
  color: #2563eb;
  font-size: 13px;
  line-height: 17px;
}

/* -------- QQ 群号弹层 -------- */
.qq {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-top: 20px;
  padding: 16px 0;
  border-radius: 12px;
  background-color: #f8fafc;
}

.qq-label {
  color: #94a3b8;
  font-size: 13px;
}

.qq-value {
  margin-left: 10px;
  color: #172b4d;
  font-size: 22px;
  font-weight: 700;
}

.qq-tip {
  display: block;
  margin-top: 12px;
  color: #8f959e;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

/* 群号没配时的占位块：与 .qq 同高，避免弹层高度跳变 */
.qq-empty {
  display: block;
  margin-top: 20px;
  padding: 22px 0;
  border-radius: 12px;
  background-color: #f8fafc;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.qq-btn {
  height: 46px;
  margin-top: 18px;
  border-radius: 23px;
  background-color: var(--wot-color-theme, #2563eb);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 46px;
  text-align: center;
}

.qq-btn--press {
  opacity: 0.86;
}
</style>

<style lang="scss">
/* 与编辑页弹层一致：关键帧必须写在非 scoped 块里，scoped 块内的 @keyframes 会被编译改名而引用不会同步 */
@keyframes sheet-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
