import axios from "axios"
import { ActionTypes } from "../store/user/actionTypes"
let clearFlag = true

export default {
  setupInterceptors: store => {
    axios.interceptors.request.use(
      config => {
        let lang = localStorage.getItem("lang") === "cn" ? "zh-CN" : "en-US"
        config.headers["accept-language"] = lang
        config.headers["Access-Control-Allow-Origin"] = "*"
        return config
      },
      error => {
        console.log("this is response error", error)
        return Promise.reject(error)
      }
    )
    axios.interceptors.response.use(
      response => {
        let data = response.data
        let code = data.code || data["err-code"]
        if (code !== undefined && [401, 30001, 999].indexOf(code) > -1) {
          if (clearFlag) {
            store.dispatch({ type: ActionTypes.INITIAL_STATE })
            localStorage.removeItem("LoginFiatToken")
            clearFlag = false
          }

          console.log("this is response error", response.data.message)
          return (window.location.href = "/login")
        } else {
          return response
        }
      },
      error => {
        console.log("this is response error", error)
        return Promise.reject(error)
      }
    )
  }
}
