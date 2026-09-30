import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ModelTitle1 from './ModelTitle1.vue'

/**
 * 小标题分发：形态由模板级样式预设 titleStyle 决定
 * （空串为经典标题条，iconBadge 为圆点图标标题，underlineTitle 为下划线标题）。
 * 正文皮肤只引这一处分发，换标题形态不该让每套皮肤各复制一份。
 */

// view / text 是 uni 内置标签，jsdom 里没有对应实现，用直通组件顶上，测试只关心 DOM 结构
const passthrough: Component = {
  setup(_props, { slots }) {
    return () => slots.default?.() ?? null
  },
}

// 圆点里的模块图标走 MpIcon（构建期自动导入），测试里换成带 data-name 的桩，断言传进去的图标名
const iconStub: Component = {
  props: ['name'],
  template: '<i class="mp-icon-stub" :data-name="name" />',
}

const mountOptions = {
  global: {
    components: {
      view: passthrough,
      text: passthrough,
      MpIcon: iconStub,
    },
  },
}

const modelStyle = {
  themeColor: '#2b74ff',
  firstTitleFontSize: '16px',
  textColor: '#666666',
  textFontSize: '12px',
  textFontWeight: 400,
  titleColor: '#333333',
  titleFontSize: '14px',
  titleFontWeight: 600,
  backgroundColor: '#ffffff',
  pLeftRight: '40px',
  pTop: '12px',
  pBottom: '12px',
  mBottom: '12px',
  mTop: '12px',
}

describe('modelTitle1', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // 直通组件借用了 uni 的保留标签名，Vue 每个用例都会重复告警，这里静音，
    // 用例只断言 DOM 结构，不关心样式层的告警
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  it('未设 titleStyle 时渲染经典标题条', () => {
    wrapper = mount(ModelTitle1, {
      props: { title: '工作经历', modelStyle },
      ...mountOptions,
    })
    expect(wrapper.find('.model-title__bar').exists()).toBe(true)
    expect(wrapper.find('.model-title__text').text()).toBe('工作经历')
    expect(wrapper.find('.model-title__badge').exists()).toBe(false)
  })

  it('titleStyle = iconBadge 时渲染圆点图标标题', () => {
    wrapper = mount(ModelTitle1, {
      props: { title: '工作经历', modelStyle: { ...modelStyle, titleStyle: 'iconBadge' }, icon: 'icon-gongzuojingyan' },
      ...mountOptions,
    })
    expect(wrapper.find('.model-title__badge').exists()).toBe(true)
    expect(wrapper.find('.model-title__text').text()).toBe('工作经历')
    expect(wrapper.find('.model-title__bar').exists()).toBe(false)
  })

  it('圆点里画的是模块自己的图标，右侧带浅色分隔线', () => {
    wrapper = mount(ModelTitle1, {
      props: { title: '工作经历', modelStyle: { ...modelStyle, titleStyle: 'iconBadge' }, icon: 'icon-gongzuojingyan' },
      ...mountOptions,
    })
    expect(wrapper.find('.mp-icon-stub').attributes('data-name')).toBe('icon-gongzuojingyan')
    expect(wrapper.find('.model-title__line').exists()).toBe(true)
  })

  it('titleStyle = underlineTitle 时渲染下划线标题', () => {
    wrapper = mount(ModelTitle1, {
      props: { title: '教育背景', modelStyle: { ...modelStyle, titleStyle: 'underlineTitle' } },
      ...mountOptions,
    })
    expect(wrapper.find('.model-title__line').exists()).toBe(true)
    expect(wrapper.find('.model-title__text').text()).toBe('教育背景')
    expect(wrapper.find('.model-title__badge').exists()).toBe(false)
    expect(wrapper.find('.model-title__bar').exists()).toBe(false)
  })

  it('没有图标名时不渲染空图标节点', () => {
    wrapper = mount(ModelTitle1, {
      props: { title: '工作经历', modelStyle: { ...modelStyle, titleStyle: 'iconBadge' } },
      ...mountOptions,
    })
    expect(wrapper.find('.mp-icon-stub').exists()).toBe(false)
  })
})
