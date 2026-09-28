interface IGlobalStyle {
  themeColor: string // 主题色
  firstTitleFontSize: string // 一级标题
  secondTitleFontSize: string // 二级标题
  textFontSize: string // 正文
  secondTitleColor: string // 二级标题字体颜色
  textFontColor: string // 正文字体颜色
  secondTitleWeight: number // 二级标题字体粗细
  textFontWeight: number // 正文字体粗细
  pTop: string // 上内边距
  pBottom: string // 下内边距
  pLeftRight: string // 左右内边距
  modelMarginTop: string
  modelMarginBottom: string
  leftWidth: string // 左右布局时左侧宽度
  rightWidth: string // 左右布局时右侧宽度
  leftThemeColor: string // 左侧布局时左侧背景色
  rightThemeColor: string // 右侧布局时右侧背景色
  fontFamily: string // 字体
  resumeBackgroundCom: string // 整页背景预设名（空串为纯白）
  titleStyle?: string // 小标题样式预设名（空串为经典标题条，iconBadge 为圆点图标标题）
  fitRatio?: number // 「整理成一页」的整页压缩比例（1 = 未压缩；条目间距 / 标题条高度 / 姓名大小按它算）
}
export default IGlobalStyle
