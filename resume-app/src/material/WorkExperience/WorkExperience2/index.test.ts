import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import WorkExperience2 from './index.vue'

/**
 * 工作经历皮肤（双栏模板）：公司名独占一行，职位 / 部门与时间在下一行的条目头里。
 * 公司名和时间挤在同一行时，侧栏模板的条目头会挤成一行，跟版式图对不上。
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
  themeColor: '#850e32',
  firstTitleFontSize: '15px',
  textColor: '#444444',
  textFontSize: '12px',
  textFontWeight: 400,
  titleColor: '#000000',
  titleFontSize: '13px',
  titleFontWeight: 600,
  backgroundColor: '',
  pLeftRight: '26px',
  pTop: '26px',
  pBottom: '0px',
  mBottom: '0px',
  mTop: '0px',
}

const baseItem = {
  date: ['2021-9', '2022-10'],
  companyName: 'XXX公司',
  posts: 'XXX工程师',
  department: 'XXX部门',
  jobContent: '<p>简要概述在岗时的工作内容</p>',
}

const baseModelData = {
  iconfont: '',
  model: 'WORK_EXPERIENCE',
  show: true,
  title: '工作经验',
  LIST: [baseItem],
  isShow: { date: true, companyName: true, posts: true, department: true },
}

describe('workExperience2', () => {
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

  it('公司名独占一行，不在条目头里跟时间挤一行', () => {
    wrapper = mount(WorkExperience2, {
      props: { modelData: baseModelData, modelStyle },
      ...mountOptions,
    })
    const item = wrapper.find('.work-experience__item')
    const name = item.find('.work-experience__name')
    expect(name.text()).toBe('XXX公司')
    expect(item.element.children[0].className).toBe('work-experience__name')
    expect(item.find('.work-experience__head .work-experience__name').exists()).toBe(false)
  })

  it('条目头只有「信息组 + 时间」两个直接子节点', () => {
    wrapper = mount(WorkExperience2, {
      props: { modelData: baseModelData, modelStyle },
      ...mountOptions,
    })
    const head = wrapper.find('.work-experience__head')
    expect(head.element.children).toHaveLength(2)
    expect(head.element.children[0].className).toBe('work-experience__meta')
    expect(head.element.children[1].className).toBe('work-experience__date')
    expect(head.find('.work-experience__posts').text()).toBe('XXX工程师')
    expect(head.find('.work-experience__date').text()).toBe('2021.09-2022.10')
  })

  it('isShow.companyName=false 时不渲染公司名', () => {
    const modelData = {
      ...baseModelData,
      isShow: { date: true, companyName: false, posts: true, department: true },
    }
    wrapper = mount(WorkExperience2, {
      props: { modelData, modelStyle },
      ...mountOptions,
    })
    expect(wrapper.find('.work-experience__name').exists()).toBe(false)
    expect(wrapper.find('.work-experience__head').exists()).toBe(true)
  })

  it('正文渲染在条目头下面', () => {
    wrapper = mount(WorkExperience2, {
      props: { modelData: baseModelData, modelStyle },
      ...mountOptions,
    })
    expect(wrapper.find('.work-experience__content').exists()).toBe(true)
  })
})
