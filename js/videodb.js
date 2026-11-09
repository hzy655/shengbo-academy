/* ============================================================
   videodb.js — IndexedDB 本地视频存储
   纯前端原型用，承载上传的课程视频 Blob；播放时生成 objectURL
   ============================================================ */

var VideoDB = {
  db: null,

  open: function () {
    return new Promise(function (resolve, reject) {
      if (VideoDB.db) return resolve(VideoDB.db);
      var req = indexedDB.open("sv_videos", 1);
      req.onupgradeneeded = function () {
        req.result.createObjectStore("files", { keyPath: "id" });
      };
      req.onsuccess = function () { VideoDB.db = req.result; resolve(VideoDB.db); };
      req.onerror = function () { reject(req.error); };
    });
  },

  put: function (file) {
    var id = "v" + Date.now() + Math.floor(Math.random() * 1000000);
    return VideoDB.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var rec = { id: id, name: file.name, size: file.size, blob: file, at: Date.now() };
        var tx = db.transaction("files", "readwrite");
        tx.objectStore("files").put(rec);
        tx.oncomplete = function () { resolve({ id: id, name: file.name, size: file.size }); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  },

  get: function (id) {
    return VideoDB.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction("files", "readonly");
        var req = tx.objectStore("files").get(id);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      });
    });
  },

  remove: function (id) {
    return VideoDB.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction("files", "readwrite");
        tx.objectStore("files").delete(id);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }
};
