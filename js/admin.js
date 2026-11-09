/* ============================================================
   admin.js — 管理员后台：仪表盘、课程、用户、管理员、评分标准
   ============================================================ */

var ICON = {
  dash: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  book: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
  plus: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  users: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  shield: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  ruler: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15l12-12 6 6L9 21z"/><path d="M7 11l2 2M11 7l2 2M15 11l2 2"/></svg>',
  crown: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l-1-8 5 4 5-7 5 7 5-4-1 8z"/><path d="M3 21h18"/></svg>',
  back: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  out: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>'
};

var MENU = [
  { key: "dashboard", hash: "#/admin", label: "仪表盘", icon: ICON.dash },
  { key: "courses", hash: "#/admin/courses", label: "课程管理", icon: ICON.book },
  { key: "course-new", hash: "#/admin/course-new", label: "新建课程", icon: ICON.plus },
  { key: "users", hash: "#/admin/users", label: "用户管理", icon: ICON.users },
  { key: "admins", hash: "#/admin/admins", label: "管理员账号", icon: ICON.shield },
  { key: "score-rules", hash: "#/admin/score-rules", label: "评分标准", icon: ICON.ruler },
  { key: "membership", hash: "#/admin/membership", label: "会员管理", icon: ICON.crown }
];

var Admin = {
  /* ---------- 登录页 ---------- */
  renderLogin: function (app) {
    app.innerHTML =
      '<div class="auth-wrap"><div class="auth-brand"><div class="auth-logo">管</div>' +
      '<h1>管理员登录</h1><p>声播学院内容管理后台</p></div>' +
      '<div class="auth-card"><div class="field"><label>管理员账号</label>' +
      '<input class="input" id="admUser" autocomplete="username" placeholder="请输入管理员账号"></div>' +
      '<div class="field"><label>密码</label>' +
      '<input class="input" id="admPwd" type="password" autocomplete="current-password" placeholder="请输入密码" onkeydown="if(event.key===\'Enter\')Admin.doLogin()"></div>' +
      '<div id="admError" class="form-error"></div>' +
      '<button class="btn btn-primary btn-block" onclick="Admin.doLogin()">登录后台</button></div>' +
      '<div class="auth-foot"><a href="#/login">返回用户登录</a></div></div>';
  },

  doLogin: function () {
    var u = document.getElementById("admUser").value;
    var p = document.getElementById("admPwd").value;
    var res = Auth.adminLogin(u, p);
    if (!res.ok) { document.getElementById("admError").textContent = res.error; return; }
    location.hash = "#/admin";
  },

  /* ---------- 后台外壳 ---------- */
  shell: function (active, title, content) {
    var admin = Auth.currentAdmin();
    var nav = MENU.map(function (m) {
      return '<button class="admin-nav-item' + (m.key === active ? " active" : "") +
        '" onclick="location.hash=\'' + m.hash + '\'">' + m.icon + '<span>' + m.label + "</span></button>";
    }).join("");

    return '<div class="admin-shell"><aside class="admin-sidebar">' +
      '<div class="admin-brand">声播学院<small>内容管理后台</small></div>' +
      '<nav class="admin-nav">' + nav + '</nav>' +
      '<div class="admin-side-foot">' +
      '<button class="admin-nav-item" onclick="location.hash=\'#/home\'">' + ICON.back + "<span>返回前台</span></button>" +
      '<button class="admin-nav-item" onclick="Admin.doLogout()">' + ICON.out + "<span>退出登录</span></button>" +
      "</div></aside>" +
      '<div class="admin-main"><header class="admin-topbar"><h2>' + esc(title) + '</h2>' +
      '<div class="admin-who"><span>当前管理员</span><div class="aw-avatar">' + esc(admin.username.charAt(0)) +
      "</div><b>" + esc(admin.username) + "</b></div></header>" +
      '<div class="admin-content">' + content + "</div></div></div>";
  },

  doLogout: function () { Auth.adminLogout(); location.hash = "#/admin/login"; },

  /* ---------- 仪表盘 ---------- */
  renderDashboard: function (app) {
    var all = getAllCourses();
    var layer = Store.getCourseLayer();
    var offlineCount = Object.keys(layer.offline).filter(function (id) { return layer.offline[id]; }).length;
    var checkins = Store.getCheckins();
    var todayCheck = checkins.filter(function (d) { return d === Store.today(); }).length;

    var content = '<div class="stat-cards">' +
      Admin.statCard("课程总数", all.length, "含声乐与开播两个模块") +
      Admin.statCard("已上架课程", all.length - offlineCount, "下架课程不计入") +
      Admin.statCard("注册用户", Store.getUsers().length, "本地账号总数") +
      Admin.statCard("今日打卡", todayCheck, "完成学习打卡的人次") +
      "</div>" +
      '<div class="section-title">快捷操作</div><div class="editor-block">' +
      '<button class="btn btn-primary" onclick="location.hash=\'#/admin/course-new\'">新建课程</button> ' +
      '<button class="btn btn-line" onclick="location.hash=\'#/admin/courses\'">管理课程上下架</button> ' +
      '<button class="btn btn-line" onclick="location.hash=\'#/admin/score-rules\'">配置评分标准</button>' +
      "</div>";

    app.innerHTML = Admin.shell("dashboard", "仪表盘", content);
  },

  statCard: function (label, value, foot) {
    return '<div class="stat-card"><div class="sc-label">' + esc(label) + '</div>' +
      '<div class="sc-value">' + value + '</div><div class="sc-foot">' + esc(foot) + "</div></div>";
  },

  /* ---------- 课程管理 ---------- */
  renderCourses: function (app) {
    var layer = Store.getCourseLayer();
    var rows = getAllCourses().map(function (c) {
      var isOff = !!layer.offline[c.id];
      var modLabel = c.module === "vocal" ? "声乐课" : "开播运营";
      var origin = c._builtin ? "内置" : "自定义";
      return "<tr><td><span class=\"tag tag-primary\">" + modLabel + "</span></td>" +
        '<td class="course-title-cell"><b>' + esc(c.title) + '</b><div style="font-size:12px;color:var(--text-3);margin-top:3px">' +
        esc(c.teacher) + " · " + esc(c.level) + " · " + origin + "</div></td>" +
        "<td>" + countLessons(c) + " 课时</td>" +
        '<td><span class="tag ' + (isOff ? "tag-danger" : "tag-success") + '">' + (isOff ? "已下架" : "已上架") + "</span></td>" +
        '<td><div class="row-actions">' +
        '<button class="btn btn-sm btn-line" onclick="location.hash=\'#/admin/course-edit/' + c.id + '\'">编辑</button>' +
        '<button class="btn btn-sm ' + (isOff ? "btn-ghost" : "btn-danger") + '" onclick="Admin.toggleOffline(\'' + c.id + '\')">' +
        (isOff ? "重新上架" : "下架") + "</button>" +
        (c._builtin ? "" : '<button class="btn btn-sm btn-danger" onclick="Admin.deleteCourse(\'' + c.id + '\')">删除</button>') +
        "</div></td></tr>";
    }).join("");

    var content = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
      "<th>模块</th><th>课程</th><th>规模</th><th>状态</th><th>操作</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>";

    app.innerHTML = Admin.shell("courses", "课程管理", content);
  },

  toggleOffline: function (id) {
    var layer = Store.getCourseLayer();
    if (layer.offline[id]) delete layer.offline[id]; else layer.offline[id] = true;
    Store.saveCourseLayer(layer);
    App.toast(layer.offline[id] ? "课程已下架" : "课程已重新上架");
    Admin.renderCourses(document.getElementById("app"));
  },

  deleteCourse: function (id) {
    var layer = Store.getCourseLayer();
    layer.custom = layer.custom.filter(function (c) { return c.id !== id; });
    Store.saveCourseLayer(layer);
    App.toast("课程已删除");
    Admin.renderCourses(document.getElementById("app"));
  }
};

