import { Component } from 'react';
import { Form, Button, Input } from 'antd';
import styles from './BasicInquiryBar.css';
import BasicHelperIcon from './BasicHelperIcon';

/**
 * 自行封装的查询栏BasicInquiryBar
 * 主要功能是实现可定制表单输入组件、表单输入检验、查询操作处理等
 * 
 */
class BasicInquiryBar extends Component {

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
        this.inquiryHandler();
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

  inquiryHandler = () => {
    const { form, onSearch } = this.props;
  
    // 表单验证
    form.validateFields((err, values) => {
      // 出现错误，不提交
      if (err) {
        return;
      }

      // 调用父组件传入的onSearch回调函数
      if (onSearch !== undefined 
        && typeof onSearch === "function") {
        onSearch(values);
      }
    });
  }

  cancelHandler = () => {
    const { form, onCancel } = this.props;
    form.resetFields();

    if (onCancel !== undefined
      && typeof onCancel === "function") {
        onCancel();
    }
  }
  
  render() {
    // 获取组件对外暴露的props
    // formItemList：除了默认输入框以外的其他表单输入组件
    // onCancel：取消操作处理函数
    // searchHint：搜索提示
    // form：与该组件绑定的表单对象，负责表单格式检验等操作
    // searchBarWidth: 搜索条的宽度，默认为260px
    // searchHelper: 查询帮助按钮弹出的提示
    const { form, formItemList, searchHint, searchBarWidth, searchHelper } = this.props

    // 获取form对象中的表单检验装饰器
    const { getFieldDecorator } = form;

    // 开始渲染
    return (
      <Form layout="inline" >
        <Form.Item label="关键字" >
          {getFieldDecorator(`keyword`, {
            rules: [{ type: "string", min: 2, message: "至少输入2个及以上字符" }]
          })(
            <Input.Search 
              style={{
                width: searchBarWidth ? searchBarWidth : "260px"
              }}
              className={styles.search}
              placeholder={searchHint} 
            />
          )}
        </Form.Item>
        {     
          // 使用循环将传入的表单输入（如输入框、按钮）渲染出来
          formItemList && (formItemList instanceof Array) ? 
          formItemList.map((formItem, index) => 
            <Form.Item key={index} label={formItem.label} >
              {getFieldDecorator(formItem.key)(
                formItem.content
              )}
            </Form.Item>
          ) : "" 
        }
        <Form.Item>
          <Button onClick={this.cancelHandler} >
            取消
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ marginLeft: "15px" }}
            onClick={this.inquiryHandler}
          >
            查询
          </Button>
          {
            searchHelper !== undefined && searchHelper !== "" ?
            <BasicHelperIcon searchHelper={searchHelper} />: ""
          }
        </Form.Item>
      </Form>
    )
  }
}

// 与创建表单函数的连接
const WrappedBasicInquiryBar = (name) => Form.create({ name })(BasicInquiryBar);

export default WrappedBasicInquiryBar;