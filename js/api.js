const API = (() => {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = token;
    }
    return fetch(BASE_URL + path, { headers });
  }

  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = token;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  /**
   * 传入注册字段,post
   * @param {Object} userInfo
   */
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }

  /**
   * 传入一个账号密码的对象
   * @param {Object} loginInfo
   */
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    //   登录成功保存token
    if (result.code === 0) {
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, `Bearer ${token}`);
    }
    return result;
  }

  async function exists(loginId) {
    const resp = await get(`/api/user/exists?loginId=${loginId}`);
    return await resp.json();
  }

  async function profile() {
    const resp = await get("/api/user/profile");
    return resp.json();
  }

  // content string
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return resp.json();
  }

  function getHistory() {
    return get("/api/chat/history").then((resp) => resp.json());
  }

  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut
  }
})();
