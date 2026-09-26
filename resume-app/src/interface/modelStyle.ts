interface IMODELSTYLE {
  themeColor: string // 主题色
  firstTitleFontSize: string // 一级标题
  textColor: string
  textFontSize: string
  textFontWeight: number
  titleColor: string
  titleFontSize: string
  titleFontWeight: number
  backgroundColor: string
  pLeftRight: string // 左右内边距
  pTop: string // 上内边距
  pBottom: string // 下内边距
  mBottom: string
  mTop: string
  contentPaddingLeft?: string // 正文内容左缩进（仅富文本正文类模块）
  entryMarginBottom?: string // 列表项间距（仅可添加多条目的模块，如工作 / 项目经历）
  avatarWidth?: string // 头像宽（仅基本资料）
  avatarHeight?: string // 头像高（仅基本资料）
}
export default IMODELSTYLE
