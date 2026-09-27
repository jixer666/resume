import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/tabbar/config'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '简历盒子',
    // 极简白底黑字导航栏：三页不再有渐变头部，蓝色只留给按钮与选中态
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F5F6F8',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  // tabbar 的配置统一在 “./src/tabbar/config.ts” 文件中
  tabBar: tabBar as any,
})
