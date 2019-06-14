import request from '../utils/request';

/**
 * 查询部门列表
 */
export const list = () => {
  return request(`/api/v1/role`, { method: "GET" });
}