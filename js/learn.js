/* ============================================================
   learn.js — 播放、测验、章节考、实操、直播复盘与 AI 分析
   ============================================================ */

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function fmtDuration(sec) {
  sec = Math.floor(sec);
  var h = Math.floor(sec / 3600);
  var m = Math.floor((sec % 3600) / 60);
  var s = sec % 60;
  if (h > 0) return h + " 小时 " + m + " 分";
  if (m > 0) return m + " 分 " + s + " 秒";
  return s + " 秒";
}

function flatLessons(course) {
  var flat = [];
  course.chapters.forEach(function (ch) {
    ch.lessons.forEach(function (ls) { flat.push(ls); });
  });
  return flat;
}

var SVG = {
  back: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  expand: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
  rotate: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

var Learn = {
  timer: null,
  orientation: "landscape",
  objectUrl: null,
  cleanup: function () {
    if (Learn.timer) { clearInterval(Learn.timer); Learn.timer = null; }
    if (Learn.objectUrl) { URL.revokeObjectURL(Learn.objectUrl); Learn.objectUrl = null; }
  },

  /* ============================================================
     评分引擎：六维加权
     ============================================================ */
  calcScore: function (data) {
    var rules = Store.getScoreRules();
    var dims = {};
    var score = 0;
    rules.forEach(function (r) {
      var v = Number(data[r.key]) || 0;
      var ratio = Math.min(v / r.max, 1);
      var got = ratio * r.weight;
      dims[r.key] = { got: got, ratio: ratio, weight: r.weight, label: r.label, value: v };
      score += got;
    });
    score = Math.round(score);
    var grade, comment;
    if (score >= 85) { grade = "S 优秀"; comment = "本场表现出色，各项数据均衡，继续保持当前节奏并沉淀可复制的方法。"; }
    else if (score >= 70) { grade = "A 良好"; comment = "整体不错，关注短板维度继续优化，有望冲击更高等级。"; }
    else if (score >= 55) { grade = "B 合格"; comment = "基本达到合格线，针对薄弱环节制定专项改进计划。"; }
    else if (score >= 40) { grade = "C 待提升"; comment = "部分维度明显拖后腿，建议先解决停留与互动，再谈转化。"; }
    else { grade = "D 需复盘"; comment = "本场数据需要认真复盘，回到课程对应章节补齐方法后再开播。"; }
    return { score: score, grade: grade, comment: comment, dims: dims };
  },

  /* ============================================================
     AI 结构化分析（规则引擎；豆包大模型接口预留，见 callDoubao）
     ============================================================ */
  ADVICE: {
    watch: { weak: "观看人次偏少，先固定开播时段，并在开播前做短视频与社群预热。", strong: "流量入口打开得不错，注意用稳定的停留数据接住每一波推流。" },
    peak: { weak: "峰值在线不高，尝试用整点福利、爆款话题或连麦制造在线高峰。", strong: "场观表现好，说明直播间具备承接集中流量的能力。" },
    stay: { weak: "平均停留偏短，前 30 秒就要抛出钩子，减少冗长的自我介绍。", strong: "停留时长优秀，内容节奏对观众有持续吸引力。" },
    interact: { weak: "互动率偏低，每 3 到 5 分钟安排一次提问、投票或点名。", strong: "互动氛围好，观众参与度高，利于系统打标签和推流。" },
    fans: { weak: "涨粉不足，要给观众明确的关注理由，并设置关注专属福利。", strong: "涨粉能力强，记得把新粉导入私域持续经营。" },
    gmv: { weak: "成交偏弱，按“信任、需求、方案、紧迫”四步重梳成交链路。", strong: "转化表现好，可尝试搭配引流款与利润款提升客单价。" }
  },

  buildAnalysis: function (data, result) {
    var ranked = Object.keys(result.dims).map(function (k) {
      return { key: k, ratio: result.dims[k].ratio };
    }).sort(function (a, b) { return b.ratio - a.ratio; });

    var strengths = ranked.slice(0, 2).filter(function (r) { return r.ratio > 0.3; })
      .map(function (r) { return Learn.ADVICE[r.key].strong; });
    var weaknesses = ranked.slice(-2).filter(function (r) { return r.ratio < 0.8; })
      .map(function (r) { return result.dims[r.key].label + "得分率仅 " + Math.round(r.ratio * 100) + "%"; });
    var suggestions = ranked.slice(-2).map(function (r) { return Learn.ADVICE[r.key].weak; });

    if (strengths.length === 0) strengths = ["当前没有明显优势维度，建议先把基础停留与互动做起来。"];
    var nextKey = ranked[ranked.length - 1].key;
    return {
      overall: result.comment,
      strengths: strengths,
      weaknesses: weaknesses,
      suggestions: suggestions,
      nextAction: Learn.ADVICE[nextKey].weak
    };
  },

  /* 真实豆包对接预留：上线后由后端代理调用，密钥不落前端。
     示例：fetch('/api/v1/live-analysis', {method:'POST', body: JSON.stringify({data, score})})
     当前环境无后端与密钥，统一使用 buildAnalysis 的规则引擎结果。 */
  callDoubao: function (data, result, cb) { cb(Learn.buildAnalysis(data, result)); },

  analysisHtml: function (ai) {
    function li(arr) { return "<ul>" + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
    return '<div class="card ai-card">' +
      '<div class="ai-head">AI 复盘分析<span class="ai-badge">规则引擎 · 豆包接口预留</span></div>' +
      '<div class="ai-block"><h5>整体评价</h5><p>' + esc(ai.overall) + '</p></div>' +
      '<div class="ai-block"><h5>优势</h5>' + li(ai.strengths) + '</div>' +
      '<div class="ai-block weak"><h5>短板</h5>' + li(ai.weaknesses) + '</div>' +
      '<div class="ai-block"><h5>改进建议</h5>' + li(ai.suggestions) + '</div>' +
      '<div class="ai-block"><h5>下场直播就这么做</h5><div class="ai-next">' + esc(ai.nextAction) + '</div></div>' +
      '</div>';
  },

  scoreHtml: function (result) {
    var rows = Object.keys(result.dims).map(function (k) {
      var d = result.dims[k];
      var pct = Math.round(d.ratio * 100);
      return '<div class="dim-row"><div class="dim-head"><span>' + esc(d.label) + '</span><span>' +
        d.got.toFixed(1) + ' / ' + d.weight + ' 分</span></div>' +
        '<div class="dim-bar"><i style="width:' + pct + '%"></i></div></div>';
    }).join("");
    return '<div class="score-hero"><div class="sh-grade">' + esc(result.grade) + '</div>' +
      '<div class="sh-score">' + result.score + '</div><div class="sh-total">综合得分（满分 100）</div></div>' +
      '<div class="card" style="margin-top:14px">' + rows + '</div>';
  },

  /* ============================================================
     播放页
     ============================================================ */
  renderPlay: function (app, segs) {
    Learn.cleanup();
    Learn.orientation = "landscape";
    var module = segs[0], courseId = segs[1], lessonId = segs[2];
    var course = getCourseById(courseId);
    if (!course) { location.hash = "#/home"; return; }
    var lesson = findLesson(course, lessonId);
    if (!lesson) { location.hash = "#/" + (module === "vocal" ? "vocal" : "live") + "/" + courseId; return; }

    Store.markLesson(courseId, lessonId);
    var flat = flatLessons(course);
    var pos = lessonIndex(course, lessonId);
    var prev = pos > 0 ? flat[pos - 1] : null;
    var next = pos < flat.length - 1 ? flat[pos + 1] : null;

    var media;
    if (lesson.videoId) {
      media = '<div class="player-empty"><div class="pe-icon">⏳</div><span>本地视频加载中...</span></div>';
    } else if (lesson.bvid) {
      media = '<iframe src="https://player.bilibili.com/player.html?bvid=' + encodeURIComponent(lesson.bvid) +
        '&autoplay=0&high_quality=1&danmaku=0" allowfullscreen="true" scrolling="no" border="0" frameborder="0" framespacing="0"></iframe>';
    } else {
      media = '<div class="player-empty"><div class="pe-icon">📼</div><span>视频待上架</span></div>';
    }

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="nav-bar"><button class="back-btn" onclick="location.hash=\'#/' + (module === "vocal" ? "vocal" : "live") + "/" + courseId + '\'">' + SVG.back + '</button><b>课时学习</b></div>' +
      '<div class="player-wrap"><div class="player-box" id="playerBox">' + media + '</div>' +
      '<div class="player-toolbar">' +
      '<button class="btn btn-line" onclick="Learn.toggleOrientation()">' + SVG.rotate + '<span id="oriLabel">切换竖屏</span></button>' +
      '<button class="btn btn-line" onclick="Learn.fullscreen()">' + SVG.expand + '<span>全屏播放</span></button>' +
      '</div>' +
      '<div class="player-timing"><span>' + esc(lesson.title) + ' · ' + esc(lesson.duration) + '</span>' +
      '<span class="timer-pill" id="timerPill">0 秒</span></div></div>' +
      '<div class="card" style="margin-top:16px"><b style="font-size:15px">本节学习任务</b>' +
      '<p style="color:var(--text-2);font-size:13px;margin:6px 0 12px">完整观看视频后，请完成 10 道课后选择题，系统会自动记录学习时长与进度。</p>' +
      '<button class="btn btn-primary btn-block" onclick="location.hash=\'#/quiz/' + courseId + '/single\'">完成本节课 · 去测验</button></div>' +
      '<div class="player-toolbar" style="margin-top:14px">' +
      (prev ? '<button class="btn btn-line" onclick="location.hash=\'#/play/' + module + '/' + courseId + '/' + prev.id + '\'">上一课</button>' : '<span style="flex:1"></span>') +
      (next ? '<button class="btn btn-primary" onclick="location.hash=\'#/play/' + module + '/' + courseId + '/' + next.id + '\'">下一课</button>' : '<span style="flex:1"></span>') +
      '</div></div></div>';

    Learn.timer = setInterval(function () {
      Store.addStudyTime(courseId, 1);
      var el = document.getElementById("timerPill");
      if (el) el.textContent = fmtDuration(Store.getStudyTime(courseId));
    }, 1000);

    /* 本地视频：从 IndexedDB 取出并生成可播放地址 */
    if (lesson.videoId) {
      VideoDB.get(lesson.videoId).then(function (rec) {
        var box = document.getElementById("playerBox");
        if (!box) return;
        if (!rec) {
          box.innerHTML = '<div class="player-empty"><div class="pe-icon">⚠️</div><span>本地视频缺失，请重新上传</span></div>';
          return;
        }
        var url = URL.createObjectURL(rec.blob);
        Learn.objectUrl = url;
        box.innerHTML = '<video controls playsinline preload="metadata" src="' + url + '"></video>';
      }).catch(function () {
        var box = document.getElementById("playerBox");
        if (box) box.innerHTML = '<div class="player-empty"><div class="pe-icon">⚠️</div><span>视频读取失败</span></div>';
      });
    }
  },

  toggleOrientation: function () {
    var box = document.getElementById("playerBox");
    var label = document.getElementById("oriLabel");
    if (Learn.orientation === "landscape") {
      Learn.orientation = "portrait";
      box.className = "player-box portrait";
      label.textContent = "切换横屏";
    } else {
      Learn.orientation = "landscape";
      box.className = "player-box";
      label.textContent = "切换竖屏";
    }
  },

  fullscreen: function () {
    var box = document.getElementById("playerBox");
    if (document.fullscreenElement) document.exitFullscreen();
    else if (box.requestFullscreen) box.requestFullscreen();
    else if (box.webkitRequestFullscreen) box.webkitRequestFullscreen();
  },

  /* ============================================================
     课后测验 / 章节考试
     ============================================================ */
  renderQuiz: function (app, segs) {
    Learn.cleanup();
    var courseId = segs[0], mode = segs[1] || "single", chapterIdx = segs[2];
    var course = getCourseById(courseId);
    if (!course) { location.hash = "#/home"; return; }
    var questions = getQuizQuestions(courseId);
    var answers = new Array(questions.length).fill(-1);

    function view() {
      var qs = questions.map(function (item, qi) {
        var opts = item.options.map(function (op, oi) {
          var sel = answers[qi] === oi ? " selected" : "";
          return '<button class="quiz-opt' + sel + '" onclick="Learn.pick(' + qi + ',' + oi + ')">' +
            '<span class="opt-radio">' + (answers[qi] === oi ? "✓" : "") + '</span><span>' + esc(op) + '</span></button>';
        }).join("");
        return '<div class="quiz-q"><h4><span class="qno">Q' + (qi + 1) + '</span>' + esc(item.q) + '</h4>' + opts + '</div>';
      }).join("");

      var title = mode === "chapter" ? "章节考试" : "课后测验";
      app.innerHTML = '<div class="app-shell"><div class="page">' +
        '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + SVG.back + '</button><b>' + title + ' · ' + esc(course.title) + '</b></div>' +
        '<div class="card">' + qs +
        '<div id="quizError" class="form-error"></div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:8px" onclick="Learn.submitQuiz()">交卷</button>' +
        '</div></div></div>';
    }

    Learn.pick = function (qi, oi) { answers[qi] = oi; view(); };

    Learn.submitQuiz = function () {
      var unanswered = answers.filter(function (a) { return a === -1; }).length;
      var err = document.getElementById("quizError");
      if (unanswered > 0) { err.textContent = "还有 " + unanswered + " 道题未作答"; return; }
      var score = 0;
      questions.forEach(function (item, qi) { if (answers[qi] === item.answer) score++; });
      Store.saveQuizResult(courseId, score, questions.length);

      if (mode === "chapter") {
        var idx = Number(chapterIdx);
        var rec = Store.getChapterRecord(courseId, idx);
        rec.examScore = score;
        rec.done = true;
        Store.saveChapterRecord(courseId, idx, rec);
      }
      Learn.quizResult(course, score, questions.length, mode, chapterIdx);
    };
    view();
  },

  quizResult: function (course, score, total, mode, chapterIdx) {
    var pct = Math.round(score / total * 100);
    var emoji = score >= 8 ? "🎉" : score >= 6 ? "💪" : "📖";
    var back = mode === "chapter"
      ? '#/' + (course.module === "vocal" ? "vocal/" : "live/") + course.id
      : '#/play/' + course.module + '/' + course.id + '/' + (Store.getProgress(course.id).lastLesson || "");
    var app = document.getElementById("app");
    app.innerHTML = '<div class="app-shell"><div class="page"><div class="card quiz-result">' +
      '<div class="qr-emoji">' + emoji + '</div>' +
      '<div class="qr-score">' + score + ' / ' + total + '</div>' +
      '<p>正确率 ' + pct + '%，历史最佳 ' + Store.getQuiz(course.id).best + ' 题正确</p>' +
      '<button class="btn btn-primary" onclick="location.hash=\'#/quiz/' + course.id + '/' + mode + (mode === "chapter" ? "/" + chapterIdx : "") + '\'">再考一次</button>' +
      '<button class="btn btn-line" onclick="location.hash=\'' + back + '\'">返回课程</button>' +
      '</div></div></div>';
  },

  /* ============================================================
     实操任务
     ============================================================ */
  renderTasks: function (app, segs) {
    Learn.cleanup();
    var courseId = segs[0], idx = Number(segs[1]);
    var course = getCourseById(courseId);
    if (!course) { location.hash = "#/home"; return; }
    var chapter = course.chapters[idx];
    var rec = Store.getChapterRecord(courseId, idx);
    var practice = chapter.practice;

    /* ---------- 模式一：后台自定义实操（带分值评分） ---------- */
    if (practice && practice.tasks && practice.tasks.length) {
      function view() {
        var full = 0;
        practice.tasks.forEach(function (t) { full += Number(t.score) || 0; });
        var got = 0;
        rec.tasksDone.forEach(function (key) {
          var t = practice.tasks[Number(key)];
          if (t) got += Number(t.score) || 0;
        });
        var passLine = Number(practice.passScore) || 60;
        rec.practiceScore = got;
        rec.practicePassed = got >= passLine;
        Store.saveChapterRecord(courseId, idx, rec);

        var items = practice.tasks.map(function (t, i) {
          var on = rec.tasksDone.indexOf(String(i)) !== -1;
          return '<div class="task-item"><button class="task-check' + (on ? " on" : "") +
            '" onclick="Learn.toggleTask(' + i + ')">' + (on ? "✓" : "") + '</button>' +
            '<div class="task-main"><b>' + esc(t.title) + '</b>' +
            (t.desc ? '<span>' + esc(t.desc) + '</span>' : "") + '</div>' +
            '<span class="tag tag-primary">' + (Number(t.score) || 0) + " 分</span></div>";
        }).join("");

        var statusTag = rec.practicePassed
          ? '<span class="tag tag-success">已达标 ' + got + " / " + full + "</span>"
          : '<span class="tag tag-warning">未达标 ' + got + " / " + full + " · 及格 " + passLine + "</span>";

        app.innerHTML = '<div class="app-shell"><div class="page">' +
          '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + SVG.back + '</button><b>章节实操</b></div>' +
          '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<b style="font-size:15px">' + esc(chapter.title) + '</b>' + statusTag + '</div>' + items +
          (course.module === "live" ? '<button class="btn btn-ghost btn-block" style="margin-top:12px" onclick="location.hash=\'#/live-report\'">去录入近一周直播数据</button>' : "") +
          '</div></div></div>';
      }
      Learn.toggleTask = function (i) {
        var key = String(i);
        var pos = rec.tasksDone.indexOf(key);
        if (pos === -1) rec.tasksDone.push(key); else rec.tasksDone.splice(pos, 1);
        Store.saveChapterRecord(courseId, idx, rec);
        view();
      };
      view();
      return;
    }

    /* ---------- 模式二：默认实操模板（无分值，仅记录完成） ---------- */
    var vocalTasks = [
      "完整跟练本章全部练声/开嗓内容并录音回听",
      "对照课程要点自查发声、气息或咬字问题",
      "提交一段不少于 1 分钟的练习录音（作品入口开发中，先自行保存）"
    ];
    var liveTasks = [
      "按本章方法整理一份本场直播脚本或话术卡",
      "完成近一周直播数据录入并查看 AI 复盘评分",
      "根据 AI 建议写下下场直播的三项调整动作"
    ];
    var base = course.module === "vocal" ? vocalTasks : liveTasks;
    var tasks = chapter.lessons.map(function (ls) { return "完成课时《" + ls.title + "》的课后练习"; }).concat(base);

    function viewDefault() {
      var items = tasks.map(function (t, i) {
        var on = rec.tasksDone.indexOf(String(i)) !== -1;
        return '<div class="task-item"><button class="task-check' + (on ? " on" : "") + '" onclick="Learn.toggleTask(' + i + ')">' +
          (on ? "✓" : "") + '</button><div class="task-main"><b>' + esc(t) + '</b>' +
          '<span>完成后勾选，系统自动记录实操进度</span></div></div>';
      }).join("");

      app.innerHTML = '<div class="app-shell"><div class="page">' +
        '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + SVG.back + '</button><b>章节实操</b></div>' +
        '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<b style="font-size:15px">' + esc(chapter.title) + '</b>' +
        '<span class="task-progress-pill">' + rec.tasksDone.length + ' / ' + tasks.length + '</span></div>' + items +
        (course.module === "live" ? '<button class="btn btn-ghost btn-block" style="margin-top:12px" onclick="location.hash=\'#/live-report\'">去录入近一周直播数据</button>' : "") +
        '</div></div></div>';
    }

    Learn.toggleTask = function (i) {
      var key = String(i);
      var pos = rec.tasksDone.indexOf(key);
      if (pos === -1) rec.tasksDone.push(key); else rec.tasksDone.splice(pos, 1);
      Store.saveChapterRecord(courseId, idx, rec);
      viewDefault();
    };
    viewDefault();
  }
};

/* ============================================================
   直播数据复盘：单场 + 近一周 + 历史
   ============================================================ */
Object.assign(Learn, {
  reportTab: "single",
  weekDraft: null,
  singleDraft: { watch: "", peak: "", stay: "", interact: "", fans: "", gmv: "" },

  dimFields: [
    { key: "watch", label: "观看人次" },
    { key: "peak", label: "场观（峰值在线）" },
    { key: "stay", label: "平均停留（秒）" },
    { key: "interact", label: "互动率（%）" },
    { key: "fans", label: "涨粉数" },
    { key: "gmv", label: "成交单数" }
  ],

  renderLiveReport: function (app) {
    Learn.cleanup();
    Learn.reportTab = "single";
    Learn.weekDraft = Learn.buildWeekDraft();
    Learn.drawReport(app);
  },

  buildWeekDraft: function () {
    var rows = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var wk = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()];
      rows.push({ date: dateStr(d), wk: wk, data: { watch: "", peak: "", stay: "", interact: "", fans: "", gmv: "" } });
    }
    return rows;
  },

  drawReport: function (app) {
    var tabSingle = Learn.reportTab === "single";
    var formCard = tabSingle ? Learn.singleFormHtml() : Learn.weekFormHtml();

    app.innerHTML =
      '<div class="app-shell"><div class="page">' +
      '<div class="nav-bar"><button class="back-btn" onclick="history.back()">' + SVG.back + '</button><b>直播数据复盘</b></div>' +
      '<div class="player-toolbar" style="margin:0 0 14px">' +
      '<button class="btn ' + (tabSingle ? "btn-primary" : "btn-line") + '" onclick="Learn.switchTab(\'single\')">单场复盘</button>' +
      '<button class="btn ' + (!tabSingle ? "btn-primary" : "btn-line") + '" onclick="Learn.switchTab(\'week\')">近一周复盘</button>' +
      '</div>' +
      formCard +
      '<div id="reportResult"></div>' +
      '<div id="historyBlock" style="margin-top:16px">' + Learn.historyHtml() + '</div>' +
      '</div></div>';
  },

  switchTab: function (tab) {
    Learn.reportTab = tab;
    Learn.drawReport(document.getElementById("app"));
  },

  singleFormHtml: function () {
    var fields = Learn.dimFields.map(function (f) {
      return '<div class="field"><label>' + f.label + '</label>' +
        '<input class="input" type="number" min="0" inputmode="decimal" data-key="' + f.key + '" value="' +
        esc(Learn.singleDraft[f.key]) + '" oninput="Learn.singleInput(this)"></div>';
    }).join("");
    return '<div class="card"><b style="font-size:15px">录入本场直播数据</b>' +
      '<div class="report-grid" style="margin-top:12px">' + fields + '</div>' +
      '<button class="btn btn-primary btn-block" style="margin-top:16px" onclick="Learn.submitSingle()">生成评分与 AI 分析</button></div>';
  },

  singleInput: function (el) { Learn.singleDraft[el.getAttribute("data-key")] = el.value; },

  weekFormHtml: function () {
    var head = '<tr><th>日期</th>' + Learn.dimFields.map(function (f) {
      return '<th>' + esc(f.label.replace(/（.*?）|\(.*?\)/g, "")) + '</th>';
    }).join("") + '</tr>';
    var rows = Learn.weekDraft.map(function (row, di) {
      var tds = Learn.dimFields.map(function (f) {
        return '<td><input type="number" min="0" inputmode="decimal" value="' + esc(row.data[f.key]) +
          '" oninput="Learn.weekInput(' + di + ',\'' + f.key + '\',this.value)"></td>';
      }).join("");
      return '<tr><td class="week-day">' + row.date.slice(5) + ' ' + row.wk + '</td>' + tds + '</tr>';
    }).join("");

    return '<div class="card"><b style="font-size:15px">录入近一周（7 天）数据</b>' +
      '<p style="color:var(--text-2);font-size:12px;margin:6px 0 12px">系统按周日均数据加权评分，并输出每日趋势与周度 AI 分析。</p>' +
      '<div class="admin-table-wrap" style="box-shadow:none"><table class="week-table">' + head + rows + '</table></div>' +
      '<button class="btn btn-primary btn-block" style="margin-top:16px" onclick="Learn.submitWeek()">生成周度评分与 AI 分析</button></div>';
  },

  weekInput: function (di, key, val) { Learn.weekDraft[di].data[key] = val; },

  submitSingle: function () {
    var data = {};
    var empty = 0;
    Learn.dimFields.forEach(function (f) {
      var v = Number(Learn.singleDraft[f.key]);
      if (!Learn.singleDraft[f.key]) empty++;
      data[f.key] = v || 0;
    });
    if (empty === Learn.dimFields.length) { App.toast("请先填写直播数据"); return; }

    var result = Learn.calcScore(data);
    var report = { type: "single", data: data, score: result.score, grade: result.grade, at: new Date().toISOString() };
    Store.addLiveReport(report);

    Learn.callDoubao(data, result, function (ai) {
      var box = document.getElementById("reportResult");
      box.innerHTML = '<div style="margin-top:16px">' + Learn.scoreHtml(result) +
        '<div style="margin-top:14px">' + Learn.analysisHtml(ai) + '</div></div>';
      Learn.refreshHistory();
    });
  },

  submitWeek: function () {
    var avg = {}, totals = { watch: 0, peak: 0, stay: 0, interact: 0, fans: 0, gmv: 0 };
    var anyFilled = false;
    Learn.dimFields.forEach(function (f) {
      var sum = 0;
      Learn.weekDraft.forEach(function (row) {
        var v = Number(row.data[f.key]);
        if (row.data[f.key] !== "") anyFilled = true;
        sum += v;
      });
      totals[f.key] = sum;
      avg[f.key] = Math.round((sum / 7) * 10) / 10;
    });
    if (!anyFilled) { App.toast("请先填写本周数据"); return; }

    var result = Learn.calcScore(avg);
    var daily = Learn.weekDraft.map(function (row) {
      var r = Learn.calcScore(row.data);
      return { date: row.date, score: r.score, grade: r.grade };
    });

    var first3 = (daily[0].score + daily[1].score + daily[2].score) / 3;
    var last3 = (daily[4].score + daily[5].score + daily[6].score) / 3;
    var trend = last3 >= first3 + 3 ? "上升" : last3 <= first3 - 3 ? "下滑" : "平稳";

    var report = {
      type: "week", avg: avg, totals: totals, daily: daily, trend: trend,
      score: result.score, grade: result.grade, at: new Date().toISOString()
    };
    Store.addLiveReport(report);

    Learn.callDoubao(avg, result, function (ai) {
      var trendHtml = '<div class="card" style="margin-top:14px"><b style="font-size:15px">每日评分趋势（' + trend + '）</b>' +
        daily.map(function (d) {
          return '<div class="dim-row" style="margin-top:10px"><div class="dim-head"><span>' + esc(d.date) +
            ' ' + esc(d.grade) + '</span><span>' + d.score + ' 分</span></div>' +
            '<div class="dim-bar"><i style="width:' + d.score + '%"></i></div></div>';
        }).join("") +
        '<p style="font-size:13px;color:var(--text-2);margin-top:10px">周合计：观看 ' + totals.watch +
        ' 人次 · 涨粉 ' + totals.fans + ' · 成交 ' + totals.gmv + ' 单</p></div>';

      var box = document.getElementById("reportResult");
      box.innerHTML = '<div style="margin-top:16px">' + Learn.scoreHtml(result) + trendHtml +
        '<div style="margin-top:14px">' + Learn.analysisHtml(ai) + '</div></div>';
      Learn.refreshHistory();
    });
  },

  historyHtml: function () {
    var list = Store.getLiveReports().slice().reverse();
    if (list.length === 0) {
      return '<div class="card" style="margin-top:16px;text-align:center;color:var(--text-3);font-size:13px">暂无复盘记录，提交后在此查看</div>';
    }
    var items = list.map(function (r) {
      var d = new Date(r.at);
      var when = pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
      var kind = r.type === "week" ? "近一周" : "单场";
      return '<div class="report-history-item"><div class="rhi-main"><b>' + kind + '复盘 · ' + esc(r.grade) + '</b>' +
        '<span>' + when + '</span></div><span class="tag tag-primary">' + r.score + ' 分</span></div>';
    }).join("");
    return '<div class="section-title">复盘历史</div><div class="card">' + items + '</div>';
  },

  refreshHistory: function () {
    var box = document.getElementById("historyBlock");
    if (box) box.innerHTML = Learn.historyHtml();
  }
});
