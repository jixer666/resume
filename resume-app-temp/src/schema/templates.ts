import type { IResumeTemplate } from './types'

/**
 * 模板清单：模板 = 组合 id（composition）+ GLOBAL_STYLE 覆盖 + 封面。
 *
 * id 与 src/static/resume/template-{id}.svg 一一对应，封面文件不存在时列表页回退到占位底色。
 * 换模板即换这份 JSON，不需要写任何绘制代码。
 *
 * 风格差异不止配色，而是七个维度同时变：
 * 主题色 / 字体族 / 字号体系 / 标题字重 / 标题形态 / 条目形态 / 间距节奏与圆角。
 */
export const TEMPLATES: IResumeTemplate[] = [
  {
    id: 'classic',
    name: '经典商务',
    description: '顶部色条配居中身份区，通用稳妥，适合大多数岗位。',
    cover: '/static/resume/template-classic.svg',
    composition: 'classic',
    style: {
      themeColor: '#2563eb',
      firstTitleFontSize: '20px',
      titleFontWeight: 700,
      titleStyle: 'bar',
      topBarHeight: '8px',
      entryStyle: 'plain',
      entryGap: '9px',
      mBottom: '16px',
    },
  },
  {
    id: 'sidebar',
    name: '侧边栏',
    description: '深色侧边栏布局，信息分区清晰，适合技术岗位。',
    cover: '/static/resume/template-sidebar.svg',
    composition: 'leftSidebar',
    style: {
      themeColor: '#2563eb',
      leftWidth: '250px',
      leftThemeColor: '#0f2747',
      titleStyle: 'plain',
      avatarShape: 'circle',
      cardRadius: '4px',
      pLeftRight: '24px',
      entryStyle: 'divider',
      entryGap: '8px',
    },
  },
  {
    id: 'minimal',
    name: '极简留白',
    description: '大量留白的极简风格，适合追求高级感的求职者。',
    cover: '/static/resume/template-minimal.svg',
    composition: 'minimal',
    style: {
      themeColor: '#334155',
      firstTitleFontSize: '20px',
      titleFontWeight: 500,
      textColor: '#5b6577',
      titleStyle: 'plain',
      pLeftRight: '40px',
      mBottom: '16px',
      lineHeight: '1.65',
      entryStyle: 'plain',
      entryGap: '10px',
    },
  },
  {
    id: 'split',
    name: '双栏分栏',
    description: '顶部横幅加左右双栏，内容紧凑，适合经历丰富的求职者。',
    cover: '/static/resume/template-split.svg',
    composition: 'split',
    style: {
      themeColor: '#0d9488',
      leftWidth: '250px',
      rightWidth: 'auto',
      titleStyle: 'plain',
      cardRadius: '8px',
      pLeftRight: '32px',
      entryStyle: 'band',
      entryGap: '8px',
    },
  },
  {
    id: 'timeline',
    name: '时间轴',
    description: '竖向时间线串起教育与工作经历，脉络清晰，适合校招与晋升述职。',
    cover: '/static/resume/template-timeline.svg',
    composition: 'timeline',
    style: {
      themeColor: '#4f46e5',
      titleFontWeight: 700,
      titleColor: '#312e81',
      titleStyle: 'plain',
      pLeftRight: '48px',
      lineHeight: '1.6',
      entryStyle: 'divider',
      entryGap: '8px',
    },
  },
  {
    id: 'banner',
    name: '横幅头图',
    description: '顶部身份区配主题色强调，视觉冲击强，适合设计与新媒体岗位。',
    cover: '/static/resume/template-banner.svg',
    composition: 'banner',
    style: {
      themeColor: '#0891b2',
      titleColor: '#0891b2',
      titleStyle: 'plain',
      cardRadius: '8px',
      pLeftRight: '40px',
      mBottom: '14px',
      entryStyle: 'band',
      entryGap: '8px',
    },
  },
  {
    id: 'compact',
    name: '紧凑列表',
    description: '信息密度高、行距紧凑，适合一页塞下多段经历的资深求职者。',
    cover: '/static/resume/template-compact.svg',
    composition: 'compact',
    style: {
      themeColor: '#ea580c',
      firstTitleFontSize: '16px',
      titleFontSize: '13px',
      textFontSize: '12px',
      titleStyle: 'underline',
      cardRadius: '4px',
      lineHeight: '1.45',
      mBottom: '14px',
      pLeftRight: '36px',
      entryStyle: 'divider',
      entryGap: '7px',
    },
  },
  {
    id: 'card',
    name: '简约卡片',
    description: '各分区以白卡呈现，现代清爽，适合互联网与产品运营。',
    cover: '/static/resume/template-card.svg',
    composition: 'classic',
    style: {
      themeColor: '#7c3aed',
      titleStyle: 'softChip',
      pageBackground: '#faf7ff',
      backgroundColor: '#ffffff',
      // 卡片描边用淡紫而非主题色派生，与封面卡片的淡紫描边一致
      dividerColor: '#e2d8f5',
      cardRadius: '10px',
      pLeftRight: '36px',
      pTop: '18px',
      pBottom: '18px',
      // 一个分区一张白卡：条目内部保持素净，卡片感由 moduleCard 提供
      moduleCard: 'card',
      entryStyle: 'plain',
      entryGap: '10px',
      mBottom: '14px',
    },
  },
  {
    id: 'formal',
    name: '正式文书',
    description: '居中标题配深色正装风格，符合传统企事业单位阅览习惯。',
    cover: '/static/resume/template-formal.svg',
    composition: 'classic',
    style: {
      themeColor: '#1e3a5f',
      titleFontWeight: 700,
      titleColor: '#1e3a5f',
      textColor: '#3d4657',
      titleStyle: 'underline',
      titleAlign: 'center',
      fontFamily: 'serif',
      cardRadius: '4px',
      pLeftRight: '48px',
      lineHeight: '1.7',
      entryStyle: 'divider',
      entryGap: '9px',
    },
  },
  {
    id: 'creative',
    name: '创意设计',
    description: '彩色几何角标加数据卡片，个性鲜明，适合创意与文案类岗位。',
    cover: '/static/resume/template-creative.svg',
    composition: 'showcase',
    style: {
      themeColor: '#16a34a',
      titleFontWeight: 700,
      leftWidth: '250px',
      titleStyle: 'plain',
      cardRadius: '12px',
      pLeftRight: '32px',
      entryStyle: 'card',
      entryGap: '7px',
    },
  },
  {
    id: 'right-sidebar',
    name: '右置信息栏',
    description: '天蓝信息栏右置，主叙事优先，适合突出项目经历的岗位。',
    cover: '/static/resume/template-sky-column.svg',
    composition: 'rightSidebar',
    style: {
      themeColor: '#0ea5e9',
      leftWidth: 'auto',
      rightWidth: '250px',
      rightThemeColor: '#7dd3fc',
      titleStyle: 'plain',
      cardRadius: '6px',
      pLeftRight: '30px',
      entryStyle: 'band',
      entryGap: '8px',
    },
  },
]

/** 默认模板 id */
export const DEFAULT_TEMPLATE_ID = 'classic'

/** 取一份模板，id 非法时回退到默认模板 */
export function getTemplate(id: string): IResumeTemplate {
  return TEMPLATES.find(item => item.id === id) || TEMPLATES[0]
}

/** 模板 id 是否合法 */
export function hasTemplate(id: string): boolean {
  return TEMPLATES.some(item => item.id === id)
}

/** 旧版模板 id 的去重映射，兼容历史数据 */
const LEGACY_TEMPLATE_MAP: Record<string, string> = {
  blue: 'classic',
  navy: 'classic',
  cyan: 'classic',
  green: 'classic',
  orange: 'compact',
  purple: 'creative',
}

/** 把任意历史 id 归一化为当前合法模板 id */
export function normalizeTemplateId(id?: string): string {
  if (!id)
    return DEFAULT_TEMPLATE_ID
  if (LEGACY_TEMPLATE_MAP[id])
    return LEGACY_TEMPLATE_MAP[id]
  return hasTemplate(id) ? id : DEFAULT_TEMPLATE_ID
}
