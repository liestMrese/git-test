(async () => {
  // 验证是否有登录，没有跳转登录页，有就获取登录用户信息
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    // 登录过期，或未登录
    alert("未登录，或登录已过期,请重新登录");
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      loginId: $("#loginId"),
      nickname: $("#nickname"),
    },
    loginOut: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    form: $(".msg-container"),
  };

  setUserInfo();
  //   设置用户信息
  function setUserInfo() {
    doms.aside.loginId.innerText = user.loginId;
    doms.aside.nickname.innerText = user.nickname;
  }

  // 加载历史记录
  loadHistory();

  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  //   登出
  doms.loginOut.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };

  // 为表单注册提交事件
  doms.form.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  // 轮动条滚动到最后
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    // 如果是空什么也不干
    if (!content) {
      return;
    }
    // 先把用户的消息显示出来
    addChat({
      from: user.loginId,
      to: null,
      content,
      createdAt: formatDate(Date.now()),
    });
    doms.txtMsg.value = "";
    scrollBottom();

    const resp = await API.sendChat(content);
    addChat({
      ...resp.data,
      from: null,
      to: user.loginId,
    });
    scrollBottom();
  }

  // 添加一条消息
  function addChat(chatInfo) {
    // 创建容器
    const item = $$$("div");
    item.classList.add("chat-item");
    if (chatInfo.from) {
      item.classList.add("me");
    }
    // 图片
    const avatar = $$$("img");
    avatar.className = "chat-avatar";
    avatar.src = chatInfo.from
      ? "./asset/avatar.png"
      : "./asset/robot-avatar.jpg";

    // 消息内容
    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    // 时间
    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    item.appendChild(avatar);
    item.appendChild(content);
    item.appendChild(date);

    doms.chatContainer.appendChild(item);
  }

  // 时间戳格式化
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
})();
