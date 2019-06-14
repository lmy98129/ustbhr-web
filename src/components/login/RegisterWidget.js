import { Component } from 'react';
import styles from './RegisterWidget.css';
import { connect } from 'dva'
import router from 'umi/router'
import { success, warning } from '../../utils/message';

import { Form, Input, Checkbox, Button, Modal } from 'antd';

/**
 * 注册组件
 */
class RegistrationForm extends Component {

  // 组件内部状态
  state = {
    // confirmDirty是后一个密码框中是否有值的标记
    confirmDirty: false,
  };

  /**
   * react组件生命周期，
   * 当组件参数props被修改时
   * 
   * @param {object} nextProps  将要被修改成的props
   */
  componentWillReceiveProps(nextProps) {
    const { registerMessage, registerCode } = nextProps.loginModel;
    const { dispatch } = this.props;

    if (registerCode === 0) {
      success("注册成功，正在进入登录界面");
      dispatch({ type: "loginModel/clearRegisterMessage" });

      // 2秒之后跳转到登录界面
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } else if (registerCode !== -1){
      warning(registerMessage);
      dispatch({ type: "loginModel/clearRegisterMessage" });
    }
  }

  /**
   * 按下注册按钮后的表单规则检查
   */
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;

    // scroll可以用在当表单较长的时候，能够自动滚动到相应的出错位置
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.agreement === undefined || !values.agreement) {
          Modal.warning({
            title: "提示",
            content: "请您在同意《用户服务条款》后再进行注册。",
            okText: "确定"
          });
          return;
        }
        dispatch({type: "loginModel/register", payload: values});
      }
    });
  };


  /**
   * onblur事件的代码
   * 当用户离开后一个密码输入框时执行的代码
   * 这段代码的意思是当用户离开后一个密码框后，查看是否有值，若存在值则设定confirmDirty为true
   */
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  /**
   * 当后一个密码框输入时与前一个密码之间的比较
   */
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致，请重新输入！');
    } else {
      callback();
    }
  };

  /**
   * 当后一个密码框中有值时，为前一个密码框附上必须输入密码（force: true）的条件
   */
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    // 当前密码框有值value且confirmDirty为true表示后一个密码框中有值时
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {

    // getFieldDecorator能够将传入的多种类型输入框进行表单规则附加
    // 附加的规则能够实时监听输入内容是否合规
    const { getFieldDecorator } = this.props.form;

    // 使各输入框和提示语保持对齐
    // xs：页面宽度＜576px时，元素占用的宽度
    // sm：页面宽度≥576px时，元素占用的宽度
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    // 最后几项的布局对齐
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 6,
        },
      },
    };

    const btnFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 6,
        },
      },
    }

    return (
      <Form 
        className={styles["register-wrapper"]} 
        {...formItemLayout} 
        onSubmit={this.handleSubmit}>
        <Form.Item label="工号">
          {getFieldDecorator('userId', {
            rules: [
              {
                required: true,
                message: '请输入您的工号！',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="姓名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入您的姓名！',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="密码" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码！',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="确认密码" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请确认您的密码！',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              我已阅读并同意 <a href="/">《用户服务条款》</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item {...btnFormItemLayout}>
          <Button   
            type="primary" 
            htmlType="submit"
            block
          >
            注册
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

// 与dva状态中的“login”状态管理器绑定
export default connect(({ loginModel }) => ({
  loginModel,
}))(WrappedRegistrationForm);