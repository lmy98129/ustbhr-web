import { Fragment } from 'react';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import router from 'umi/router';
import { Component } from 'react';

import LoginWidget from '../../components/login/LoginWidget';
import Logo from '../../components/layout/Logo';
import LogoCircleImg from '../../assets/logo_circle.png';
import styles from './Login.css'

/**
 * 登录页面
 */
class Login extends Component {

  componentDidMount() {
    document.title = "登录";

    const { dispatch, loginModel } = this.props;
    // 发起dva状态更改，以查询当前系统是否存在经理，详细代码在/src/models/login.js中
    // 若不存在，则将跳转至注册界面
    // 若存在，则留在当前页面进行登录
    const { isCheckedExistManager } = loginModel;
    if (!isCheckedExistManager) {
      dispatch({ type: "loginModel/existManager" } );
    }
  
    if ((Cookies.get("manager_token") !== undefined
    || Cookies.get("user_token") !== undefined)) {
      router.push("/");
    }
  }

  render() {
    // 登录界面，渲染Logo，并调用了自行封装的可复用登录控件LoginWidget
    return (
      <Fragment>
        <div className={styles["login-wrapper"]}>
          <Logo path={LogoCircleImg} color="rgba(0, 0, 0, 0.65)" weight="normal"
            titleMaxWidth="none"
            wrapperMaxWidth="250px"
            wrapperMargin="14px auto"
            title="USTB考勤管理系统"
          />
          <LoginWidget />
        </div>
      </Fragment>
    );
  }

}

// 与dva状态中的“login”状态管理器绑定
export default connect(({ loginModel }) => ({
  loginModel
}))(Login);
