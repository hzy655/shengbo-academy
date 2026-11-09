/* ============================================================
   data.js — 内置课程数据 + B 站 BV 映射 + 课程合并逻辑
   ============================================================ */

var COURSE_DATA = [
  /* ---------------- 声乐课（6 门） ---------------- */
  {
    id: "vocal-1", module: "vocal",
    title: "零基础发声入门", teacher: "林悦", level: "入门",
    cover: "🎤", gradient: "linear-gradient(135deg,#FF8A66,#F4572F)",
    duration: "约 3 小时", intro: "从认识自己的声音开始，讲透发声原理、正确呼吸与喉部放松，帮助零基础学员建立科学的发声习惯，避免用嗓受伤。",
    chapters: [
      { title: "第一章 认识你的发声器官", lessons: [
        { id: "v1c1l1", title: "发声系统的组成与工作原理", duration: "11:20", free: true },
        { id: "v1c1l2", title: "真声与假声的区别", duration: "13:05", free: false },
        { id: "v1c1l3", title: "常见用嗓误区与伤嗓行为", duration: "12:40", free: false }
      ]},
      { title: "第二章 建立正确发声习惯", lessons: [
        { id: "v1c2l1", title: "放松喉部与肩颈练习", duration: "10:50", free: true },
        { id: "v1c2l2", title: "自然说话式发声训练", duration: "14:15", free: false },
        { id: "v1c2l3", title: "声音的强弱控制入门", duration: "12:00", free: false }
      ]}
    ]
  },
  {
    id: "vocal-2", module: "vocal",
    title: "气息控制与丹田训练", teacher: "周川", level: "入门",
    cover: "🎙️", gradient: "linear-gradient(135deg,#FF9E7A,#E85A3A)",
    duration: "约 3.5 小时", intro: "气为声之本。系统讲解腹式呼吸、气息支撑与长音稳气，解决唱歌气短、声音发虚、尾音发抖的问题。",
    chapters: [
      { title: "第一章 呼吸方式重建", lessons: [
        { id: "v2c1l1", title: "胸式呼吸与腹式呼吸", duration: "12:30", free: true },
        { id: "v2c1l2", title: "找到丹田支撑的位置", duration: "13:50", free: false },
        { id: "v2c1l3", title: "慢吸慢呼基础训练", duration: "15:10", free: false }
      ]},
      { title: "第二章 气息支撑与运用", lessons: [
        { id: "v2c2l1", title: "长音稳气练习", duration: "14:20", free: true },
        { id: "v2c2l2", title: "断气与漏气的纠正", duration: "12:45", free: false },
        { id: "v2c2l3", title: "乐句中的换气口设计", duration: "13:30", free: false }
      ]}
    ]
  },
  {
    id: "vocal-3", module: "vocal",
    title: "咬字吐字与共鸣", teacher: "林悦", level: "进阶",
    cover: "🎵", gradient: "linear-gradient(135deg,#F97E5B,#E04A28)",
    duration: "约 4 小时", intro: "讲解声母韵母的清晰归音、口腔打开与胸腔、头腔共鸣，让声音更通透、咬字更清楚，唱歌不再含糊。",
    chapters: [
      { title: "第一章 清晰咬字", lessons: [
        { id: "v3c1l1", title: "五音与四呼基础", duration: "12:10", free: true },
        { id: "v3c1l2", title: "声母发力与韵母归音", duration: "14:00", free: false },
        { id: "v3c1l3", title: "绕口令综合训练", duration: "11:55", free: false }
      ]},
      { title: "第二章 共鸣腔体开发", lessons: [
        { id: "v3c2l1", title: "打开口腔与打哈欠状态", duration: "13:20", free: true },
        { id: "v3c2l2", title: "胸腔共鸣训练", duration: "15:40", free: false },
        { id: "v3c2l3", title: "鼻腔与头腔共鸣", duration: "14:30", free: false }
      ]}
    ]
  },
  {
    id: "vocal-4", module: "vocal",
    title: "开嗓练声曲实战", teacher: "周川", level: "入门",
    cover: "🎶", gradient: "linear-gradient(135deg,#FF825E,#ED4E2A)",
    duration: "约 3 小时", intro: "一套可每天跟练的科学开嗓流程，从唇颤、音阶到琶音练声曲，帮助声带快速进入状态并拓展音域。",
    chapters: [
      { title: "第一章 科学开嗓五步", lessons: [
        { id: "v4c1l1", title: "热身与唇颤音练习", duration: "10:30", free: true },
        { id: "v4c1l2", title: "哼鸣与闭口练习", duration: "12:20", free: false },
        { id: "v4c1l3", title: "音阶上行下行开嗓", duration: "14:10", free: false }
      ]},
      { title: "第二章 练声曲跟练", lessons: [
        { id: "v4c2l1", title: "五度琶音练声曲", duration: "13:40", free: true },
        { id: "v4c2l2", title: "跳音与连音对比", duration: "12:50", free: false },
        { id: "v4c2l3", title: "拓展音域的训练要点", duration: "15:20", free: false }
      ]}
    ]
  },
  {
    id: "vocal-5", module: "vocal",
    title: "流行演唱技巧", teacher: "苏然", level: "进阶",
    cover: "🎧", gradient: "linear-gradient(135deg,#FA8C68,#E6522E)",
    duration: "约 4.5 小时", intro: "聚焦流行歌曲常用技巧：气声、转音、滑音、哭腔与节奏处理，结合真实曲目拆解，让演唱更有味道。",
    chapters: [
      { title: "第一章 流行音色技巧", lessons: [
        { id: "v5c1l1", title: "气声的运用与控制", duration: "13:10", free: true },
        { id: "v5c1l2", title: "转音与装饰音", duration: "15:00", free: false },
        { id: "v5c1l3", title: "滑音与哭腔处理", duration: "14:25", free: false }
      ]},
      { title: "第二章 节奏与曲目处理", lessons: [
        { id: "v5c2l1", title: "切分与拖拍的拿捏", duration: "13:50", free: true },
        { id: "v5c2l2", title: "主歌与副歌的层次", duration: "14:40", free: false },
        { id: "v5c2l3", title: "完整曲目实战拆解", duration: "16:10", free: false }
      ]}
    ]
  },
  {
    id: "vocal-6", module: "vocal",
    title: "舞台表现力与情感处理", teacher: "苏然", level: "高级",
    cover: "🎤", gradient: "linear-gradient(135deg,#F67955,#D94322)",
    duration: "约 3.5 小时", intro: "从歌词理解、情绪铺垫到肢体语言与镜头表现，训练上台不紧张、开口有故事的综合舞台能力。",
    chapters: [
      { title: "第一章 情感表达", lessons: [
        { id: "v6c1l1", title: "读懂歌词背后的故事", duration: "12:40", free: true },
        { id: "v6c1l2", title: "情绪的递进与爆发", duration: "14:15", free: false },
        { id: "v6c1l3", title: "强弱对比塑造画面感", duration: "13:30", free: false }
      ]},
      { title: "第二章 舞台与镜头", lessons: [
        { id: "v6c2l1", title: "克服紧张的呼吸法", duration: "11:50", free: true },
        { id: "v6c2l2", title: "肢体语言与走位", duration: "14:00", free: false },
        { id: "v6c2l3", title: "面对镜头的表情管理", duration: "13:20", free: false }
      ]}
    ]
  },

  /* ---------------- 开播运营（6 门） ---------------- */
  {
    id: "live-1", module: "live",
    title: "开播前的准备工作", teacher: "宸轩", level: "入门",
    cover: "📱", gradient: "linear-gradient(135deg,#F2B13C,#E0821C)",
    duration: "约 3 小时", intro: "新主播第一课：设备、环境、账号、心态与首播流程清单，照着做就能完成一场不慌乱的首播。",
    chapters: [
      { title: "第一章 硬件与环境", lessons: [
        { id: "b1c1l1", title: "手机、声卡与麦克风选型", duration: "12:10", free: true },
        { id: "b1c1l2", title: "灯光与背景布置", duration: "13:40", free: false },
        { id: "b1c1l3", title: "网络与声音测试清单", duration: "11:30", free: false }
      ]},
      { title: "第二章 首播流程", lessons: [
        { id: "b1c2l1", title: "开播前 30 分钟检查项", duration: "12:50", free: true },
        { id: "b1c2l2", title: "开场五分钟怎么说", duration: "14:20", free: false },
        { id: "b1c2l3", title: "首播心态与预期管理", duration: "13:00", free: false }
      ]}
    ]
  },
  {
    id: "live-2", module: "live",
    title: "主播人设定位与账号搭建", teacher: "子琪", level: "入门",
    cover: "📡", gradient: "linear-gradient(135deg,#F5A623,#D97A16)",
    duration: "约 3 小时", intro: "找准差异化定位，搭建昵称、头像、简介与内容标签统一的账号，让观众一眼记住你。",
    chapters: [
      { title: "第一章 人设定位", lessons: [
        { id: "b2c1l1", title: "人设三要素：专长、性格、记忆点", duration: "13:20", free: true },
        { id: "b2c1l2", title: "对标账号拆解方法", duration: "14:50", free: false },
        { id: "b2c1l3", title: "避开人设雷区", duration: "12:30", free: false }
      ]},
      { title: "第二章 账号搭建", lessons: [
        { id: "b2c2l1", title: "昵称与头像的命名逻辑", duration: "12:40", free: true },
        { id: "b2c2l2", title: "简介与背景图怎么写", duration: "13:10", free: false },
        { id: "b2c2l3", title: "内容标签与垂直度", duration: "14:00", free: false }
      ]}
    ]
  },
  {
    id: "live-3", module: "live",
    title: "直播间话术全攻略", teacher: "宸轩", level: "进阶",
    cover: "💬", gradient: "linear-gradient(135deg,#F4AE38,#DC7E18)",
    duration: "约 4 小时", intro: "从欢迎、留人、互动到逼单、感谢的全场景话术库，配合话术节奏训练，告别直播间冷场。",
    chapters: [
      { title: "第一章 留人互动话术", lessons: [
        { id: "b3c1l1", title: "欢迎与点名话术", duration: "12:50", free: true },
        { id: "b3c1l2", title: "三分钟留人话术结构", duration: "14:30", free: false },
        { id: "b3c1l3", title: "提问与互动小游戏", duration: "13:20", free: false }
      ]},
      { title: "第二章 转化话术", lessons: [
        { id: "b3c2l1", title: "价值塑造与产品介绍", duration: "15:00", free: true },
        { id: "b3c2l2", title: "逼单与促单话术", duration: "14:10", free: false },
        { id: "b3c2l3", title: "感谢与下播话术", duration: "12:20", free: false }
      ]}
    ]
  },
  {
    id: "live-4", module: "live",
    title: "平台流量机制解析", teacher: "子琪", level: "进阶",
    cover: "📈", gradient: "linear-gradient(135deg,#F0A833,#D57614)",
    duration: "约 3.5 小时", intro: "讲透推荐流量、自然流量与付费流量的分发逻辑，理解标签与权重，学会接住每一波推流。",
    chapters: [
      { title: "第一章 流量从哪里来", lessons: [
        { id: "b4c1l1", title: "直播间流量入口全景", duration: "13:00", free: true },
        { id: "b4c1l2", title: "推荐算法与标签匹配", duration: "15:20", free: false },
        { id: "b4c1l3", title: "权重与账号层级", duration: "13:40", free: false }
      ]},
      { title: "第二章 接住推流", lessons: [
        { id: "b4c2l1", title: "推流期的关键数据表现", duration: "14:20", free: true },
        { id: "b4c2l2", title: "互动率与停留如何拉升", duration: "13:50", free: false },
        { id: "b4c2l3", title: "付费流量投放入门", duration: "14:40", free: false }
      ]}
    ]
  },
  {
    id: "live-5", module: "live",
    title: "直播变现路径与转化", teacher: "宸轩", level: "高级",
    cover: "💰", gradient: "linear-gradient(135deg,#EEA230,#CE6F12)",
    duration: "约 4 小时", intro: "梳理打赏、带货、知识付费与私域等变现方式，讲解成交链路设计与转化率提升的完整方法。",
    chapters: [
      { title: "第一章 变现模式", lessons: [
        { id: "b5c1l1", title: "主流变现方式对比", duration: "12:30", free: true },
        { id: "b5c1l2", title: "打赏与带货的选择", duration: "14:00", free: false },
        { id: "b5c1l3", title: "私域引流与复购", duration: "13:30", free: false }
      ]},
      { title: "第二章 成交链路", lessons: [
        { id: "b5c2l1", title: "成交四步：信任、需求、方案、紧迫", duration: "15:10", free: true },
        { id: "b5c2l2", title: "转化率诊断与优化", duration: "14:20", free: false },
        { id: "b5c2l3", title: "客单价与排品策略", duration: "13:40", free: false }
      ]}
    ]
  },
  {
    id: "live-6", module: "live",
    title: "排期规划与数据复盘", teacher: "子琪", level: "高级",
    cover: "📊", gradient: "linear-gradient(135deg,#EBA02C,#C96B10)",
    duration: "约 3.5 小时", intro: "学会制定可持续的直播排期，读懂后台数据并做结构化复盘，让每一场直播都比上一场更好。",
    chapters: [
      { title: "第一章 排期规划", lessons: [
        { id: "b6c1l1", title: "固定开播时段的重要性", duration: "12:20", free: true },
        { id: "b6c1l2", title: "周度排期表制定", duration: "13:40", free: false },
        { id: "b6c1l3", title: "场次内容与脚本规划", duration: "14:10", free: false }
      ]},
      { title: "第二章 数据复盘", lessons: [
        { id: "b6c2l1", title: "核心数据指标解读", duration: "14:30", free: true },
        { id: "b6c2l2", title: "复盘表的填写方法", duration: "13:20", free: false },
        { id: "b6c2l3", title: "用复盘结论指导下场", duration: "14:50", free: false }
      ]}
    ]
  }
];

