/* ============================================================
   store.js — localStorage 统一封装（15 个键）
   原型阶段全部数据本地存储，明文密码仅用于演示
   ============================================================ */

var KEYS = {
  users: "sv_users",
  current: "sv_current",
  favorites: "sv_favorites",
  progress: "sv_progress",
  profile: "sv_profile",
  admin: "sv_admin",
  admins: "sv_admins",
  courses: "sv_courses",
  checkins: "sv_checkins",
  studyTime: "sv_study_time",
  reminder: "sv_reminder",
  quiz: "sv_quiz",
  chapter: "sv_chapter",
  liveReports: "sv_live_reports",
  scoreRules: "sv_score_rules"
};

function pad2(n) { return n < 10 ? "0" + n : "" + n; }

function dateStr(d) {
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

var Store = {
  /* ---------- 基础读写 ---------- */
  get: function (key, fallback) {
    var raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    try { return JSON.parse(raw); }
    catch (e) { return fallback; }
  },
  set: function (key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  remove: function (key) { localStorage.removeItem(key); },

  /* ---------- 用户 ---------- */
  getUsers: function () { return Store.get(KEYS.users, []); },
  saveUsers: function (users) { Store.set(KEYS.users, users); },
  findUser: function (username) {
    var found = null;
    Store.getUsers().forEach(function (u) { if (u.username === username) found = u; });
    return found;
  },
  getCurrent: function () { return Store.get(KEYS.current, ""); },
  setCurrent: function (name) { Store.set(KEYS.current, name); },
  clearCurrent: function () { Store.remove(KEYS.current); },

  /* ---------- 收藏 ---------- */
  getFavorites: function () { return Store.get(KEYS.favorites, {}); },
  setFavorites: function (obj) { Store.set(KEYS.favorites, obj); },
  isFavorite: function (courseId) { return !!Store.getFavorites()[courseId]; },
  toggleFavorite: function (courseId) {
    var fav = Store.getFavorites();
    if (fav[courseId]) delete fav[courseId]; else fav[courseId] = true;
    Store.setFavorites(fav);
    return !!fav[courseId];
  },

  /* ---------- 学习进度 ---------- */
  getProgressAll: function () { return Store.get(KEYS.progress, {}); },
  getProgress: function (courseId) {
    return Store.getProgressAll()[courseId] || { completedLessons: [], lastLesson: "", updatedAt: 0 };
  },
  markLesson: function (courseId, lessonId) {
    var all = Store.getProgressAll();
    var p = all[courseId] || { completedLessons: [], lastLesson: "", updatedAt: 0 };
    if (p.completedLessons.indexOf(lessonId) === -1) p.completedLessons.push(lessonId);
    p.lastLesson = lessonId;
    p.updatedAt = Date.now();
    all[courseId] = p;
    Store.set(KEYS.progress, all);
  },
  isLessonDone: function (courseId, lessonId) {
    return Store.getProgress(courseId).completedLessons.indexOf(lessonId) !== -1;
  },

  /* ---------- 个人资料 ---------- */
  getProfile: function () { return Store.get(KEYS.profile, { nickname: "", avatar: "🧑‍🎤" }); },
  setProfile: function (obj) { Store.set(KEYS.profile, obj); },

  /* ---------- 管理员 ---------- */
  getAdmin: function () { return Store.get(KEYS.admin, ""); },
  setAdmin: function (name) { Store.set(KEYS.admin, name); },
  clearAdmin: function () { Store.remove(KEYS.admin); },
  getAdmins: function () { return Store.get(KEYS.admins, []); },
  saveAdmins: function (list) { Store.set(KEYS.admins, list); },
  findAdmin: function (username) {
    var found = null;
    Store.getAdmins().forEach(function (a) { if (a.username === username) found = a; });
    return found;
  },

  /* ---------- 课程覆盖层 ---------- */
  getCourseLayer: function () {
    var layer = Store.get(KEYS.courses, { offline: {}, overrides: {}, custom: [], quiz: {}, quizMeta: {} });
    layer.offline = layer.offline || {};
    layer.overrides = layer.overrides || {};
    layer.custom = layer.custom || [];
    layer.quiz = layer.quiz || {};
    layer.quizMeta = layer.quizMeta || {};
    return layer;
  },
  saveCourseLayer: function (layer) { Store.set(KEYS.courses, layer); },

  /* ---------- 打卡 ---------- */
  getCheckins: function () { return Store.get(KEYS.checkins, []); },
  today: function () { return dateStr(new Date()); },
  hasCheckedToday: function () { return Store.getCheckins().indexOf(Store.today()) !== -1; },
  checkin: function () {
    var list = Store.getCheckins();
    var today = Store.today();
    if (list.indexOf(today) === -1) { list.push(today); Store.set(KEYS.checkins, list); }
    return Store.continuousDays();
  },
  continuousDays: function () {
    var set = {};
    Store.getCheckins().forEach(function (d) { set[d] = true; });
    var cursor = new Date();
    if (!set[dateStr(cursor)]) cursor.setDate(cursor.getDate() - 1);
    var n = 0;
    while (set[dateStr(cursor)]) {
      n++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return n;
  },

  /* ---------- 学习时长 ---------- */
  getStudyTimeAll: function () { return Store.get(KEYS.studyTime, {}); },
  getStudyTime: function (courseId) { return Store.getStudyTimeAll()[courseId] || 0; },
  addStudyTime: function (courseId, seconds) {
    var all = Store.getStudyTimeAll();
    all[courseId] = (all[courseId] || 0) + seconds;
    Store.set(KEYS.studyTime, all);
  },
  totalStudySeconds: function () {
    var all = Store.getStudyTimeAll();
    var sum = 0;
    Object.keys(all).forEach(function (k) { sum += all[k]; });
    return sum;
  },

  /* ---------- 学习提醒 ---------- */
  getReminder: function () { return Store.get(KEYS.reminder, { enabled: false, time: "20:00" }); },
  setReminder: function (obj) { Store.set(KEYS.reminder, obj); },

  /* ---------- 测验 ---------- */
  getQuizAll: function () { return Store.get(KEYS.quiz, {}); },
  getQuiz: function (courseId) {
    return Store.getQuizAll()[courseId] || { best: 0, history: [] };
  },
  saveQuizResult: function (courseId, score, total) {
    var all = Store.getQuizAll();
    var rec = all[courseId] || { best: 0, history: [] };
    rec.history.push({ score: score, total: total, at: new Date().toISOString() });
    rec.best = Math.max(rec.best, score);
    all[courseId] = rec;
    Store.set(KEYS.quiz, all);
    return rec;
  },

  /* ---------- 章节考试与实操 ---------- */
  getChapterAll: function () { return Store.get(KEYS.chapter, {}); },
  chapterKey: function (courseId, idx) { return courseId + ":" + idx; },
  getChapterRecord: function (courseId, idx) {
    return Store.getChapterAll()[Store.chapterKey(courseId, idx)] || { examScore: null, tasksDone: [], done: false };
  },
  saveChapterRecord: function (courseId, idx, rec) {
    var all = Store.getChapterAll();
    all[Store.chapterKey(courseId, idx)] = rec;
    Store.set(KEYS.chapter, all);
  },

  /* ---------- 直播复盘 ---------- */
  getLiveReports: function () { return Store.get(KEYS.liveReports, []); },
  addLiveReport: function (report) {
    var list = Store.getLiveReports();
    list.push(report);
    Store.set(KEYS.liveReports, list);
  },

  /* ---------- 评分规则 ---------- */
  getScoreRules: function () { return Store.get(KEYS.scoreRules, []); },
  saveScoreRules: function (rules) { Store.set(KEYS.scoreRules, rules); },

  /* ---------- 首次启动种子数据 ---------- */
  ensureSeed: function () {
    if (Store.getAdmins().length === 0) {
      Store.saveAdmins([
        { username: "宸轩", password: "15243896036hzy", createdAt: new Date().toISOString() }
      ]);
    }
    if (Store.getScoreRules().length === 0) {
      Store.saveScoreRules([
        { key: "watch", label: "观看人次", weight: 15, max: 1000 },
        { key: "peak", label: "场观", weight: 20, max: 500 },
        { key: "stay", label: "平均停留(秒)", weight: 20, max: 180 },
        { key: "interact", label: "互动率(%)", weight: 15, max: 20 },
        { key: "fans", label: "涨粉", weight: 15, max: 100 },
        { key: "gmv", label: "成交(单)", weight: 15, max: 50 }
      ]);
    }
  }
};

Store.ensureSeed();
