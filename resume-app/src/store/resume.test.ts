import type IRESUMEJSON from '@/interface/resume'
import { describe, expect, it } from 'vitest'
import { useResumeStore } from './resume'

/** 最小简历：只带「整理成一页」关心的字段，模块样式按用例拼 */
function makeResume(style: Record<string, string>, model = 'WORK_EXPERIENCE'): IRESUMEJSON {
  return {
    ID: '1',
    NAME: '测试简历',
    TITLE: '',
    LAYOUT: 'single',
    GLOBAL_STYLE: { textFontSize: '13px' },
    COMPONENTS: [{ keyId: 'a', model, style: { pTop: '18px', ...style } }],
  } as unknown as IRESUMEJSON
}

describe('整理成一页：按比例压缩与还原', () => {
  it('模块留白与条目间距一起压缩，条目之间的疏密跟着模块留白走', () => {
    const store = useResumeStore()
    store.current = makeResume({ entryMarginBottom: '20px' })

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.5)

    const style = store.current!.COMPONENTS[0].style
    expect(style.pTop).toBe('9px')
    expect(style.entryMarginBottom).toBe('10px')
  })

  it('比例回到 1 时无损还原，不留压缩痕迹', () => {
    const store = useResumeStore()
    store.current = makeResume({ entryMarginBottom: '20px' })

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.5)
    store.applyFitScale(base, 1)

    const style = store.current!.COMPONENTS[0].style
    expect(style.pTop).toBe('18px')
    expect(style.entryMarginBottom).toBe('20px')
  })

  it('没设过条目间距的模块不凭空写上这个字段，仍走整页统一的 16px', () => {
    const store = useResumeStore()
    store.current = makeResume({})

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.5)

    const style = store.current!.COMPONENTS[0].style
    expect(style.pTop).toBe('9px')
    expect('entryMarginBottom' in style).toBe(false)
  })

  it('模块没设过头像尺寸时按出厂默认压缩，还原时删掉、不留痕迹', () => {
    const store = useResumeStore()
    store.current = makeResume({}, 'BASE_INFO')

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.5)

    // 84 x 100 的 0.5 是 42 x 50，低于下限，按下限收
    const style = store.current!.COMPONENTS[0].style
    expect(style.avatarWidth).toBe('56px')
    expect(style.avatarHeight).toBe('64px')

    store.applyFitScale(base, 1)
    expect('avatarWidth' in style).toBe(false)
    expect('avatarHeight' in style).toBe(false)
  })

  it('用户设过的头像尺寸按用户的值压缩，不按出厂默认', () => {
    const store = useResumeStore()
    store.current = makeResume({ avatarWidth: '120px', avatarHeight: '150px' }, 'BASE_INFO')

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.5)

    const style = store.current!.COMPONENTS[0].style
    expect(style.avatarWidth).toBe('60px')
    expect(style.avatarHeight).toBe('75px')
  })

  it('头像尺寸只写给基本资料，别的模块不会被凭空塞上这个字段', () => {
    const store = useResumeStore()
    store.current = makeResume({}, 'WORK_EXPERIENCE')

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.5)

    const style = store.current!.COMPONENTS[0].style
    expect('avatarWidth' in style).toBe(false)
    expect('avatarHeight' in style).toBe(false)
  })

  it('整页节奏的压缩比例记进 GLOBAL_STYLE.fitRatio，还原时删掉', () => {
    const store = useResumeStore()
    store.current = makeResume({})

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.6)
    expect(store.current!.GLOBAL_STYLE.fitRatio).toBe(0.6)

    store.applyFitScale(base, 1)
    expect('fitRatio' in store.current!.GLOBAL_STYLE).toBe(false)
  })

  it('整理之后用户又调了样式：还原时保留用户的新改动，不套回旧基准', () => {
    const store = useResumeStore()
    store.current = makeResume({})

    const base = store.captureFitBase()
    store.applyFitScale(base, 0.5)
    // 整理之后用户在样式面板里把模块上内边距又调大了
    store.updateModuleStyle('a', { pTop: '24px' })

    store.applyFitScale(store.rebaseFitBase(base), 1)

    const style = store.current!.COMPONENTS[0].style
    expect(style.pTop).toBe('24px')
  })
})