/* 课程级 B 站 BV 号（同一门课的课时复用，作者可在后台逐课时替换） */
var COURSE_BV = {
  "vocal-1": "BV1GShP65ENV",
  "vocal-2": "BV1cw9LB1EP9",
  "vocal-3": "BV1GShP65ENV",
  "vocal-4": "BV1rNFpzEEDq",
  "vocal-5": "BV1GShP65ENV",
  "vocal-6": "BV1GShP65ENV",
  "live-1": "BV1hAvYBAEyF",
  "live-2": "BV1CZEWziE3k",
  "live-3": "BV1ZhEc61E5z",
  "live-4": "BV1hAvYBAEyF",
  "live-5": "BV18VndzCEhC",
  "live-6": "BV18VndzCEhC"
};

/* 按课时 ID 构建 BV_MAP */
var BV_MAP = {};
COURSE_DATA.forEach(function (course) {
  var bv = COURSE_BV[course.id];
  course.chapters.forEach(function (ch) {
    ch.lessons.forEach(function (ls) { BV_MAP[ls.id] = bv; });
  });
});

/* 给课时注入 bvid：课时自带 > BV_MAP > 课程级 defaultBv */
function attachBv(course) {
  course.chapters.forEach(function (ch) {
    ch.lessons.forEach(function (ls) {
      ls.bvid = ls.bvid || BV_MAP[ls.id] || course.defaultBv || "";
    });
  });
  return course;
}

