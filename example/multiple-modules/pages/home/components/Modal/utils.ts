import { post } from "../../utils"

export const formRulesMap = {
  noEmpty: formRulesNoEmpty,
  public: formRulesPublic,
  onlyLetters: formRulesOnlyLetters
}

export function formRulesOnlyLetters(props = {

}) {
  return [{
    required: true,
    pattern: /^[a-zA-Z][a-zA-Z][a-zA-Z]*$/gm,
    message: '仅允许英文字符，长度至少3位，不可包含特殊字符'
  }]
}

export function formRulesNoEmpty(props = {
  errorMsg: '当前内容不能为空'
}) {
  const { errorMsg } = props
  return [
    {
      required: true,
      message: ''
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || !value.trim().length) {
          return Promise.reject(new Error(errorMsg))
        }

        return Promise.resolve()
      }
    })
  ]
}

export function formRulesPublic(props = {
  regexp: void 0,
  emptyMsg: '当前内容不能为空',
  errorMsg: '当前内容不能为空'
}) {
  const { errorMsg, emptyMsg, regexp } = props
  return [
    {
      required: true,
      message: ''
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || !value.trim().length) {
          return Promise.reject(new Error(emptyMsg))
        }

        if ((regexp && !regexp.test(value))) {
          return Promise.reject(new Error(errorMsg))
        }

        return Promise.resolve()
      }
    })
  ]
}