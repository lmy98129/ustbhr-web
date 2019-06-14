import request from '../utils/request';

/**
 * 查询部门列表
 */
export const deptList = () => {
  return request(`/api/v1/dept`, { method: "GET" });
}

/**
 * 新建部门记录
 * @param   {object}  新的部门记录
 */
export const register = (data) => {
  return request(`/api/v1/dept`, { method: "POST", body: data, });
}

/**
 * 批量删除部门记录
 * @param   {object}  要删除的部门列表
 */
export const deleteList = (data) => {
  return request(`/api/v1/dept/deletes`, { method: "POST", body: data, });
}

/**
 * 删除部门记录
 * @param   {number}  要删除的部门id
 */
export const deleteDept = (id) => {
  return request(`/api/v1/dept/${id}`, { method: "DELETE" });
}

/**
 * 修改部门记录
 * @param   {object}  要删除的部门列表
 */
export const edit = (data) => {
  return request(`/api/v1/dept`, { method: "PUT", body: data, });
}

/**
 * 搜索部门列表
 * @param   {string}  关键词
 */
export const search = (word) => {
  return request(`/api/v1/dept/${word}`, { method: "GET" });
}