/* 三层合并：内置 + 覆盖层 + 自定义 */
function mergeCourses() {
  var layer = Store.getCourseLayer();
  var list = COURSE_DATA.map(function (c) {
    var ov = layer.overrides[c.id];
    var merged = ov ? Object.assign({}, c, ov, { chapters: ov.chapters ? ov.chapters : c.chapters }) : c;
    return Object.assign({}, merged, { _builtin: true });
  });
  layer.custom.forEach(function (c) {
    list.push(Object.assign({}, c, { _builtin: false }));
  });
  list.forEach(attachBv);
  return list;
}

function getAllCourses() { return mergeCourses(); }

function getVisibleCourses(module) {
  var layer = Store.getCourseLayer();
  return mergeCourses().filter(function (c) {
    return c.module === module && !layer.offline[c.id];
  });
}

function getCourseById(id) {
  var found = null;
  mergeCourses().forEach(function (c) { if (c.id === id) found = c; });
  return found;
}

function countLessons(course) {
  var n = 0;
  course.chapters.forEach(function (ch) { n += ch.lessons.length; });
  return n;
}

function findLesson(course, lessonId) {
  var target = null;
  course.chapters.forEach(function (ch) {
    ch.lessons.forEach(function (ls) { if (ls.id === lessonId) target = ls; });
  });
  return target;
}

function lessonIndex(course, lessonId) {
  var idx = 0;
  for (var i = 0; i < course.chapters.length; i++) {
    for (var j = 0; j < course.chapters[i].lessons.length; j++) {
      if (course.chapters[i].lessons[j].id === lessonId) return idx;
      idx++;
    }
  }
  return -1;
}

/* 考核题目：后台覆盖优先，否则用内置题库 */
function getQuizQuestions(courseId) {
  var layer = Store.getCourseLayer();
  return layer.quiz[courseId] || window.QUIZ_DATA[courseId] || [];
}

/* 考核及格线等元数据 */
function getQuizMeta(courseId) {
  var layer = Store.getCourseLayer();
  return layer.quizMeta[courseId] || { passScore: 60 };
}
