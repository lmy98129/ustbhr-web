import { Form, Icon, Input, Button, Select } from 'antd';
import { Component } from 'react';
import styles from './LoginWidget.css';
import router from 'umi/router'
import { connect } from 'dva';
import { success, warning } from '../../utils/message';

const { Option } = Select;

/**
 * 登录组件
 */
class LoginWidget extends Component {

  /**
   * react组件生命周期
   * 当页面组件被挂在到DOM树上时
   */
  componentDidMount() {
    // 添加回车事件监听函数，实现回车即提交
    document.body.addEventListener("keyup", (e) => {
      if(window.event) {
        e = window.event;
      }
      let code = e.charCode || e.keyCode;
      // 若获取到的是回车
      if (code === 13) {
        this.handleSubmit();
      }
    })
  }

  /**
   * react组件生命周期
   * 当页面组件从DOM树上卸载时
   */
  componentWillUnmount() {
    // 取消对回车键的监听
    document.body.removeEventListener("keyup", ()=>{});
  } 

    /**
   * react组件生命周期，
   * 当组件参数props被修改时
   * 
   * @param {object} nextProps  将要被修改成的props
   */
  componentWillReceiveProps(nextProps) {
    const { loginMessage, loginCode } = nextProps.loginModel;
    const { dispatch } = this.props;

    if (loginCode === 0) {
      success("登录成功，正在进入系统主界面");

      dispatch({ type: "loginModel/clearLoginMessage" });

      // 2秒之后跳转到系统主界面
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } else if (loginCode !== -1){
      warning(loginMessage);
      dispatch({ type: "loginModel/clearLoginMessage" });
    }
  }
  
  /**
   * 点击“登录”按钮后的操作
   */
  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    // 表单验证，如果未出现违反表单规则的情况才允许登录
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({ type: "loginModel/login", payload: values });
      }
    });
  };

  render() {
    // getFieldDecorator能够将传入的多种类型输入框进行表单规则附加
    // 附加的规则能够实时监听输入内容是否合规
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={styles["login-form"]} style={{marginTop: "30px"}}>
        <Form.Item>
          {getFieldDecorator('uid', {
            rules: [{ required: true, message: '请输入您的用户名!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="工号/姓名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('role', {
            rules: [{ required: true, message: "请选择您的登录身份！" }]
          })(
            <Select 
              placeholder="请选择您的身份"
            >
              <Option value="1">经理</Option>
              <Option value="2">部门主管</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles["login-form-button"]}>
            登录
          </Button>
          <a className={styles["login-form-forgot"]} href="/">
            忘记密码
          </a>
        </Form.Item>
      </Form>
    );
  }
}

// 将表单规则控制器与组件进行绑定
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginWidget);

// 与dva状态中的“login”状态管理器绑定
export default connect(({ loginModel }) => ({
  loginModel,
}))(WrappedNormalLoginForm);