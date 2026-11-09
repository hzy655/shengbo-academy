/* ============================================================
   router.js — hash 路由（用户端 + 管理端两套登录守卫）
   ============================================================ */

var USER_PROTECTED = ["home", "vocal", "live", "favorites", "mine", "play", "quiz", "tasks", "live-report", "checkin", "settings"];

var Router = {
  start: function () {
    window.addEventListener("hashchange", function () { Router.dispatch(); });
    Router.dispatch();
  },

  dispatch: function () {
    var app = document.getElementById("app");
    var hash = location.hash.replace(/^#/, "") || "/home";
    var segs = hash.split("/").filter(Boolean);
    var root = segs[0];

    /* ---------- 管理端 ---------- */
    if (root === "admin") {
      var sub = segs[1] || "";
      if (sub === "login") { Admin.renderLogin(app); return; }
      if (!Auth.currentAdmin()) { location.hash = "#/admin/login"; return; }

      if (!sub) { Admin.renderDashboard(app); return; }
      if (sub === "courses") { Admin.renderCourses(app); return; }
      if (sub === "course-new") { Admin.renderCourseNew(app); return; }
      if (sub === "course-edit") { Admin.renderCourseEdit(app, segs[2]); return; }
      if (sub === "users") { Admin.renderUsers(app); return; }
      if (sub === "admins") { Admin.renderAdmins(app); return; }
      if (sub === "score-rules") { Admin.renderScoreRules(app); return; }
      if (sub === "membership") { Admin.renderMembership(app); return; }
      Admin.renderDashboard(app);
      return;
    }

    /* ---------- 用户端登录守卫 ---------- */
    if (USER_PROTECTED.indexOf(root) !== -1 && !Auth.currentUser()) {
      location.hash = "#/login";
      return;
    }

    /* ---------- 公开页面 ---------- */
    if (root === "login") { App.renderLogin(app); return; }
    if (root === "register") { App.renderRegister(app); return; }

    /* ---------- 用户端页面 ---------- */
    if (root === "home") { App.renderHome(app); return; }
    if (root === "vocal") { App.renderModule(app, "vocal", segs[1]); return; }
    if (root === "live") { App.renderModule(app, "live", segs[1]); return; }
    if (root === "favorites") { App.renderFavorites(app); return; }
    if (root === "mine") { App.renderMine(app); return; }
    if (root === "settings") { App.renderSettings(app); return; }
    if (root === "play") { Learn.renderPlay(app, segs); return; }
    if (root === "quiz") { Learn.renderQuiz(app, segs.slice(1)); return; }
    if (root === "tasks") { Learn.renderTasks(app, segs.slice(1)); return; }
    if (root === "live-report") { Learn.renderLiveReport(app); return; }
    if (root === "checkin") { App.renderCheckin(app); return; }

    App.renderHome(app);
  }
};
