import { Layout, Row, Col } from "antd";

import styles from './LoginBasicLayout.css';

/**
 * 登录界面布局样式LoginBasicLayout
 */
const LoginBasicLayout = ({ children }) => {
  // 该样式较为简单，主要是对动态传人的子组件位置进行横纵向居中
  // 因此使用了Row和Col组件进行两次居中操作
  return (
    <Layout className={styles.basicLayout}>
      <Row 
        className={styles.mainRow}
        type="flex" 
        justify="space-around" 
        align="middle"
      >
        <Col className={styles.mainCol}>
          { children }
        </Col>
      </Row>
    </Layout>
  );
}

export default LoginBasicLayout;