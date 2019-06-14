import { Dropdown, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';

/**
 * 自行封装的主界面右上角用户头像下拉菜单HeaderDropDown
 * 主要实现的是样式和内容的可定制
 * 
 */
const HeaderDropDown = ({ theme, menu, children }) => {
  // 菜单内容
  const overlay = (
    <Menu theme={theme ? theme : "light"} >
      {menu ? menu.map((item, index) => (
        <Menu.Item 
          style={{ fontSize: "16px" }}
          key={index}
          onClick={item.handler} 
        >
          <Icon type={item.iconType} /> {item.title}
        </Menu.Item>
      )): ""}
    </Menu>
  )

  return (
    <Dropdown 
      overlay={overlay} 
      placement="bottomRight"
    >
      {children}
    </Dropdown>
  );
}

/**
 * 对输入参数的约束
 */
HeaderDropDown.propTypes = {
  menu: PropTypes.array,
}

export default HeaderDropDown;