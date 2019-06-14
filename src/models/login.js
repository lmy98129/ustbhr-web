import * as userService from '../services/user';
import { routerRedux } from 'dva/router';
import { inputPassToFormPass } from '../utils/md5';
import Cookies from 'js-cookie';

// 登录界面对应的状态管理器
export default {
  namespace: 'loginModel',
  // 状态初值
  state: { 
    isCheckedExistManager: false,
    registerCode: -1,
    registerMessage: "",
    loginCode: -1,
    loginMessage: "",
  },

  // 异步操作effect，主要是网络请求等
  effects: {
    // 调用service查询经理是否存在
    *existManager(payload, { call, put }) {
      const { data } = yield call(userService.existManager, { });
      const isExistsManager = data.data;
      if (!isExistsManager) {
        // 若存在，使用put和routerRedux跳转至注册界面
        yield put(routerRedux.push("/register"));
      } else {
        // 若不存在，使用put发起状态更改操作，更新isCheckExistManager保持在登录界面
        yield put({ type: "update", payload: { isCheckedExistManager: true } });
      }
    },

    // 注册
    *register({ payload }, { call, put }) {
      const formPass = inputPassToFormPass(payload.password);
      payload.password = formPass;
      delete payload.confirm;
      delete payload.agreement;
      const { data } = yield call(userService.managerRegister, payload);
      yield put({ type: "update", payload: { registerMessage: data.msg, registerCode: data.code }});
    },

    // 登录
    *login({ payload }, { call, put }) {
      const formPass = inputPassToFormPass(payload.password);
      payload.password = formPass;
      let role = "";
      switch(payload.role) {
        case "1": role = "manager"; break;
        case "2": role = "user";    break;
        default: role = "user";
      }
      delete payload.role;
      Cookies.set('role', role, { expires: 30, path: '/' });
      const { data } = yield call(userService.login, role, payload);
      yield put({ type: "update", payload: { loginMessage: data.msg, loginCode: data.code } });
    }
  },
  
  // 对状态state进行实际操作reducer
  reducers: {
    // 直接更新传入的所有状态
    update(state, { payload }) {
      return { ...state, ...payload };
    },

    // 清除注册消息回到初态，应对多次注册请求场景
    clearRegisterMessage(state) {
      return { ...state, registerMessage: "", registerCode: -1 };
    },

    // 清除登录消息回到初态，应对多次登录请求场景
    clearLoginMessage(state) {
      return { ...state, loginMessage: "", loginCode: -1 };
    },
    
  }

};