/* ============================================================
   第二部分：课程编辑器、用户、管理员、评分标准、会员占位
   ============================================================ */
Object.assign(Admin, {
  editing: null,
  editId: null,

  /* ---------- 新建 / 编辑课程 ---------- */
  renderCourseNew: function (app) {
    Admin.editId = null;
    Admin.editing = {
      module: "vocal", title: "", teacher: "", level: "入门",
      cover: "🎵", gradient: "linear-gradient(135deg,#FF8A66,#F4572F)",
      duration: "", intro: "", defaultBv: "",
      chapters: [{ title: "第一章", lessons: [] }]
    };
    Admin.quizDraft = Admin.blankQuiz(10);
    Admin.quizMeta = { passScore: 60 };
    Admin.drawEditor(app, "新建课程");
  },

  renderCourseEdit: function (app, id) {
    var src = getCourseById(id);
    if (!src) { location.hash = "#/admin/courses"; return; }
    Admin.editId = id;
    Admin.editing = JSON.parse(JSON.stringify(src));
    delete Admin.editing._builtin;
    var layer = Store.getCourseLayer();
    Admin.quizDraft = JSON.parse(JSON.stringify(layer.quiz[id] || window.QUIZ_DATA[id] || Admin.blankQuiz(10)));
    Admin.quizMeta = JSON.parse(JSON.stringify(layer.quizMeta[id] || { passScore: 60 }));
    Admin.drawEditor(app, "编辑课程 · " + src.title);
  },

  blankQuiz: function (n) {
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr.push({ q: "", options: ["", "", "", ""], answer: 0 });
    }
    return arr;
  },

  drawEditor: function (app, title) {
    var c = Admin.editing;
    var chapters = c.chapters.map(function (ch, ci) {
      var lessons = ch.lessons.map(function (ls, li) {
        var freeSel =
          '<select onchange="Admin.editing.chapters[' + ci + '].lessons[' + li + '].free=this.value==\'1\'">' +
          "<option value=\"0\"" + (ls.free ? "" : " selected") + ">付费</option>" +
          "<option value=\"1\"" + (ls.free ? " selected" : "") + ">免费</option></select>";

        var videoBlock = ls.videoId
          ? '<div class="video-info"><span class="video-dot"></span><span>已上传视频：' + esc(ls.videoName || "本地视频") +
            "（" + Admin.fmtSize(ls.videoSize || 0) + '）</span>' +
            '<button class="btn btn-sm btn-danger" onclick="Admin.removeVideo(' + ci + "," + li + ')">移除视频</button></div>'
          : '<label class="upload-label"><input type="file" accept="video/*" hidden onchange="Admin.onVideoPick(event,' +
            ci + "," + li + ')"><span class="upload-ico">⬆</span>上传课程视频</label>';

        return '<div class="edit-lesson">' +
          '<div class="el-row">' +
          '<input class="el-title" placeholder="课时标题" value="' + esc(ls.title) +
          '" oninput="Admin.editing.chapters[' + ci + '].lessons[' + li + '].title=this.value">' +
          '<input class="el-dur" placeholder="时长" value="' + esc(ls.duration) +
          '" oninput="Admin.editing.chapters[' + ci + '].lessons[' + li + '].duration=this.value">' +
          freeSel +
          '<button class="btn btn-sm btn-danger" onclick="Admin.removeLesson(' + ci + "," + li + ')">移除</button>' +
          "</div>" +
          '<div class="el-row">' +
          '<input class="el-link" placeholder="粘贴 B 站完整链接或 BV 号（可空）" value="' + esc(ls.bvid || "") +
          '" oninput="Admin.onLinkInput(' + ci + "," + li + ',this)">' +
          '<button class="btn btn-sm btn-ghost" onclick="Admin.openRecommend(' + ci + "," + li + ')">推荐链接</button>' +
          "</div>" +
          '<div class="el-row">' + videoBlock + "</div>" +
          "</div>";
      }).join("");

      return '<div class="edit-chapter"><h4><input class="input" style="min-height:40px" value="' + esc(ch.title) +
        '" oninput="Admin.editing.chapters[' + ci + '].title=this.value">' +
        '<button class="btn btn-sm btn-danger" onclick="Admin.removeChapter(' + ci + ')">删除章节</button></h4>' +
        lessons +
        '<button class="btn btn-sm btn-ghost" onclick="Admin.addLesson(' + ci + ')">新增课时</button>' +
        Admin.practiceEditorHtml(ci) +
        "</div>";
    }).join("");

    var content =
      '<div class="editor-block"><b style="font-size:15px">基础信息</b>' +
      '<div class="editor-row-2" style="margin-top:12px">' +
      '<div class="field"><label>所属模块</label><select class="input" onchange="Admin.editing.module=this.value">' +
      '<option value="vocal"' + (c.module === "vocal" ? " selected" : "") + ">声乐课</option>" +
      '<option value="live"' + (c.module === "live" ? " selected" : "") + ">开播运营</option></select></div>" +
      '<div class="field"><label>难度等级</label><select class="input" onchange="Admin.editing.level=this.value">' +
      ["入门", "进阶", "高级"].map(function (lv) {
        return '<option value="' + lv + '"' + (c.level === lv ? " selected" : "") + ">" + lv + "</option>";
      }).join("") + "</select></div></div>" +
      '<div class="editor-row-2">' +
      '<div class="field"><label>课程名称</label><input class="input" value="' + esc(c.title) + '" oninput="Admin.editing.title=this.value" placeholder="例如：零基础发声入门"></div>' +
      '<div class="field"><label>讲师</label><input class="input" value="' + esc(c.teacher) + '" oninput="Admin.editing.teacher=this.value"></div>' +
      "</div>" +
      '<div class="editor-row-2">' +
      '<div class="field"><label>封面符号</label><input class="input" value="' + esc(c.cover) + '" oninput="Admin.editing.cover=this.value"></div>' +
      '<div class="field"><label>总时长文本</label><input class="input" value="' + esc(c.duration) + '" oninput="Admin.editing.duration=this.value" placeholder="例如：约 3 小时"></div>' +
      "</div>" +
      '<div class="field"><label>课程简介</label><textarea class="input" oninput="Admin.editing.intro=this.value">' + esc(c.intro) + "</textarea></div>" +
      '<div class="field"><label>课程级默认 BV 号（课时未单独填写时兜底）</label><input class="input" value="' + esc(c.defaultBv || "") + '" oninput="Admin.editing.defaultBv=this.value"></div>' +
      "</div>" +
      '<div class="editor-block"><b style="font-size:15px;display:block;margin-bottom:12px">章节与课时</b>' + chapters +
      '<button class="btn btn-line" onclick="Admin.addChapter()">新增章节</button></div>' +
      Admin.quizEditorHtml() +
      '<div class="editor-actions"><button class="btn btn-primary" onclick="Admin.saveEditor()">保存课程</button>' +
      '<button class="btn btn-line" onclick="location.hash=\'#/admin/courses\'">取消</button></div>';

    app.innerHTML = Admin.shell(Admin.editId ? "courses" : "course-new", title, content);
  },

  addChapter: function () {
    Admin.editing.chapters.push({ title: "第 " + (Admin.editing.chapters.length + 1) + " 章", lessons: [] });
    Admin.drawEditor(document.getElementById("app"), Admin.editId ? "编辑课程" : "新建课程");
  },
  removeChapter: function (ci) {
    Admin.editing.chapters.splice(ci, 1);
    Admin.drawEditor(document.getElementById("app"), Admin.editId ? "编辑课程" : "新建课程");
  },
  addLesson: function (ci) {
    Admin.editing.chapters[ci].lessons.push({ title: "", duration: "10:00", free: false, bvid: "" });
    Admin.drawEditor(document.getElementById("app"), Admin.editId ? "编辑课程" : "新建课程");
  },
  removeLesson: function (ci, li) {
    Admin.editing.chapters[ci].lessons.splice(li, 1);
    Admin.drawEditor(document.getElementById("app"), Admin.editId ? "编辑课程" : "新建课程");
  },

  /* ---------- 考核题目编辑卡 ---------- */
  quizEditorHtml: function () {
    var each = Admin.quizDraft.length ? Math.round(100 / Admin.quizDraft.length * 10) / 10 : 0;
    var qs = Admin.quizDraft.map(function (item, qi) {
      var opts = item.options.map(function (op, oi) {
        return '<input class="q-opt" placeholder="选项 ' + (oi + 1) + '" value="' + esc(op) +
          '" oninput="Admin.setQuizOption(' + qi + "," + oi + ",this.value)";
      }).join("");
      var ansOpts = [0, 1, 2, 3].map(function (oi) {
        return '<option value="' + oi + '"' + (item.answer === oi ? " selected" : "") + ">正确项 " + (oi + 1) + "</option>";
      }).join("");

      return '<div class="quiz-edit-item"><div class="qei-head"><b>第 ' + (qi + 1) + " 题</b>" +
        '<select onchange="Admin.setQuizAnswer(' + qi + ",this.value)">" + ansOpts + "</select>" +
        '<button class="btn btn-sm btn-danger" onclick="Admin.removeQuizQ(' + qi + ')">删除</button></div>' +
        '<input class="input q-stem" placeholder="题干" value="' + esc(item.q) +
        '" oninput="Admin.setQuizField(' + qi + ",this.value)">" +
        '<div class="qei-opts">' + opts + "</div></div>";
    }).join("");

    return '<div class="editor-block"><b style="font-size:15px;display:block;margin-bottom:6px">考核题目（课后测验与章节考试共用）</b>' +
      '<p class="form-hint" style="margin-bottom:12px">当前 ' + Admin.quizDraft.length + " 题，满分 100，每题约 " +
      each + " 分，可自行增删题目。</p>" +
      '<div class="field" style="max-width:220px"><label>考核及格线（分）</label>' +
      '<input class="input" type="number" min="0" max="100" value="' + esc(Admin.quizMeta.passScore) +
      '" oninput="Admin.quizMeta.passScore=Number(this.value)||0"></div>' +
      qs + '<button class="btn btn-line" onclick="Admin.addQuizQ()">新增题目</button></div>';
  },

  setQuizField: function (qi, val) { Admin.quizDraft[qi].q = val; },
  setQuizOption: function (qi, oi, val) { Admin.quizDraft[qi].options[oi] = val; },
  setQuizAnswer: function (qi, val) { Admin.quizDraft[qi].answer = Number(val); },
  addQuizQ: function () {
    Admin.quizDraft.push({ q: "", options: ["", "", "", ""], answer: 0 });
    Admin.redraw();
  },
  removeQuizQ: function (qi) { Admin.quizDraft.splice(qi, 1); Admin.redraw(); },

  /* ---------- 章节实操编辑 ---------- */
  practiceEditorHtml: function (ci) {
    var ch = Admin.editing.chapters[ci];
    if (!ch.practice) {
      return '<div class="practice-box"><button class="btn btn-sm btn-ghost" onclick="Admin.initPractice(' +
        ci + ')">设置本章实操内容与评分</button></div>';
    }
    var p = ch.practice;
    var full = 0;
    p.tasks.forEach(function (t) { full += Number(t.score) || 0; });

    var tasks = p.tasks.map(function (t, ti) {
      return '<div class="ptask-row">' +
        '<input placeholder="实操任务标题" value="' + esc(t.title) + '" oninput="Admin.editing.chapters[' +
        ci + "].practice.tasks[" + ti + '].title=this.value">' +
        '<input placeholder="任务说明（可空）" value="' + esc(t.desc || "") + '" oninput="Admin.editing.chapters[' +
        ci + "].practice.tasks[" + ti + '].desc=this.value">' +
        '<input class="ptask-score" type="number" min="0" placeholder="分值" value="' + esc(t.score) +
        '" oninput="Admin.editing.chapters[' + ci + "].practice.tasks[" + ti + '].score=Number(this.value)||0">' +
        '<button class="btn btn-sm btn-danger" onclick="Admin.removePTask(' + ci + "," + ti + ')">移除</button></div>';
    }).join("");

    return '<div class="practice-box"><div class="pb-head"><b>本章实操评分</b>' +
      '<span class="tag tag-primary">满分 ' + full + " 分</span></div>" + tasks +
      '<button class="btn btn-sm btn-ghost" onclick="Admin.addPTask(' + ci + ')">新增实操任务</button>' +
      '<div class="field" style="max-width:220px;margin-top:10px"><label>实操及格线（分）</label>' +
      '<input class="input" type="number" min="0" value="' + esc(p.passScore) +
      '" oninput="Admin.editing.chapters[' + ci + '].practice.passScore=Number(this.value)||0"></div>' +
      '<button class="btn btn-sm btn-line" onclick="Admin.removePractice(' + ci + ')">移除实操配置</button></div>';
  },

  initPractice: function (ci) {
    Admin.editing.chapters[ci].practice = { tasks: [{ title: "", desc: "", score: 20 }], passScore: 60 };
    Admin.redraw();
  },
  removePractice: function (ci) {
    delete Admin.editing.chapters[ci].practice;
    Admin.redraw();
  },
  addPTask: function (ci) {
    Admin.editing.chapters[ci].practice.tasks.push({ title: "", desc: "", score: 20 });
    Admin.redraw();
  },
  removePTask: function (ci, ti) {
    Admin.editing.chapters[ci].practice.tasks.splice(ti, 1);
    Admin.redraw();
  },
  redraw: function () {
    Admin.drawEditor(document.getElementById("app"), Admin.editId ? "编辑课程" : "新建课程");
  },

  saveEditor: function () {
    var c = Admin.editing;
    if (!c.title || !c.title.trim()) { App.toast("请填写课程名称"); return; }
    var id = Admin.editId || "custom-" + Date.now();
    if (!Admin.editId) c.id = id;
    c.chapters.forEach(function (ch, ci) {
      ch.lessons.forEach(function (ls, li) {
        if (!ls.id) ls.id = id + "-c" + (ci + 1) + "l" + (li + 1);
      });
    });

    var layer = Store.getCourseLayer();
    if (Admin.editId) {
      var original = getCourseById(Admin.editId);
      if (original._builtin) {
        layer.overrides[Admin.editId] = JSON.parse(JSON.stringify(c));
      } else {
        layer.custom = layer.custom.map(function (x) { return x.id === Admin.editId ? c : x; });
      }
    } else {
      layer.custom.push(c);
    }
    layer.quiz[id] = Admin.quizDraft;
    layer.quizMeta[id] = Admin.quizMeta;
    Store.saveCourseLayer(layer);
    App.toast("课程已保存");
    location.hash = "#/admin/courses";
  },

  /* ---------- 推荐课程链接库 ---------- */
  RECOMMEND: [
    { module: "vocal", bv: "BV1GShP65ENV", desc: "2026 唱歌入门 108 集" },
    { module: "vocal", bv: "BV1cw9LB1EP9", desc: "唱歌用气有妙招（气息训练）" },
    { module: "vocal", bv: "BV1rNFpzEEDq", desc: "科学开嗓五步" },
    { module: "live", bv: "BV1hAvYBAEyF", desc: "新主播直播冷启动打法" },
    { module: "live", bv: "BV18VndzCEhC", desc: "直播间没人怎么办" },
    { module: "live", bv: "BV1CZEWziE3k", desc: "新人主播避雷指南" },
    { module: "live", bv: "BV1ZhEc61E5z", desc: "直播间留人话术" }
  ],

  fmtSize: function (bytes) {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
    if (bytes >= 1024) return Math.round(bytes / 1024) + " KB";
    return bytes + " B";
  },

  parseBv: function (text) {
    var m = String(text || "").match(/BV[0-9A-Za-z]{10}/);
    return m ? m[0] : null;
  },

  /* 粘贴完整 B 站链接时自动提取 BV 号 */
  onLinkInput: function (ci, li, el) {
    var bv = Admin.parseBv(el.value);
    if (bv && bv !== Admin.editing.chapters[ci].lessons[li].bvid) {
      Admin.editing.chapters[ci].lessons[li].bvid = bv;
      el.value = bv;
      App.toast("已识别 BV 号：" + bv);
    } else if (!bv) {
      Admin.editing.chapters[ci].lessons[li].bvid = el.value;
    }
  },

  openRecommend: function (ci, li) {
    var items = Admin.RECOMMEND.filter(function (r) { return r.module === Admin.editing.module; });
    var html =
      '<div class="modal-mask" id="recMask"><div class="modal"><h3>推荐课程链接</h3>' +
      items.map(function (r) {
        return '<button class="rec-item" onclick="Admin.applyRecommend(\'' + r.bv + "'," + ci + "," + li + ')">' +
          "<b>" + esc(r.bv) + '</b><span>' + esc(r.desc) + "</span></button>";
      }).join("") +
      '<div class="modal-actions"><button class="btn btn-line" onclick="Admin.closeModal()">取消</button></div></div></div>';
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstChild);
  },

  closeModal: function () {
    var m = document.getElementById("recMask");
    if (m) m.remove();
  },

  applyRecommend: function (bv, ci, li) {
    Admin.editing.chapters[ci].lessons[li].bvid = bv;
    Admin.closeModal();
    Admin.drawEditor(document.getElementById("app"), Admin.editId ? "编辑课程" : "新建课程");
  },

  /* ---------- 本地视频上传 ---------- */
  onVideoPick: function (event, ci, li) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.type.indexOf("video/") !== 0) { App.toast("请选择视频文件"); return; }
    App.toast("视频上传中，请勿关闭页面");
    VideoDB.put(file).then(function (meta) {
      var ls = Admin.editing.chapters[ci].lessons[li];
      ls.videoId = meta.id;
      ls.videoName = meta.name;
      ls.videoSize = meta.size;
      App.toast("视频已上传：" + meta.name);
      Admin.drawEditor(document.getElementById("app"), Admin.editId ? "编辑课程" : "新建课程");
    }).catch(function () { App.toast("视频上传失败，请重试"); });
  },

  removeVideo: function (ci, li) {
    var ls = Admin.editing.chapters[ci].lessons[li];
    var vid = ls.videoId;
    VideoDB.remove(vid).then(function () {
      ls.videoId = "";
      ls.videoName = "";
      ls.videoSize = 0;
      Admin.drawEditor(document.getElementById("app"), "编辑课程");
    }).catch(function () { App.toast("移除失败，请重试"); });
  },

  /* ---------- 用户管理 ---------- */
  renderUsers: function (app) {
    var rows = Store.getUsers().map(function (u) {
      var d = new Date(u.createdAt);
      var when = d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
      return "<tr><td><b>" + esc(u.username) + "</b></td><td>" + esc(u.nickname) + "</td><td>" + when + "</td>" +
        '<td><input class="input inline-pw" id="pw-' + esc(u.username) + '" placeholder="新密码(≥6位)"></td>' +
        '<td><div class="row-actions">' +
        '<button class="btn btn-sm btn-line" onclick="Admin.changeUserPw(\'' + esc(u.username) + '\')">改密</button>' +
        '<button class="btn btn-sm btn-ghost" onclick="Admin.resetUserPw(\'' + esc(u.username) + '\')">重置</button>' +
        "</div></td></tr>";
    }).join("");

    var content = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
      "<th>用户名</th><th>昵称</th><th>注册时间</th><th>设置新密码</th><th>操作</th></tr></thead>" +
      "<tbody>" + (rows || '<tr><td colspan="5" style="text-align:center;color:var(--text-3)">暂无注册用户</td></tr>') +
      "</tbody></table></div>" +
      '<p class="form-hint" style="margin-top:10px">“重置”会把密码一键恢复为 123456；自定义改密需至少 6 位。</p>';

    app.innerHTML = Admin.shell("users", "用户管理", content);
  },

  writeUser: function (username, password) {
    var users = Store.getUsers().map(function (u) {
      if (u.username === username) u.password = password;
      return u;
    });
    Store.saveUsers(users);
  },

  changeUserPw: function (username) {
    var el = document.getElementById("pw-" + username);
    var pw = el.value;
    if (!pw || pw.length < 6) { App.toast("新密码至少需要 6 位"); return; }
    Admin.writeUser(username, pw);
    el.value = "";
    App.toast("用户密码已修改");
  },

  resetUserPw: function (username) {
    Admin.writeUser(username, "123456");
    App.toast("密码已重置为 123456");
  },

  /* ---------- 管理员账号 ---------- */
  renderAdmins: function (app) {
    var list = Store.getAdmins().map(function (a) {
      var d = new Date(a.createdAt);
      return "<tr><td><b>" + esc(a.username) + "</b></td><td>" +
        d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + "</td></tr>";
    }).join("");

    var content =
      '<div class="admin-table-wrap" style="margin-bottom:18px"><table class="admin-table"><thead><tr>' +
      "<th>管理员账号</th><th>创建时间</th></tr></thead><tbody>" + list + "</tbody></table></div>" +
      '<div class="editor-block"><b style="font-size:15px;display:block;margin-bottom:12px">新增管理员</b>' +
      '<div class="editor-row-2"><div class="field" style="margin:0"><label>账号</label><input class="input" id="newAdmName" placeholder="管理员账号"></div>' +
      '<div class="field" style="margin:0"><label>密码（≥6 位）</label><input class="input" id="newAdmPwd" type="password" placeholder="登录密码"></div></div>' +
      '<button class="btn btn-primary" onclick="Admin.doAddAdmin()">新增管理员</button></div>';

    app.innerHTML = Admin.shell("admins", "管理员账号", content);
  },

  doAddAdmin: function () {
    var name = document.getElementById("newAdmName").value;
    var pw = document.getElementById("newAdmPwd").value;
    var res = Auth.addAdmin(name, pw);
    if (!res.ok) { App.toast(res.error); return; }
    App.toast("管理员已新增");
    Admin.renderAdmins(document.getElementById("app"));
  },

  /* ---------- 评分标准 ---------- */
  renderScoreRules: function (app) {
    var rules = Store.getScoreRules();
    var rows = rules.map(function (r, i) {
      return '<div class="rule-row"><div class="rule-label">' + esc(r.label) + "</div>" +
        '<input class="input" type="number" min="0" id="rule-w-' + i + '" value="' + r.weight + '" title="权重">' +
        '<input class="input" type="number" min="0" id="rule-m-' + i + '" value="' + r.max + '" title="满分"></div>';
    }).join("");

    var content =
      '<div class="editor-block"><b style="font-size:15px;display:block;margin-bottom:6px">直播数据六维权重与满分</b>' +
      rows +
      '<button class="btn btn-primary" style="margin-top:14px" onclick="Admin.saveRules()">保存配置</button> ' +
      '<button class="btn btn-line" onclick="Admin.generateStandard()">生成综合评分标准</button></div>' +
      Admin.assessmentOverviewHtml() +
      '<div id="standardBox"></div>';

    app.innerHTML = Admin.shell("score-rules", "评分标准", content);
  },

  assessmentOverviewHtml: function () {
    var body = getAllCourses().map(function (c) {
      var qs = getQuizQuestions(c.id);
      var qm = getQuizMeta(c.id);
      var each = qs.length ? Math.round(100 / qs.length * 10) / 10 : 0;
      var practice = c.chapters.map(function (ch, ci) {
        if (!ch.practice) return '<span class="tag">第' + (ci + 1) + "章未配置</span>";
        var full = 0;
        ch.practice.tasks.forEach(function (t) { full += Number(t.score) || 0; });
        return '<span class="tag tag-primary">第' + (ci + 1) + "章实操 " + full + " 分 / 及格 " +
          ch.practice.passScore + "</span>";
      }).join(" ");

      return "<tr><td><span class=\"tag\">" + (c.module === "vocal" ? "声乐" : "开播") + "</span></td>" +
        "<td><b>" + esc(c.title) + "</b></td>" +
        "<td>" + qs.length + " 题 · 每题 " + each + " 分 · 及格 " + qm.passScore + "</td>" +
        "<td>" + practice + "</td></tr>";
    }).join("");

    return '<div class="section-title">考核与实操评分标准总览</div>' +
      '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
      "<th>模块</th><th>课程</th><th>考核题目</th><th>章节实操</th></tr></thead>" +
      "<tbody>" + body + "</tbody></table></div>";
  },

  saveRules: function () {
    var rules = Store.getScoreRules();
    var totalW = 0;
    rules.forEach(function (r, i) {
      r.weight = Number(document.getElementById("rule-w-" + i).value) || 0;
      r.max = Number(document.getElementById("rule-m-" + i).value) || 0;
      totalW += r.weight;
    });
    Store.saveScoreRules(rules);
    App.toast("评分规则已保存（权重合计 " + totalW + "%）");
  },

  generateStandard: function () {
    var rules = Store.getScoreRules();
    var now = new Date();
    var ts = now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate()) + " " +
      pad2(now.getHours()) + ":" + pad2(now.getMinutes());

    var dimTable = rules.map(function (r) {
      return "· " + r.label + "：权重 " + r.weight + "%，满分基准 " + r.max;
    }).join("\n");

    var courseLines = getAllCourses().map(function (c) {
      var qs = getQuizQuestions(c.id);
      var qm = getQuizMeta(c.id);
      var each = qs.length ? Math.round(100 / qs.length * 10) / 10 : 0;
      var line = "· [" + (c.module === "vocal" ? "声乐" : "开播") + "] " + c.title + "：" +
        qs.length + " 题，每题约 " + each + " 分，考核及格线 " + qm.passScore + " 分";
      c.chapters.forEach(function (ch, ci) {
        if (ch.practice) {
          var full = 0;
          ch.practice.tasks.forEach(function (t) { full += Number(t.score) || 0; });
          line += "\n    第 " + (ci + 1) + " 章实操：满分 " + full + " 分，及格线 " +
            ch.practice.passScore + " 分，共 " + ch.practice.tasks.length + " 项任务";
        }
      });
      return line;
    }).join("\n");

    var text =
      "声播学院综合评分标准（系统自动生成）\n生成时间：" + ts + "\n\n" +
      "一、直播数据复盘评分（六维加权）\n" + dimTable + "\n" +
      "计分公式：维度得分 = min(实际值 ÷ 满分基准, 1) × 权重；综合分 = 各维度得分之和，四舍五入。\n" +
      "等级映射：S 优秀 ≥85，A 良好 70-84，B 合格 55-69，C 待提升 40-54，D 需复盘 <40。\n\n" +
      "二、课程考核题目标准（满分 100）\n" + courseLines + "\n\n" +
      "三、实操评分标准\n实操按各任务分值累计，达到该章及格线即判定达标；任务与分值在课程编辑器中维护。\n\n" +
      "四、维护说明\n管理员调整题目、实操、分值或六维权重后立即生效；本标准可复制存档，近一周复盘按周日均数据计算并附每日趋势。";

    var box = document.getElementById("standardBox");
    box.innerHTML = '<div class="editor-block" style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:center">' +
      '<b style="font-size:15px">综合评分标准文档</b>' +
      '<button class="btn btn-sm btn-line" onclick="Admin.copyStandard()">复制标准</button></div>' +
      '<pre class="standard-doc" id="standardText" style="margin-top:10px">' + esc(text) + "</pre></div>";
    Admin.standardText = text;
    App.toast("综合评分标准已生成");
  },

  copyStandard: function () {
    var text = Admin.standardText || "";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { App.toast("评分标准已复制"); });
    } else {
      App.toast("当前浏览器不支持自动复制，请手动选择文本");
    }
  },

  /* ---------- 会员管理占位 ---------- */
  renderMembership: function (app) {
    var content =
      '<div class="editor-block" style="text-align:center;padding:60px 20px">' +
      '<div class="dev-icon" style="margin:0 auto 18px">' + ICON.crown + "</div>" +
      "<h3 style=\"font-family:var(--font-display);font-size:20px;margin-bottom:8px\">会员功能开发中</h3>" +
      '<p style="color:var(--text-2);font-size:13px;max-width:380px;margin:0 auto">会员等级、开通续期、权益校验与支付能力将在后续版本上线，当前页面仅作占位。</p></div>';
    app.innerHTML = Admin.shell("membership", "会员管理", content);
  }
});
