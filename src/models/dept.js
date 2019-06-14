import * as deptService from '../services/dept';
import { warning, success } from '../utils/message';

const DEPT_REGISTER_SUCCESS = "新建部门记录成功";
const DEPT_EDIT_SUCCESS = "修改部门记录成功";
const DEPT_DELETE_SUCCESS = "删除部门记录成功";

// 部门管理界面对应的状态管理器
export default {
  namespace: 'deptModel',
  // 状态初值
  state: { 
    deptList: [],
    isSearching: false,
    keyword: "",
  },

  // 异步操作effect，主要是网络请求等
  effects: {

    // 查询部门列表信息
    *list(_, { call, put }) {
      yield put({ type: "update", payload: { isSearching: false, keyword: "" } });
      const { data } = yield call(deptService.deptList);
      let { msg, code } = data;
      let deptList = [];
      if (data.data !== undefined && data.data instanceof Array) {
        deptList = data.data;
      }
      if (code === 0) { code = -1; }
      yield put({ type: "update", payload: { deptList }});
      yield put({ type: "after", payload: { msg, code, isGetting: true }});
    },

    // 新建部门记录
    *register({ payload }, { call, put }) {
      const { data } = yield call(deptService.register, payload);
      let { msg, code } = data;
      if (code === 0) msg = DEPT_REGISTER_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 修改部门记录
    *edit({ payload }, { call, put }) {
      const { data } = yield call(deptService.edit, payload);
      let { msg, code } = data;
      if (code === 0) msg = DEPT_EDIT_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 删除部门记录
    *delete({ payload }, { call, put }) {
      const { data } = yield call(deptService.deleteDept, payload);
      let { msg, code } = data;
      if (code === 0) msg = DEPT_DELETE_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 批量删除部门记录
    *batchDelete({ payload }, { call, put }) {
      const { data } = yield call(deptService.deleteList, { list: payload});
      let { msg, code } = data;
      if (code === 0) msg = DEPT_DELETE_SUCCESS;
      yield put({ type: "after", payload: { msg, code }});
    },

    // 查询部门记录
    *search({ payload }, { call, put }) {
      yield put({ type: "update", payload: { isSearching: true, keyword: payload } });
      const { data } = yield call(deptService.search, payload);
      let { msg, code } = data;
      let deptList = [];
      if (code === 0) { code = -1; }
      if (data.data !== undefined && data.data instanceof Array) deptList = data.data;
      yield put({ type: "update", payload: { deptList } });
      yield put({ type: "after", payload: { msg, code, isGetting: true }});
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
      const isSearching = yield select(state => state.deptModel.isSearching);
      if (isSearching) {
        const keyword = yield select(state => state.deptModel.keyword);
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