
export const dva = {
  config: {
    onError(err, dispatch, { key }) {
      err.preventDefault();

      // 出错了，全局提示
    },
  },
};
