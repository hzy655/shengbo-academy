/* ============================================================
   app.js — 用户端：登录注册、首页、模块、课程详情、我的、账号设置
   ============================================================ */

var APP_ICONS = {
  logo: '<svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  home: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>',
  heart: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  user: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  gear: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  chart: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 4 3 5-7"/></svg>',
  out: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>'
};

var App = {
  toastTimer: null,
  toast: function (msg) {
    var t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    if (App.toastTimer) clearTimeout(App.toastTimer);
    App.toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  },

  /* ============================================================
     登录 / 注册
     ============================================================ */
  renderLogin: function (app) {
    app.innerHTML =
      '<div class="auth-wrap"><div class="auth-brand"><div class="auth-logo">' + APP_ICONS.logo + "</div>" +
      "<h1>声播学院</h1><p>声乐提升 · 开播运营一站式学习</p></div>" +
      '<div class="auth-card"><div class="field"><label>用户名</label>' +
      '<input class="input" id="loginName" autocomplete="username" placeholder="请输入用户名"></div>' +
      '<div class="field"><label>密码</label>' +
      '<input class="input" id="loginPwd" type="password" autocomplete="current-password" placeholder="请输入密码" onkeydown="if(event.key===\'Enter\')App.doLogin()"></div>' +
      '<div id="loginError" class="form-error"></div>' +
      '<button class="btn btn-primary btn-block" onclick="App.doLogin()">登录</button></div>' +
      '<div class="auth-foot"><a href="#/register">注册新账号</a><a href="#/admin/login">管理员入口</a></div></div>';
  },

  doLogin: function () {
    var name = document.getElementById("loginName").value;
    var pwd = document.getElementById("loginPwd").value;
    var res = Auth.login(name, pwd);
    if (!res.ok) { document.getElementById("loginError").textContent = res.error; return; }
    location.hash = "#/home";
  },

  renderRegister: function (app) {
    app.innerHTML =
      '<div class="auth-wrap"><div class="auth-brand"><div class="auth-logo">' + APP_ICONS.logo + "</div>" +
      "<h1>注册账号</h1><p>开启你的声播学习之旅</p></div>" +
      '<div class="auth-card"><div class="field"><label>用户名（4-20 位字母或数字）</label>' +
      '<input class="input" id="regName" autocomplete="username" placeholder="设置登录用户名"></div>' +
      '<div class="field"><label>昵称（1-20 字）</label>' +
      '<input class="input" id="regNick" placeholder="大家怎么称呼你"></div>' +
      '<div class="field"><label>密码（至少 6 位）</label>' +
      '<input class="input" id="regPwd" type="password" autocomplete="new-password" placeholder="设置登录密码"></div>' +
      '<div class="field"><label>确认密码</label>' +
      '<input class="input" id="regPwd2" type="password" autocomplete="new-password" placeholder="再次输入密码"></div>' +
      '<div id="regError" class="form-error"></div>' +
      '<button class="btn btn-primary btn-block" onclick="App.doRegister()">注册并登录</button></div>' +
      '<div class="auth-foot"><a href="#/login">已有账号，去登录</a></div></div>';
  },

  doRegister: function () {
    var name = document.getElementById("regName").value;
    var nick = document.getElementById("regNick").value;
    var pwd = document.getElementById("regPwd").value;
    var pwd2 = document.getElementById("regPwd2").value;
    if (pwd !== pwd2) { document.getElementById("regError").textContent = "两次输入的密码不一致"; return; }
    var res = Auth.register(name, pwd, nick);
    if (!res.ok) { document.getElementById("regError").textContent = res.error; return; }
    location.hash = "#/home";
  },

  /* ============================================================
     首页
     ============================================================ */
  renderHome: function (app) {
    var user = Auth.currentUser();
    var profile = Store.getProfile();
    var nick = profile.nickname || user.nickname || user.username;
    var reminder = Store.getReminder();

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<header class="home-head"><div><div class="hh-hi">你好，' + esc(nick) + '</div>' +
      '<h1>今天想练点什么？</h1></div><div class="hh-avatar">' + esc(profile.avatar || "🧑‍🎤") + "</div></header>" +

      '<div class="banner">' +
      '<div class="banner-text"><b>声播学院学习体系</b><p>声乐 6 门 + 开播 6 门，课时测验、章节考试、实操评分全流程</p>' +
      '<button class="btn btn-sm btn-light" onclick="location.hash=\'#/checkin\'">去学习打卡</button></div>' +
      '<div class="banner-art">🎙️</div></div>' +

      '<div class="module-grid"><div class="module-card vocal" onclick="location.hash=\'#/vocal\'">' +
      '<div class="mc-ico">🎤</div><b>声乐课</b><span>发声 · 气息 · 共鸣 · 演唱</span></div>' +
      '<div class="module-card live" onclick="location.hash=\'#/live\'">' +
      '<div class="mc-ico">📡</div><b>开播运营</b><span>准备 · 话术 · 流量 · 变现</span></div></div>' +

      '<div class="section-title">学习提醒</div>' +
      '<div class="card reminder-card"><div class="reminder-icon">' + APP_ICONS.bell + "</div>" +
      '<div class="reminder-main"><b>每日学习提醒</b><span>' + (reminder.enabled ? "每天 " + reminder.time + " 提醒你学习" : "尚未开启提醒") +
      '</span></div><label class="switch"><input type="checkbox" ' + (reminder.enabled ? "checked" : "") +
      ' onchange="App.toggleReminder(this)"><span class="slider"></span></label></div>' +

      '<div class="section-title">推荐课程</div>' +
      App.recommendHtml() +
      "</div>" + App.tabbar("home") + "</div>";
  },

  recommendHtml: function () {
    var picks = getAllCourses().slice(0, 4);
    return '<div class="course-grid">' + picks.map(App.courseCard).join("") + "</div>";
  },

  courseCard: function (c) {
    var fav = Store.isFavorite(c.id);
    var progress = Store.getProgress(c.id);
    var total = countLessons(c);
    var pct = total ? Math.round(progress.completedLessons.length / total * 100) : 0;
    return '<div class="course-card" onclick="location.hash=\'#/' + (c.module === "vocal" ? "vocal" : "live") + "/" + c.id + '\'">' +
      '<div class="cc-cover" style="background:' + c.gradient + '"><span class="cc-emoji">' + esc(c.cover) + '</span>' +
      '<button class="cc-fav ' + (fav ? "on" : "") + '" onclick="event.stopPropagation();App.doFav(\'' + c.id + '\')">' +
      (fav ? "♥" : "♡") + "</button></div>" +
      '<div class="cc-body"><b>' + esc(c.title) + "</b><span>" + esc(c.teacher) + " · " + esc(c.level) + "</span>" +
      '<div class="cc-progress"><i style="width:' + pct + '%"></i></div><span class="cc-pct">' + pct + "%</span></div></div>";
  },

  doFav: function (id) {
    var on = Store.toggleFavorite(id);
    App.toast(on ? "已加入收藏" : "已取消收藏");
    Router.dispatch();
  },

  toggleReminder: function (el) {
    var r = Store.getReminder();
    r.enabled = el.checked;
    Store.setReminder(r);
    App.toast(r.enabled ? "学习提醒已开启" : "学习提醒已关闭");
  },

  /* ============================================================
     模块列表 / 课程详情
     ============================================================ */
  renderModule: function (app, module, courseId) {
    if (courseId) { App.renderCourseDetail(app, module, courseId); return; }
    var list = getAllCourses().filter(function (c) { return c.module === module; });
    var title = module === "vocal" ? "声乐课" : "开播运营课";

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="nav-bar"><button class="back-btn" onclick="location.hash=\'#/home\'">' + APP_ICONS.back + '</button><b>' + title + "</b></div>" +
      '<div class="course-grid">' + list.map(App.courseCard).join("") + "</div></div>" +
      App.tabbar("home") + "</div>";
  },

  renderCourseDetail: function (app, module, courseId) {
    var c = getCourseById(courseId);
    if (!c) { location.hash = "#/home"; return; }
    var total = countLessons(c);
    var progress = Store.getProgress(courseId);
    var doneCount = progress.completedLessons.length;
    var pct = total ? Math.round(doneCount / total * 100) : 0;
    var qm = getQuizMeta(courseId);

    var chapters = c.chapters.map(function (ch, ci) {
      var rec = Store.getChapterRecord(courseId, ci);
      var lessons = ch.lessons.map(function (ls) {
        var done = Store.isLessonDone(courseId, ls.id);
        var lock = ls.free ? "免费" : "会员";
        return '<button class="lesson-row" onclick="location.hash=\'#/play/' + module + "/" + courseId + "/" + ls.id + '\'">' +
          '<span class="lr-dot ' + (done ? "done" : "") + '">' + (done ? "✓" : "") + "</span>" +
          '<span class="lr-main"><b>' + esc(ls.title) + '</b><span>' + esc(ls.duration) + ' · ' +
          (ls.videoId ? "本地视频" : ls.bvid ? "B 站课程" : "待上架") + "</span></span>" +
          '<span class="lr-tag ' + (ls.free ? "free" : "vip") + '">' + lock + "</span></button>";
      }).join("");

      var examTag = rec.done ? '<span class="tag tag-success">已完成考试 ' + rec.examScore + " 分</span>" :
        '<span class="tag tag-warning">待考试</span>';

      return '<div class="chapter-card"><div class="chapter-head"><b>' + esc(ch.title) + "</b>" + examTag + "</div>" +
        lessons +
        '<div class="chapter-actions">' +
        '<button class="btn btn-sm btn-line" onclick="location.hash=\'#/quiz/' + courseId + "/chapter/" + ci + '\'">章节考试</button>' +
        '<button class="btn btn-sm btn-ghost" onclick="location.hash=\'#/tasks/' + courseId + "/" + ci + '\'">章节实操</button>' +
        "</div></div>";
    }).join("");

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + APP_ICONS.back + '</button><b>课程详情</b></div>' +

      '<div class="detail-hero" style="background:' + c.gradient + '"><div class="dh-emoji">' + esc(c.cover) + "</div>" +
      '<div class="dh-info"><b>' + esc(c.title) + '</b><span>' + esc(c.teacher) + ' · ' + esc(c.level) + ' · ' +
      esc(c.duration) + '</span></div></div>' +

      '<div class="card"><div class="detail-progress"><b>学习进度</b><span>' + doneCount + " / " + total + " 课时 · " + pct + "%</span></div>" +
      '<div class="cc-progress" style="margin-top:8px"><i style="width:' + pct + '%"></i></div>' +
      '<p style="font-size:13px;color:var(--text-2);margin:12px 0 0">' + esc(c.intro) + "</p></div>" +

      '<div class="section-title">章节与考核</div>' + chapters +

      '<div class="card"><b style="font-size:14px">考核说明</b><p style="font-size:12px;color:var(--text-2);margin:6px 0 0">' +
      "每节课含 " + getQuizQuestions(courseId).length + " 道选择题，章节考试及格线 " + qm.passScore + " 分；实操按任务分值累计，达标后记录章节成绩。</p></div>" +
      "</div></div>";
  },

  /* ============================================================
     收藏
     ============================================================ */
  renderFavorites: function (app) {
    var fav = Store.getFavorites();
    var ids = Object.keys(fav);
    var list = getAllCourses().filter(function (c) { return ids.indexOf(c.id) !== -1; });

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + APP_ICONS.back + '</button><b>我的收藏</b></div>' +
      (list.length ? '<div class="course-grid">' + list.map(App.courseCard).join("") + "</div>" :
        '<div class="card empty-card"><div class="empty-ico">💛</div><p>还没有收藏课程，去首页挑一门吧</p></div>') +
      "</div>" + App.tabbar("favorites") + "</div>";
  },

  /* ============================================================
     学习打卡
     ============================================================ */
  renderCheckin: function (app) {
    var checked = Store.hasCheckedToday();
    var days = Store.continuousDays();
    var total = Store.getCheckins().length;

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + APP_ICONS.back + '</button><b>学习打卡</b></div>' +
      '<div class="card checkin-card"><div class="ci-calendar">' + (checked ? "✅" : "📅") + "</div>" +
      "<h3>" + (checked ? "今日已打卡" : "今天还没打卡") + "</h3>" +
      '<p>连续学习 ' + days + ' 天 · 累计打卡 ' + total + " 天</p>" +
      (checked ? '<button class="btn btn-line" disabled>今日已完成</button>' :
        '<button class="btn btn-primary" onclick="App.doCheckin()">立即打卡</button>') + "</div>" +

      '<div class="section-title">近 7 天打卡</div><div class="card">' + App.weekCheckHtml() + "</div></div></div>";
  },

  weekCheckHtml: function () {
    var set = {};
    Store.getCheckins().forEach(function (d) { set[d] = true; });
    var cells = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var s = dateStr(d);
      cells.push('<div class="week-cell ' + (set[s] ? "on" : "") + '"><b>' + s.slice(5) + "</b><span>" +
        (set[s] ? "已打卡" : "未打卡") + "</span></div>");
    }
    return '<div class="week-grid">' + cells.join("") + "</div>";
  },

  doCheckin: function () {
    var n = Store.checkin();
    App.toast("打卡成功，已连续学习 " + n + " 天");
    Router.dispatch();
  },

  /* ============================================================
     我的
     ============================================================ */
  renderMine: function (app) {
    var user = Auth.currentUser();
    var profile = Store.getProfile();
    var totalSec = Store.totalStudySeconds();
    var favCount = Object.keys(Store.getFavorites()).length;

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="mine-hero"><div class="mh-avatar">' + esc(profile.avatar || "🧑‍🎤") + "</div>" +
      '<b>' + esc(profile.nickname || user.nickname) + "</b><span>账号 " + esc(user.username) + "</span></div>" +

      '<div class="mine-stats"><div><b>' + favCount + '</b><span>收藏课程</span></div>' +
      '<div><b>' + Store.continuousDays() + '</b><span>连续打卡</span></div>' +
      '<div><b>' + fmtDuration(totalSec) + '</b><span>累计学习</span></div></div>' +

      '<div class="card mine-menu">' +
      App.mineRow("settings", APP_ICONS.gear, "账号设置", "#/settings") +
      App.mineRow("checkin", APP_ICONS.bell, "学习打卡", "#/checkin") +
      App.mineRow("time", APP_ICONS.clock, "学习时长与进度", "#/home") +
      App.mineRow("report", APP_ICONS.chart, "直播复盘", "#/live-report") +
      App.mineRow("vip", APP_ICONS.bell, "会员中心（开发中）", "#/mine") +
      App.mineRow("out", APP_ICONS.out, "退出登录", "logout") +
      "</div></div>" + App.tabbar("mine") + "</div>";
  },

  mineRow: function (key, icon, label, target) {
    var onclick = target === "logout" ? "App.doLogout()" : "location.hash=\'" + target + "\'";
    return '<button class="mine-row" onclick="' + onclick + '">' + icon + "<span>" + esc(label) +
      '</span><i class="mr-arrow">›</i></button>';
  },

  doLogout: function () {
    Auth.logout();
    location.hash = "#/login";
  },

  /* ============================================================
     账号设置
     ============================================================ */
  AVATARS: ["🧑‍🎤", "👩‍🎤", "🎤", "🎧", "🎙️", "🎵", "🌟", "🔥", "🐱", "🐰", "🦊", "🐼"],

  renderSettings: function (app) {
    var user = Auth.currentUser();
    var profile = Store.getProfile();
    var reg = new Date(user.createdAt);
    var regText = reg.getFullYear() + "-" + pad2(reg.getMonth() + 1) + "-" + pad2(reg.getDate());

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + APP_ICONS.back + '</button><b>账号设置</b></div>' +

      '<div class="card"><b style="font-size:15px">账号信息</b>' +
      '<div class="settings-info"><span>用户名</span><b>' + esc(user.username) + "</b></div>" +
      '<div class="settings-info"><span>注册时间</span><b>' + regText + "</b></div></div>" +

      '<div class="card"><b style="font-size:15px">修改昵称</b>' +
      '<div class="el-row" style="margin-top:10px">' +
      '<input class="input" id="setNick" maxlength="20" value="' + esc(profile.nickname || user.nickname) + '" placeholder="输入新昵称">' +
      '<button class="btn btn-primary" onclick="App.saveNick()">保存</button></div></div>' +

      '<div class="card"><b style="font-size:15px">选择头像</b>' +
      '<div class="avatar-grid" style="margin-top:12px">' +
      App.AVATARS.map(function (a) {
        return '<button class="avatar-item ' + (profile.avatar === a ? "on" : "") + '" onclick="App.pickAvatar(\'' + a + '\')">' + a + "</button>";
      }).join("") + "</div></div>" +

      '<div class="card"><b style="font-size:15px">修改密码</b>' +
      '<div class="field" style="margin-top:10px"><label>当前密码</label><input class="input" id="oldPwd" type="password" autocomplete="current-password"></div>' +
      '<div class="field"><label>新密码（至少 6 位）</label><input class="input" id="newPwd" type="password" autocomplete="new-password"></div>' +
      '<div class="field"><label>确认新密码</label><input class="input" id="newPwd2" type="password" autocomplete="new-password"></div>' +
      '<div id="setError" class="form-error"></div>' +
      '<button class="btn btn-primary btn-block" onclick="App.savePassword()">确认修改</button></div>' +

      '<button class="btn btn-danger btn-block" style="margin:4px 0 20px" onclick="App.doLogout()">退出登录</button>' +
      "</div></div>";
  },

  saveNick: function () {
    var val = document.getElementById("setNick").value.trim();
    if (!val || val.length > 20) { App.toast("昵称需为 1 到 20 个字"); return; }
    var profile = Store.getProfile();
    profile.nickname = val;
    Store.setProfile(profile);

    var users = Store.getUsers().map(function (u) {
      if (u.username === Auth.currentUser().username) u.nickname = val;
      return u;
    });
    Store.saveUsers(users);
    App.toast("昵称已保存");
    Router.dispatch();
  },

  pickAvatar: function (a) {
    var profile = Store.getProfile();
    profile.avatar = a;
    Store.setProfile(profile);
    App.toast("头像已更新");
    Router.dispatch();
  },

  savePassword: function () {
    var oldP = document.getElementById("oldPwd").value;
    var newP = document.getElementById("newPwd").value;
    var newP2 = document.getElementById("newPwd2").value;
    var user = Auth.currentUser();

    if (user.password !== oldP) { App.showSetError("当前密码不正确"); return; }
    if (!newP || newP.length < 6) { App.showSetError("新密码至少需要 6 位"); return; }
    if (newP !== newP2) { App.showSetError("两次输入的新密码不一致"); return; }
    if (newP === oldP) { App.showSetError("新密码不能与当前密码相同"); return; }

    var users = Store.getUsers().map(function (u) {
      if (u.username === user.username) u.password = newP;
      return u;
    });
    Store.saveUsers(users);
    App.toast("密码已修改，请重新登录");
    Auth.logout();
    location.hash = "#/login";
  },

  showSetError: function (msg) {
    var el = document.getElementById("setError");
    el.textContent = msg;
  },

  /* ============================================================
     底部导航
     ============================================================ */
  tabbar: function (active) {
    function item(key, hash, icon, label) {
      return '<button class="tab-item ' + (active === key ? "active" : "") + '" onclick="location.hash=\'#/' + hash + '\'">' +
        icon + "<span>" + label + "</span></button>";
    }
    return '<nav class="tabbar">' +
      item("home", "home", APP_ICONS.home, "首页") +
      item("favorites", "favorites", APP_ICONS.heart, "收藏") +
      item("mine", "mine", APP_ICONS.user, "我的") +
      "</nav>";
  }
};
