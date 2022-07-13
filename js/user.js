class FieldValidator {
  /**
   * 构造器
   * @param {String} textId input的ID
   * @param {*} validatorFunc 验证规则的函数，参数传入input的值，验证成功返回true，p = “”， 验证失败相反，
   */
  constructor(textId, validatorFunc) {
    this.input = $("#" + textId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }

  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerHTML = err;
      return false;
    } else {
      this.p.innerHTML = "";
      return true;
    }
  }

  /**
   * 验证所有验证器
   * @param  {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const result = await Promise.all(proms);
    return result.every((r) => r);
  }
}


// function test() {
//   FieldValidator.validate(loginIdValidator, nicknameValidator).then(
//     (result) => {
//       console.log(result);
//     }
//   );
// }
