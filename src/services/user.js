import request from '../utils/request';
import queryString from 'querystring';

/**
 * 查询是否存在经理用户
 */
export const existManager = () => {
  return request(`/api/v1/manager/exist`, { method: "GET" });
}

/**
 * 注册经理用户
 * @param   {object}  用户的注册信息（密码已加密）
 */
export const managerRegister = (data) => {
  return request(`/api/v1/manager`, { method: "POST", body: data, });
}

/**
 * 注册用户（部门主管、员工）
 * @param   {object}  用户的注册信息（密码已加密）
 */
export const userRegister = (data) => {
  return request(`/api/v1/user`, { method: "POST", body: data, });
}

/**
 * 登录
 * @param   {string}  用户的角色，可以是user或manager
 * @param   {object}  用户的登录信息
 * 
 */
export const login = (role, data) => {
  return request(`/api/v1/${role}/session`, { method: "POST", body: data, });
}

/**
 * 查询登录用户基本信息
 */
export const info = (role) => {
  return request(`/api/v1/${role}`, { method: "GET" });
}

/**
 * 取消登录
 * @param   {string}  用户的角色，可以是user或manager
 */
export const logout = (role) => {
  return request(`/api/v1/${role}/session`, { method: "DELETE" });
}

/**
 * 查询用户列表
 */
export const userList = ({ page, size, deptId, roleId }) => {
  let query
  if (deptId === undefined && roleId === undefined) {
    query = queryString.stringify({ page, size });
  } else {
    query = queryString.stringify({ page, size, deptId, roleId });
  }
  return request(`/api/v1/user?${query}`, { method: "GET" });
}

/**
 * 搜索用户列表
 * @param   {string}  关键词
 */
export const search = ({ keyword, deptId, roleId }) => {
  const query = queryString.stringify({deptId, roleId});
  return request(`/api/v1/user/${keyword}?${query}&page=1&size=10`, { method: "GET" });
}

/**
 * 删除用户记录
 * @param   {number}  要删除的用户id
 */
export const deleteUser = (id) => {
  return request(`/api/v1/user/${id}`, { method: "DELETE" });
}

/**
 * 更新用户记录
 * @param   {number}  要更新的用户信息
 */
export const editUser = (data) => {
  return request(`/api/v1/user`, { method: "PUT", body: data });
}


/**
 * 批量更新用户
 * 
 * @param {object} param 
 */
export const batchEditUser = ({ data, list }) => {
  return request(`/api/v1/user/updates`, { method: "PUT",  body: { list, object: data }});
}

/**
 * 任命新的部门主管
 * 
 * @param {object} param
 */
export const reassign = ({ deptId, newId }) => {
  return request(`/api/v1/user/depthead`, { method: "PUT",  body: { deptId, newId }});
}

/**
 * 批量删除用户
 * 
 * @param {object} data 
 */
export const batchDelete = (data) => {
  return request(`/api/v1/user/deletes`, { method: "POST", body: data, });
}