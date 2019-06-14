import { Layout, Menu, Icon, Row, Col, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import { Component } from 'react';
import { connect } from 'dva';
import Cookies from 'js-cookie';

import logoImg from '../../assets/logo.png'
import defaultAvatar from '../../assets/default_avatar.png';

import Logo from './Logo';
import Avatar from './Avatar';
import HeaderDropDown from './HeaderDropDown';
import { menuConfig } from './MainBasicLayout.config.js';
import styles from './MainBasicLayout.css';

const { Header, Content, Sider, Footer } = Layout;

/**
 * 主要界面布局样式MainBasicLayout
 */
class MainBasicLayout extends Component {

  constructor(props) {
    super(props);
    this.resize.bind(this);
  }

  state = {
    collapsed: false,
  };

  // 切换边栏模式
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  };

  // 若发现浏览器的cookie中没有用户token，
  // 或者本地已经请求不到当前用户信息了
  // 则跳转到登录界面，不准进行进一步操作
  componentDidMount() {
    const { dispatch } = this.props;
    if (Cookies.get("manager_token") === undefined
    && Cookies.get("user_token") === undefined) {
      router.push('/login');
    }

    dispatch({ type: "mainModel/info" });
    
    // 监听窗口大小变化
    window.addEventListener("resize", this.resize);
  }

  // 取消监听窗口大小变化
  componentWillUnmount() {       
    window.removeEventListener('resize',this.resize);
  }

  // 若窗口大小变化，则修改边栏折叠状态
  resize = () => {
    if (document.body.clientWidth < 900) {
      this.setState({
        collapsed: true,
      })      
    }
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch({ type: "mainModel/logout" });
  }

  render() {
    const { children, mainModel, location } = this.props;
    const { collapsed } = this.state;
    const { userInfo, title } = mainModel;

    const menu = menuConfig({ handleLogout: this.handleLogout });

    // 主要使用ant design的Layout组件实现边栏、顶栏和主体内容部分
    return (   
      <LocaleProvider locale={zhCN}>
        <Layout 
          className={styles["basic-layout"]}
        >
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={styles.sider}
          >
            <Logo 
              path={logoImg} 
              collapsed={collapsed}
              title="USTB考勤"
            />
            <Menu 
              theme="dark" 
              mode="inline"
              selectedKeys={[location.pathname]}
            >
              <Menu.Item key="/">
                <Link to="/"/>
                <Icon className={styles["menu-icon"]} type="bar-chart" />
                <span>上班情况</span>
              </Menu.Item>
              <Menu.Item key="/work-shift">
                <Link to="work-shift" />
                <Icon className={styles["menu-icon"]} type="upload" />
                <span>工作安排</span>
              </Menu.Item>
              <Menu.Item key="/tmp-extra-work">
                <Link to="/tmp-extra-work"/>
                <Icon className={styles["menu-icon"]} type="rocket" />
                <span>临时加班管理</span>
              </Menu.Item>
              <Menu.Item key="/dept">
                <Link to="/dept"/>
                <Icon className={styles["menu-icon"]} type="apartment" />
                <span>部门管理</span>
              </Menu.Item>
              <Menu.Item key="/user">
                <Link to="/user"/>
                <Icon className={styles["menu-icon"]} type="user" />
                <span>用户管理</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: collapsed ? "81px" : "200px", height: "auto" }}>
            <Header className={collapsed ? 
                  styles.header+" " +styles["header-collapsed"] 
                  : styles.header}>
                <Row
                  type="flex"
                  justify="space-between"
                  align="middle"
                >
                  <Col className={styles["left-wrapper"]}>
                    <Icon
                      className={styles.trigger}
                      type={collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.toggle}
                    />
                      {collapsed ? title ? title : "标题" : ""}
                  </Col>
                  <HeaderDropDown menu={menu} >
                    <div>
                      <Avatar 
                        name={userInfo ? userInfo.name ? userInfo.name : "" : ""} 
                        path={defaultAvatar}
                      />
                    </div>
                  </HeaderDropDown>
                </Row>
              </Header>
              <Content className={styles.content}>
                {/* 动态传入子组件 */}
                { children }
              </Content>
              <Footer className={styles.footer}>USTB考勤 ©2019 Coded by <a href="https://www.github.com/lmy98129">Blean</a></Footer>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }

}

// 与dva状态中的“main”状态管理器绑定
const MainBasicLayoutWithRouter = withRouter(MainBasicLayout);

export default connect(({ mainModel }) => ({
  mainModel,
}))(MainBasicLayoutWithRouter);