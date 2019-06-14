/**
 * 批量操作的下拉菜单配置
 * 主要是配置菜单项目名称和点击后的处理函数
 * 
 * @param {object} param  传入的参数对象
 */
export const menuConfig = ({ handleLogout }) => [
  {
    title: "退出登录",
    iconType: "logout",
    handler: handleLogout,
  }
]