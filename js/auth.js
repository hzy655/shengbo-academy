/* ============================================================
   auth.js — 用户注册/登录 + 管理员登录（两套登录态隔离）
   ============================================================ */

var NAME_RE = /^[A-Za-z0-9]{4,20}$/;

var Auth = {
  register: function (username, password, nickname) {
    username = (username || "").trim();
    nickname = (nickname || "").trim();

    if (!NAME_RE.test(username)) {
      return { ok: false, error: "用户名需为 4 到 20 位字母或数字" };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: "密码至少需要 6 位" };
    }
    if (!nickname || nickname.length > 20) {
      return { ok: false, error: "昵称需为 1 到 20 个字" };
    }
    var users = Store.getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        return { ok: false, error: "该用户名已被注册" };
      }
    }
    users.push({
      username: username,
      password: password,
      nickname: nickname,
      createdAt: new Date().toISOString()
    });
    Store.saveUsers(users);
    Store.setCurrent(username);
    return { ok: true };
  },

  login: function (username, password) {
    username = (username || "").trim();
    var user = Store.findUser(username);
    if (!user || user.password !== password) {
      return { ok: false, error: "用户名或密码不正确" };
    }
    Store.setCurrent(username);
    return { ok: true };
  },

  logout: function () { Store.clearCurrent(); },

  currentUser: function () {
    var name = Store.getCurrent();
    return name ? Store.findUser(name) : null;
  },

  /* ---------- 管理员 ---------- */
  adminLogin: function (username, password) {
    username = (username || "").trim();
    var admin = Store.findAdmin(username);
    if (!admin || admin.password !== password) {
      return { ok: false, error: "管理员账号或密码不正确" };
    }
    Store.setAdmin(username);
    return { ok: true };
  },

  adminLogout: function () { Store.clearAdmin(); },

  currentAdmin: function () {
    var name = Store.getAdmin();
    return name ? Store.findAdmin(name) : null;
  },

  addAdmin: function (username, password) {
    username = (username || "").trim();
    if (!username || username.length > 20) {
      return { ok: false, error: "管理员账号需为 1 到 20 个字符" };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: "密码至少需要 6 位" };
    }
    var list = Store.getAdmins();
    for (var i = 0; i < list.length; i++) {
      if (list[i].username === username) {
        return { ok: false, error: "该管理员账号已存在" };
      }
    }
    list.push({ username: username, password: password, createdAt: new Date().toISOString() });
    Store.saveAdmins(list);
    return { ok: true };
  }
};
