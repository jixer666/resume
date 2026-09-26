import type IMODELDATAJSON from '@/interface/modelData'

const MODEL_DATA_JSON: IMODELDATAJSON = {
  RESUME_TITLE: {
    iconfont: 'icon-xiangmujingli-04',
    model: 'RESUME_TITLE',
    show: true,
    title: '我的简历',
  },
  BASE_INFO: {
    iconfont: 'icon-jibenziliao',
    model: 'BASE_INFO',
    show: true,
    title: '基本资料',
    name: '小明',
    age: 25,
    avatarShape: '', // 头像形状
    address: '四川成都', // 所在地址
    avatar: 'https://maobucv.com:9000/resume/avatar/file-1663290281512.jpg', // 头像地址
    workService: 3, // 工作年限
    phoneNumber: '028-1234321', // 联系电话
    email: '12322233@qq.com', // 邮箱
    abstract: '', // 简介
    degree: '本科',
    isShow: {
      age: true,
      address: true, // 所在地址
      avatar: true, // 头像地址
      workService: true, // 工作年限
      phoneNumber: true, // 联系电话
      email: true, // 邮箱
      abstract: true, // 简介
      degree: true,
    },
  },
  JOB_INTENTION: {
    iconfont: 'icon-yixianggangwei',
    model: 'JOB_INTENTION',
    show: true,
    title: '求职意向',
    intendedPositions: '工程师', // 意向岗位
    intendedCity: '成都', // 意向城市
    expectSalary: '8000-10000', // 期望薪资
    jobStatus: '随时入职', // 求职状态
    jobSearchType: '全职',
    isShow: {
      intendedPositions: true,
      intendedCity: true,
      expectSalary: true,
      jobStatus: true,
      jobSearchType: true,
    },
  },
  EDU_BACKGROUND: {
    iconfont: 'icon-education-1-copy',
    model: 'EDU_BACKGROUND',
    show: true,
    title: '教育背景',
    LIST: [
      {
        date: ['2021-9', '2025-6'],
        schoolName: '四川大学', // 学校名称
        specialized: '软件工程', // 专业
        degree: '本科', // 学历
        majorCourse: 'Java、数据库、前端、后端、移动开发、测试、项目管理', // 主修课程
      },
    ],
    isShow: {
      date: true,
      schoolName: true,
      specialized: true,
      degree: true,
      majorCourse: true,
    },
  },
  SKILL_SPECIALTIES: {
    iconfont: 'icon-zhuanyezhishijineng',
    model: 'SKILL_SPECIALTIES',
    show: true,
    title: '专业技能',
    // 整段富文本，用户自由输入技能描述
    content: '',
  },
  CAMPUS_EXPERIENCE: {
    iconfont: 'icon-jiatimianban_timu',
    model: 'CAMPUS_EXPERIENCE',
    show: true,
    title: '校园经历',
    LIST: [
      {
        date: ['2021-9', '2022-10'], // 经历时间
        campusBriefly: '计算机技术协会',
        campusDuty: '部长',
        campusContent: '简要概述经历内容或者工作内容等等',
      },
    ],
    isShow: {
      date: true, // 经历时间
      campusBriefly: true,
      campusDuty: true,
      campusContent: true,
    },
  },
  INTERNSHIP_EXPERIENCE: {
    iconfont: 'icon-biyeshixi',
    model: 'INTERNSHIP_EXPERIENCE',
    show: true,
    title: '实习经验',
    LIST: [
      {
        date: ['2021-9', '2022-10'], // 实习时间
        companyName: 'XXX有限公司', // 公司名称
        posts: 'XXX实习生', // 职位
        jobContent: [
          {
            content: '简要概述在岗时的工作内容',
          },
        ],
      },
    ],
    isShow: {
      date: true,
      companyName: true,
      posts: true,
      jobContent: true,
    },
  },
  WORK_EXPERIENCE: {
    iconfont: 'icon-gongzuojingyan',
    model: 'WORK_EXPERIENCE',
    show: true,
    title: '工作经验',
    LIST: [
      {
        date: ['2021-9', '2022-10'], // 工作时间
        companyName: 'XXX公司', // 公司名称
        posts: 'XXX工程师', // 职位
        jobContent: [
          {
            content: '简要概述在岗时的工作内容',
          },
        ],
      },
    ],
    isShow: {
      date: true,
      companyName: true,
      posts: true,
    },
  },
  PROJECT_EXPERIENCE: {
    iconfont: 'icon-xiangmu',
    model: 'PROJECT_EXPERIENCE',
    show: true,
    title: '项目经验',
    LIST: [
      {
        date: ['2021-9', '2022-10'], // 项目时间
        projectName: '苍穹外卖', // 项目名称
        posts: 'XXX开发', // 项目职责
        projectContent: [
          {
            content: '简要介绍该项目以及你在项目内的主要工作内容',
          },
        ],
      },
    ],
    isShow: {
      date: true,
      projectName: true,
      posts: true,
    },
  },
  AWARDS: {
    iconfont: 'icon-rongyu1',
    model: 'AWARDS',
    show: true,
    title: '荣誉奖项',
    LIST: [
      {
        date: '2021-9', // 获奖时间
        awardsName: 'ACM',
        awardsGrade: '金牌',
      },
    ],
    isShow: {
      date: true,
      awardsName: true,
      awardsGrade: true,
    },
  },
  HOBBIES: {
    iconfont: 'icon-xingquaihao',
    model: 'HOBBIES',
    show: true,
    title: '兴趣爱好',
    content: '简要介绍一些自己的兴趣爱好，比如逛技术博客、运动等等',
    style: {
      textColor: '#757575',
      textFontSize: '14px',
      textFontWeight: 500,
      mBottom: '45px',
      mTop: '0px',
    },
  },
  SELF_EVALUATION: {
    iconfont: 'icon-ziwopingjia',
    model: 'SELF_EVALUATION',
    show: true,
    title: '自我评价',
    content: '对自己做一个简单的评价，比如有较强的责任心等等',
  },
  WORKS_DISPLAY: {
    iconfont: 'icon-zhuanyezhishijineng',
    model: 'WORKS_DISPLAY',
    show: true,
    title: '作品展示',
    LIST: [
      {
        worksName: '作品名称',
        worksLink: 'https://maobucv.com',
        worksIntroduce: '简要介绍该作品是什么，解决了什么问题等等',
      },
    ],
  },
}
export default MODEL_DATA_JSON
