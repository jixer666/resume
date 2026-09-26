<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { navigateToInterceptor } from '@/router/interceptor'
import { tabbarStore } from '@/tabbar/store'
import { permission } from '@/router/permission'

const { proxy } = (getCurrentInstance() || {}) as any
const router = proxy?.$router

router && permission.install(router)

onLaunch((options) => {
  console.log('App.vue onLaunch', options)
})
onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})

// #ifdef H5
function syncTabbarWhenPageVisible() {
  if (document.visibilityState === 'visible') {
    tabbarStore.syncCurIdxByCurrentPageAsync()
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', syncTabbarWhenPageVisible)
  window.addEventListener('pageshow', syncTabbarWhenPageVisible)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', syncTabbarWhenPageVisible)
  window.removeEventListener('pageshow', syncTabbarWhenPageVisible)
})
// #endif
</script>

<style lang="scss">
/**
 * 全局样式（编译进 app.wxss）。
 *
 * 小程序的 `<editor>`（富文本编辑器）内部是 Quill 结构，内容区/占位符分别是
 * `.ql-editor` / `.ql-editor.ql-blank::before`。这些节点不在组件模板里，
 * scoped 样式带上 data-v 属性后命中不了，所以只能在全局样式里覆盖。
 * 字号与内边距对齐编辑页输入框（`.input` / `.textarea`，见 style/editor-form.scss）。
 */
.ql-container .ql-editor {
  padding: 10px 12px;
  font-size: 14px;
}

/**
 * 模板里的标题行/正文行都用 `<ul class="u-tag-ul"><li class="u-tag-li">`。
 * 浏览器 UA 会给 `<ul>` 加 40px 左内边距、给 `<li>` 加列表符号，
 * 模板自身（scoped）已经定义了行距/字号，这里统一清掉 UA 默认值，
 * 否则「专业技能/工作/项目经验」的正文会比标题额外缩进一大截、还多一个「•」。
 * 各模块要不要留左缩进、留多少，改由模块级样式面板（contentPaddingLeft / pLeftRight）控制。
 *
 * 注意：小程序端编译时 `<ul>`/`<li>` 会被转成 `<view>`，所以这里只能用类名选择器，
 * 不能写 `ul.u-tag-ul` / `li.u-tag-li`，否则 mp 端匹配不到。
 */
.u-tag-ul {
  padding-left: 0;
  margin: 0;
}

.u-tag-li {
  list-style: none;
}
</style>
