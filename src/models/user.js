import * as userService from '../services/user';
import { warning, success } from '../utils/message';
import { inputPassToFormPass } from '../utils/md5';

const USER_REGISTER_SUCCESS = "新建用户记录成功";
const USER_EDIT_SUCCESS = "修改用户记录成功";
const USER_DELETE_SUCCESS = "删除用户记录成功";
const DEPTHEAD_REASSIGN_SUCCESS = "任命新部门主管成功";

// 用户管理界面对应的状态管理器
export default {
  namespace: 'userModel',
  // 状态初值
  state: { 
    userList: [],
    isSearching: false,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    keyword: {},
  },

  // 异步操作effect，主要是网络请求等
  effects: {

    // 查询用户列表
    *list({ payload }, { call, put, select }) {
      yield put({ type: "update", payload: { isSearching: false, keyword: {} } });
      const currentPage = yield select(state => 
        state.userModel.currentPage);
      const pageSize = yield select(state => 
        state.userModel.pageSize);
      let query = { page: currentPage, size: pageSize };
      
      if (payload !== undefined 
        && (payload.deptId !== undefined 
        || payload.roleId !== undefined)) {

        query = { ...query, ...payload };
      }
      const { data } = yield call(userService.userList, query);
          
      let { msg, code } = data;
      let userList = [], total = 0;
      if (data.data 
        && data.data.userList 
        && data.data.userList instanceof Array) {
        userList = data.data.userList;
        total = data.data.total;
      }
      if (code === 0) code = -1;
      yield put({ type: "update", payload: { userList, total }});
      yield put({ type: "after", payload: { msg, code, isGetting: true }});
    },

    // 新建用户记录
    *register({ payload }, { call, put }) {
      if (payload.password === undefined 
        || payload.password === "") {
        const formPass = inputPassToFormPass(payload.password);
        payload.password = formPass;
      }
      delete payload.confirm;
      const { data } = yield call(userService.userRegister, payload);
      let { msg, code } = data;
      if (code === 0) msg = USER_REGISTER_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 搜索用户
    *search({ payload }, { call, put, select }) {
      yield put({ type: "update", payload: { isSearching: true, keyword: payload } });
      if (payload.keyword === undefined || payload.keyword === "") { payload.keyword = "" }
      const currentPage = yield select(state => state.userModel.currentPage);
      const pageSize = yield select(state => state.userModel.pageSize);
      let result;
      payload = { ...payload, page: currentPage, size: pageSize }

      if (payload.keyword === "") {
        result = yield call(userService.userList, payload);
      } else {
        result = yield call(userService.search, payload);
      }
      const { data } = result;
      let { msg, code } = data;
      let userList = [], total = 0;
      if (data.data 
        && data.data.userList 
        && data.data.userList instanceof Array) {
          userList = data.data.userList;
          total = data.data.total;
        }
      if (code === 0) { code = -1; }
      yield put({ type: "update", payload: { userList, total } });
      yield put({ type: "after", payload: { msg, code, isGetting: true }});
    },

    // 删除用户记录
    *delete({ payload }, { call, put }) {
      const { data } = yield call(userService.deleteUser, payload);
      let { msg, code } = data;
      if (code === 0) msg = USER_DELETE_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 批量删除用户记录
    *batchDelete({ payload }, { call, put }) {
      const { data } = yield call(userService.batchDelete, { list: payload });
      let { msg, code } = data;
      if (code === 0) msg = USER_DELETE_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 修改用户记录
    *edit({ payload }, { call, put }) {
      const { data } = yield call(userService.editUser, payload);
      let { msg, code } = data;
      if (code === 0) msg = USER_EDIT_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 修改用户记录
    *batchEdit({ payload }, { call, put }) {
      const { data } = yield call(userService.batchEditUser, payload);
      let { msg, code } = data;
      if (code === 0) msg = USER_EDIT_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 任命新部门主管
    *reassign({ payload }, { call, put }) {
      const { data } = yield call(userService.reassign, payload);
      let { msg, code } = data;
      if (code === 0) msg = DEPTHEAD_REASSIGN_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 对数据做出更改后进行的统一更新操作
    // 一般是重新刷新当前的全局表单或者搜索中的局部表单
    *after({ payload: { msg, code, isGetting }}, { put, select }) {
      // 如果要求显示消息提示
      if (code !== undefined && code !== -1) {
        if (code === 0) { success(msg) }
        else { warning(msg) }
      }
      // 如果是获取数据相关的操作就不再重新发起请求了
      if (isGetting !== undefined && isGetting) {
        return;
      }
      const isSearching = yield select(state => state.userModel.isSearching);
      if (isSearching) {
        const keyword = yield select(state => state.userModel.keyword);
        yield put({ type: "search", payload: keyword });
      } else {
        yield put({ type: "list" });
      }
    }
    

  },
  
  // 对状态state进行实际操作reducer
  reducers: {
    // 直接更新传入的所有状态
    update(state, { payload }) {
      return { ...state, ...payload };
    },

  },


};