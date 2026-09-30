import type IRESUMEJSON from '@/interface/resume'
import type { IResumeTemplate } from '@/schema/templates'
import { getResumeDetail } from '@/api/resume'
import { getTemplateDetail } from '@/api/template'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfigStore } from './config'
import { useResumeStore } from './resume'
import { useTemplateStore } from './template'

vi.mock('@/api/resume', () => ({
  deleteResume: vi.fn(),
  getResumeDetail: vi.fn(),
  getResumeList: vi.fn(),
  saveResume: vi.fn(),
}))

vi.mock('@/api/template', () => ({
  getTemplateDetail: vi.fn(),
  getTemplateList: vi.fn(),
}))

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

/** 后端按模板建骨架时铺的模块默认样式：配置中心下发，模板的窄边距 / 下划线标题都不在里面 */
const CONFIG_MODEL_STYLE = {
  themeColor: '#2b74ff',
  titleColor: '#121c26',
  pTop: '12px',
  pLeftRight: '48px',
}

/** 造一份「后端按模板新建」的简历：模块样式整份等于配置中心默认值，模板样式只落在 GLOBAL_STYLE 上 */
function makeTemplateResume(style: Record<string, string> = {}): IRESUMEJSON {
  return {
    ID: '1',
    NAME: '测试简历',
    TITLE: '',
    LAYOUT: 'leftRight',
    GLOBAL_STYLE: {
      pTop: '26px',
      pLeftRight: '26px',
      themeColor: '#850e32',
      titleStyle: 'underlineTitle',
    },
    COMPONENTS: [
      {
        keyId: 'a',
        model: 'WORK_EXPERIENCE',
        cptName: 'WORK_EXPERIENCE_2',
        cptTitle: '工作经历',
        layout: 'right',
        show: true,
        style: { ...CONFIG_MODEL_STYLE, ...style },
        data: {},
      },
    ],
  } as unknown as IRESUMEJSON
}

/** 造一份简历详情返回，只带载入流程关心的字段 */
function makeDetail(resumeJson: IRESUMEJSON) {
  return {
    id: 1,
    name: '测试简历',
    layout: 'leftRight',
    thumbnail: '',
    updateTime: '2026-09-29 17:00:00',
    templateCode: 'side',
    resumeJson,
  }
}

describe('载入时补齐后端建骨架时没扇出的模板样式', () => {
  beforeEach(() => {
    const config = useConfigStore()
    // 出厂全局默认：模板预设落在它之上，与它不同的字段就是模板声明过的样式
    config.globalStyle = { themeColor: '#079cfa', secondTitleColor: '#666', pTop: '0px', pLeftRight: '' }
    config.modelStyle = { WORK_EXPERIENCE: { ...CONFIG_MODEL_STYLE } }
  })

  it('模块样式还是配置中心默认值时套用模板预设：窄边距与下划线小标题都补上', async () => {
    vi.mocked(getResumeDetail).mockResolvedValue(makeDetail(makeTemplateResume()))
    const store = useResumeStore()
    await store.loadResume('1')
    const style = store.current!.COMPONENTS[0].style as Record<string, unknown>
    expect(style.pLeftRight).toBe('26px')
    expect(style.titleStyle).toBe('underlineTitle')
  })

  it('用户改过的模块样式不套模板预设', async () => {
    vi.mocked(getResumeDetail).mockResolvedValue(makeDetail(makeTemplateResume({ pLeftRight: '30px' })))
    const store = useResumeStore()
    await store.loadResume('1')
    const style = store.current!.COMPONENTS[0].style as Record<string, unknown>
    expect(style.pLeftRight).toBe('30px')
  })

  it('模板没声明过样式（全局样式等于出厂默认）时不补任何东西', async () => {
    vi.mocked(getResumeDetail).mockResolvedValue(makeDetail({
      ...makeTemplateResume(),
      GLOBAL_STYLE: { themeColor: '#079cfa', secondTitleColor: '#666', pTop: '0px', pLeftRight: '' },
    } as unknown as IRESUMEJSON))
    const store = useResumeStore()
    await store.loadResume('1')
    const style = store.current!.COMPONENTS[0].style as Record<string, unknown>
    expect('titleStyle' in style).toBe(false)
  })
})

