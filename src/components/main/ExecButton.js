import { Col, Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * 自行封装的表格上方的操作按钮ExecButton
 * 主要实现的是样式和内容的可定制
 * 
 */
const ExecButton = ({ icon, handler, btnType, name }) => {
  return (
    <Col style={{
      marginTop: "10px"
    }}>
      <Button 
        type={btnType} 
        onClick={handler}
      >
        {icon} {name}
      </Button>
    </Col> 
  );
}

/**
 * 对输入参数的约束
 */
ExecButton.propTypes = {
  icon: PropTypes.object,
  handler: PropTypes.func,
  btnType: PropTypes.string,
  name: PropTypes.string,
}

export default ExecButton;