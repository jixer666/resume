import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ProjectExperience1 from './index.vue'

/**
 * 项目经历皮肤：项目名 / 职责 / 时间必须挤在同一个条目头里（与 WorkExperience1 对齐）。
 * 职责单独占一行时，条目头会比工作经历多一行，同一份简历里两种经历的条目头对不齐。
 */

// 小标题条走自动导入插件，测试里换成空组件，避免把标题条的样式逻辑一起拉进来
vi.mock('../../ModelTitle/ModelTitle1/ModelTitle1.vue', () => ({
  default: { name: 'ModelTitle', render: () => null },
}))

// view / text 是 uni 内置标签，jsdom 里没有对应实现，用直通组件顶上，测试只关心 DOM 结构
const passthrough: Component = {
  setup(_props, { slots }) {
    return () => slots.default?.() ?? null
  },
}

const mountOptions = {
  global: {
    components: {
      view: passthrough,
      text: passthrough,
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

const baseItem = {
  date: ['2023-3', '2024-6'],
  projectName: '简历小程序',
  posts: '前端负责人',
  projectContent: '<p>负责简历渲染</p>',
}

const baseModelData = {
  iconfont: '',
  model: 'PROJECT_EXPERIENCE',
  show: true,
  title: '项目经验',
  LIST: [baseItem],
  isShow: { date: true, projectName: true, posts: true },
}

describe('projectExperience1', () => {
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

  it('项目名 / 职责 / 时间都在同一个条目头里', () => {
    wrapper = mount(ProjectExperience1, {
      props: { modelData: baseModelData, modelStyle },
      ...mountOptions,
    })
    const head = wrapper.find('.project-experience__head')
    expect(head.find('.project-experience__name').text()).toBe('简历小程序')
    expect(head.find('.project-experience__posts').text()).toBe('前端负责人')
    expect(head.find('.project-experience__date').text()).toBe('2023.03-2024.06')
  })

  it('条目头只有「信息组 + 时间」两个直接子节点，职责不另起一行', () => {
    wrapper = mount(ProjectExperience1, {
      props: { modelData: baseModelData, modelStyle },
      ...mountOptions,
    })
    const head = wrapper.find('.project-experience__head')
    expect(head.element.children).toHaveLength(2)
    expect(head.element.children[0].className).toBe('project-experience__meta')
    expect(head.element.children[1].className).toBe('project-experience__date')
  })

  it('isShow.posts=false 时不渲染职责', () => {
    const modelData = {
      ...baseModelData,
      isShow: { date: true, projectName: true, posts: false },
    }
    wrapper = mount(ProjectExperience1, {
      props: { modelData, modelStyle },
      ...mountOptions,
    })
    expect(wrapper.find('.project-experience__posts').exists()).toBe(false)
    expect(wrapper.find('.project-experience__name').exists()).toBe(true)
  })

  it('没有职责时不渲染空的职责节点', () => {
    const modelData = {
      ...baseModelData,
      LIST: [{ ...baseItem, posts: '' }],
    }
    wrapper = mount(ProjectExperience1, {
      props: { modelData, modelStyle },
      ...mountOptions,
    })
    expect(wrapper.find('.project-experience__posts').exists()).toBe(false)
  })

  it('正文渲染在条目头下面', () => {
    wrapper = mount(ProjectExperience1, {
      props: { modelData: baseModelData, modelStyle },
      ...mountOptions,
    })
    expect(wrapper.find('.project-experience__content').exists()).toBe(true)
  })
})
