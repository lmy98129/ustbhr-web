import * as userService from '../services/user';
import Cookies from 'js-cookie';
import { routerRedux } from 'dva/router';

const SESSION_ERROR_CODE = 500200;
const LOGOUT_FAIL_CODE = 500205;

// 主界面对应的状态管理器
export default {
  namespace: 'mainModel',
  // 状态初值
  state: { 
    userInfo: {},
    title: "",
  },

  // 异步操作effect，主要是网络请求等
  effects: {

    // 查询当前登录账户信息
    *info(_, { call, put }) {
      let role = Cookies.get("role");
      // 找不到角色cookie，重新登录
      if (role === undefined) {
        yield put({type: "directToLogin"});
        return;
      }
      const { data } = yield call(userService.info, role);
      // session过期，重新登录
      if (data.code === SESSION_ERROR_CODE) {
        yield put({type: "directToLogin"});
        return;
      }
      // 登录账户信息查询成功，更新状态
      yield put({ type: "update", payload: { userInfo: data.data }});
    },

    // 登出
    *logout(_, { call, put }) {
      let role = Cookies.get("role");
       // 找不到角色cookie，无法发请求更新session，重新登录
      if (role === undefined) {
        yield put({type: "directToLogin"});
        return;
      }
      const { data } = yield call(userService.logout, role);
      // 更新session出故障，重新登录
      if (data.code === LOGOUT_FAIL_CODE) {
        yield put({type: "directToLogin"});
        return;
      }

      // 清理当前状态至初值
      yield put({ type: "clear"});
      Cookies.remove("manager_token", { path: '/' });
      Cookies.remove("user_token", { path: '/' }); 
      Cookies.remove("role", { path: '/' });   
      console.log(Cookies.get("role"));

      // 跳转到登录页面
      yield put(routerRedux.push("/login"));

      // 发送给登录页面要展示的信息
      yield put({ type: "loginModel/update", 
      payload: { 
        loginMessage: "您已退出登录", 
        loginCode: -2 } 
      });    
    },

    // 出现各种异常情况后直接返回到登录页面
    *directToLogin(_, { call, put }) {
      Cookies.remove("manager_token", { path: '/' });
      Cookies.remove("user_token", { path: '/' });  
      Cookies.remove("role", { path: '/' });   
      // 发送给登录页面要展示的信息
      yield put({ type: "loginModel/update", 
        payload: { 
          loginMessage: "登录态失效，请重新登录", 
          loginCode: SESSION_ERROR_CODE } 
        });     
      yield put(routerRedux.push("/login"));
    }

  },

  
  // 对状态state进行实际操作reducer
  reducers: {
    // 直接更新传入的所有状态
    update(state, { payload }) {
      return { ...state, ...payload };
    },

    // 更新当前界面标题和网页标题
    title(state, { payload }) {
      const { title } = payload;
      if (title !== undefined) {
        document.title = "USTB考勤 - "+title;
        return { ...state, ...payload };
      }
      return state;
    },

    // 清除所有状态，返回初态
    clear() {
      return { userInfo: {}, title: "" };
    }

  }

};