import { Col, Button, Dropdown, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';

/**
 * 自行封装的表格上方的批量操作下拉菜单ExecDropDown
 * 主要实现的是样式和内容的可定制
 * 
 */
const ExecDropDown = ({ menu, btnType, name }) => {
  // 菜单内容
  const overlay = (
    <Menu>
      {menu ? menu.map((item, index) => (
        <Menu.Item 
          style={{textAlign: "center", ...item.style}}
          key={index}
          onClick={item.handler} 
        >
          {item.title}
        </Menu.Item>
      )): ""}
    </Menu>
  )

  return (
    <Col style={{
      marginTop: "10px"
    }}>
      <Dropdown
        overlay={overlay}
      >
        <Button 
          type={btnType} 
        >
          {name} <Icon type="down" />
        </Button>
      </Dropdown>
    </Col> 
  );
}

/**
 * 对输入参数的约束
 */
ExecDropDown.propTypes = {
  icon: PropTypes.object,
  handler: PropTypes.func,
  btnType: PropTypes.string,
  name: PropTypes.string,
  menu: PropTypes.array,
}

export default ExecDropDown;