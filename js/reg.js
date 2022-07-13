const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "这个账号已被占用，请换一个";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", async function (
  val
) {
  if (!val) {
    return "请填写昵称";
  }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});

const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

// 全部验证，提交验证
const form = $("form");

form.onsubmit = async function (e) {
  // 阻止默认时间（提交）
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
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
  //     nickname: nicknameValidator.input.value,
  //   };
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功！即将跳转登录页面")
    location.href = "./login.html";
  }
};


