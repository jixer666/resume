import type { IMSTERIALLISTJSON } from '@/interface/material'

/**
 * 组件列表：模块名 → 该模块的皮肤清单（事实源）。
 *
 * 皮肤文件在 src/material/<Model>/<Model><N>/ 下，新增一套皮肤后在这里登记，
 * 再跑 `pnpm gen:material` 生成派发组件 CompatRenderer。
 * 当前登记两套：`_1` 经典模板（classic）用，`_2` 名片模板（card）用
 * （两套只有基础资料头部不同，正文皮肤共用 `_1`），其余皮肤按需再补。
 *
 * 每组的**第一套**皮肤是该模块的默认皮肤（新建简历 / 模板没指定变体时用它），
 * 所以 `_1` 必须排在各组首位。
 */
export const MATERIAL_JSON: IMSTERIALLISTJSON = {
  RESUME_TITLE: [
    {
      keyId: '', // 组件id
      model: 'RESUME_TITLE', // 模块
      cptName: 'RESUME_TITLE_1', // 组件名
      cptOptionsName: 'RESUME_TITLE_OPTIONS',
      cptTitle: '简历标题', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '100px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  BASE_INFO: [
    {
      keyId: '', // 组件id
      model: 'BASE_INFO', // 模块
      cptName: 'BASE_INFO_1', // 组件名
      cptOptionsName: 'BASE_INFO_OPTIONS',
      cptTitle: '基础资料', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '100px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
        avatarWidth: '84px',
        avatarHeight: '100px',
      }, // 组件样式
      data: {}, // 组件数据
    },
    {
      keyId: '', // 组件id
      model: 'BASE_INFO', // 模块
      cptName: 'BASE_INFO_2', // 组件名
      cptOptionsName: 'BASE_INFO_OPTIONS',
      cptTitle: '基础资料', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '100px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
        avatarWidth: '84px',
        avatarHeight: '100px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  JOB_INTENTION: [
    {
      keyId: '', // 组件id
      model: 'JOB_INTENTION', // 模块
      cptName: 'JOB_INTENTION_1', // 组件名
      cptOptionsName: 'JOB_INTENTION_OPTIONS',
      cptTitle: '求职意向', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '100px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  EDU_BACKGROUND: [
    {
      keyId: '', // 组件id
      model: 'EDU_BACKGROUND', // 模块
      cptName: 'EDU_BACKGROUND_1', // 组件名
      cptOptionsName: 'EDU_BACKGROUND_OPTIONS',
      cptTitle: '教育背景', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '100px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  SKILL_SPECIALTIES: [
    {
      keyId: '', // 组件id
      model: 'SKILL_SPECIALTIES', // 模块
      cptName: 'SKILL_SPECIALTIES_1', // 组件名
      cptOptionsName: 'SKILL_SPECIALTIES_OPTIONS',
      cptTitle: '专业技能', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  CAMPUS_EXPERIENCE: [
    {
      keyId: '', // 组件id
      model: 'CAMPUS_EXPERIENCE', // 模块
      cptName: 'CAMPUS_EXPERIENCE_1', // 组件名
      cptOptionsName: 'CAMPUS_EXPERIENCE_OPTIONS',
      cptTitle: '校园经历', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  INTERNSHIP_EXPERIENCE: [
    {
      keyId: '', // 组件id
      model: 'INTERNSHIP_EXPERIENCE', // 模块
      cptName: 'INTERNSHIP_EXPERIENCE_1', // 组件名
      cptOptionsName: 'INTERNSHIP_EXPERIENCE_OPTIONS',
      cptTitle: '实习经验', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  WORK_EXPERIENCE: [
    {
      keyId: '', // 组件id
      model: 'WORK_EXPERIENCE', // 模块
      cptName: 'WORK_EXPERIENCE_1', // 组件名
      cptOptionsName: 'WORK_EXPERIENCE_OPTIONS',
      cptTitle: '工作经验', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  PROJECT_EXPERIENCE: [
    {
      keyId: '', // 组件id
      model: 'PROJECT_EXPERIENCE', // 模块
      cptName: 'PROJECT_EXPERIENCE_1', // 组件名
      cptOptionsName: 'PROJECT_EXPERIENCE_OPTIONS',
      cptTitle: '项目经验', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  AWARDS: [
    {
      keyId: '', // 组件id
      model: 'AWARDS', // 模块
      cptName: 'AWARDS_1', // 组件名
      cptOptionsName: 'AWARDS_OPTIONS',
      cptTitle: '荣誉奖项', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  HOBBIES: [
    {
      keyId: '', // 组件id
      model: 'HOBBIES', // 模块
      cptName: 'HOBBIES_1', // 组件名
      cptOptionsName: 'HOBBIES_OPTIONS',
      cptTitle: '兴趣爱好', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  SELF_EVALUATION: [
    {
      keyId: '', // 组件id
      model: 'SELF_EVALUATION', // 模块
      cptName: 'SELF_EVALUATION_1', // 组件名
      cptOptionsName: 'SELF_EVALUATION_OPTIONS',
      cptTitle: '自我评价', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
  WORKS_DISPLAY: [
    {
      keyId: '', // 组件id
      model: 'WORKS_DISPLAY', // 模块
      cptName: 'WORKS_DISPLAY_1', // 组件名
      cptOptionsName: 'WORKS_DISPLAY_OPTIONS',
      cptTitle: '作品展示', // 组件名
      cptX: 0, // 组件x坐标
      cptY: 0, // 组件y坐标
      cptZ: 0, // 组件z坐标
      cptHeight: '50px', // 组件高度
      cptWidth: '100%', // 组件宽度
      layout: 'center', // 布局在左侧还是右侧
      show: true, // 组件是否显示
      style: {
        themeColor: '#2b74ff',
        firstTitleFontSize: '16px',
        titleColor: '#121c26',
        titleFontSize: '13px',
        titleFontWeight: 600,
        textColor: '#4b5563',
        textFontSize: '13px',
        textFontWeight: 400,
        backgroundColor: '',
        mBottom: '0px',
        mTop: '0px',
        pTop: '12px',
        pBottom: '0px',
        pLeftRight: '48px',
      }, // 组件样式
      data: {}, // 组件数据
    },
  ],
}
