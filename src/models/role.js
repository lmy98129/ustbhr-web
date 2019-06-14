import * as roleService from '../services/role';

export default {
  namespace: 'roleModel',
  // 状态初值
  state: { 
    roleList: [],
  },

  // 异步操作effect，主要是网络请求等
  effects: {
    // 查询用户列表
    *list(_, { call, put }) {
      const { data } = yield call(roleService.list);
      let roleList = [];
      if (data.data && data.data instanceof Array) {
        roleList = data.data;
      }
      yield put({ type: "update", payload: { roleList }});
    },
  },

  // 对状态state进行实际操作reducer
  reducers: {
    // 直接更新传入的所有状态
    update(state, { payload }) {
      return { ...state, ...payload };
    },

  },
}