/** 造一份双栏模板配置：工作经历配置 `_2` 皮肤放右栏且初始隐藏，另有模板级样式 */
function makeTemplate(): IResumeTemplate {
  return {
    code: 'side',
    name: '双栏模板',
    description: '',
    cover: '',
    layout: 'leftRight',
    style: {
      themeColor: '#850e32',
      pLeftRight: '26px',
      pTop: '0px',
      titleStyle: 'underlineTitle',
    },
    variants: { WORK_EXPERIENCE: 'WORK_EXPERIENCE_2' },
    columns: { left: ['BASE_INFO'], right: ['WORK_EXPERIENCE'] },
    hidden: ['WORK_EXPERIENCE'],
  }
}

describe('新增模块按当前模板的配置取皮肤', () => {
  beforeEach(() => {
    const config = useConfigStore()
    // 出厂全局默认：模板预设落在它之上，与它不同的字段就是模板声明过的样式
    config.globalStyle = { themeColor: '#079cfa', pTop: '0px', pLeftRight: '' }
    config.modelStyle = {}
    useTemplateStore().list = [makeTemplate()]
  })

  it('模板为模块配置了非首套皮肤时取那套，而不是随便用一套', () => {
    const store = useResumeStore()
    store.createResume('side')
    const item = store.addModule('WORK_EXPERIENCE')!
    expect(item.cptName).toBe('WORK_EXPERIENCE_2')
  })

  it('模板没配置这个模块的皮肤时回退首套', () => {
    const store = useResumeStore()
    store.createResume('side')
    const item = store.addModule('HOBBIES')!
    expect(item.cptName).toBe('HOBBIES_1')
  })

  it('栏位按模板的左右栏配置落，而不是一律进左栏', () => {
    const store = useResumeStore()
    store.createResume('side')
    expect(store.addModule('WORK_EXPERIENCE')!.layout).toBe('right')
    expect(store.addModule('HOBBIES')!.layout).toBe('')
  })

  it('模板样式扇出到新模块，和其余模块一个样', () => {
    const store = useResumeStore()
    store.createResume('side')
    const style = store.addModule('WORK_EXPERIENCE')!.style as Record<string, unknown>
    expect(style.themeColor).toBe('#850e32')
    expect(style.pLeftRight).toBe('26px')
    expect(style.titleStyle).toBe('underlineTitle')
  })

  it('用户改过的全局样式扇出到新模块，不被模板预设盖回去', () => {
    const store = useResumeStore()
    store.createResume('side')
    store.updateGlobalStyle({ themeColor: '#123456' })
    const style = store.addModule('WORK_EXPERIENCE')!.style as Record<string, unknown>
    expect(style.themeColor).toBe('#123456')
  })
})

describe('载入简历时补拉模板配置', () => {
  beforeEach(() => {
    const config = useConfigStore()
    config.globalStyle = { themeColor: '#079cfa', pTop: '0px', pLeftRight: '' }
    config.modelStyle = {}
  })

  it('从「我的」直接进编辑页（模板列表为空）也能按模板配置取皮肤', async () => {
    vi.mocked(getResumeDetail).mockResolvedValue(makeDetail(makeTemplateResume()))
    vi.mocked(getTemplateDetail).mockResolvedValue(makeTemplate())
    const store = useResumeStore()
    await store.loadResume('1')
    const templateStore = useTemplateStore()
    // 模板是载入简历时异步补拉的：等它进缓存后再新增模块
    await vi.waitFor(() => expect(templateStore.get('side')).toBeTruthy())
    const item = store.addModule('WORK_EXPERIENCE')!
    expect(item.cptName).toBe('WORK_EXPERIENCE_2')
    expect(item.layout).toBe('right')
  })
})
