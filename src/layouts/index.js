import MainBasicLayout from '../components/layout/MainBasicLayout';
import LoginBasicLayout from '../components/layout/LoginBasicLayout';

/**
 * 全局样式，可以通过不同路由输出不同的全局layout
 */
const BasicLayout = ({ location, children }) => {

  switch(location.pathname) {
    case '/login':
    case '/register':
      // 若进入的是登录界面，则切换到LoginBasicLayout
      return (
      <LoginBasicLayout>
        { children }
      </LoginBasicLayout>
      );
    default:
      // 默认进入MainBasicLayout
      return (
        <MainBasicLayout>
          { children }
        </MainBasicLayout>
      );
  }

}

export default BasicLayout;
