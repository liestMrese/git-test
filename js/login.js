const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});

// 全部验证，提交验证
const form = $("form");

form.onsubmit = async function (e) {
  // 阻止默认时间（提交）
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return;
  }

  //   拿到表单数据
  const formData = new FormData(this);
  //   把数据还原成一个对象，name 值作为key ，表单value 作为value
  const data = Object.fromEntries(formData);
  //   const data = {
  //     loginId: loginIdValidator.input.value,
  //     loginPwd: loginPwdValidator.input.value,
  //   };
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功！即将跳转聊天室");
    location.href = "./index.html";
  } else {
      loginPwdValidator.input.value = "";
      loginIdValidator.p.innerHTML = "账号或密码错误";
  }
};
