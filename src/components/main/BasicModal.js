import { Component } from 'react';
import { Form, Button } from 'antd';
import Modal from 'drag-modal';

/**
 * 自行封装的表单窗口组件BasicModal
 * 主要功能是实现可定制表单输入组件、表单输入检验、提交操作处理等
 * 并使用drag-modal库组件实现了可拖动功能
 * 
 * @param {string} name 表单的名字
 */
const BasicModal = (name) => Form.create({ name })(

  class extends Component {
    /**
     * 按下表单窗口的提交按钮后的处理
     */
    submit = () => {
      const { form, onSubmit, editKey } = this.props;
  
      // 表单验证
      form.validateFields((err, values) => {
        // 出现错误，不提交
        if (err) {
          return;
        }
  
        // 清空当前表单输入，数据已经存到了values参数中
        form.resetFields();

        // 当前被修改的项目的编号editKey若存在
        // 则将其一并整合到values里面
        if (editKey !== undefined 
          && typeof editKey === "object") {
          values = { ...values, ...editKey };
        }

        // 调用父组件传入的onSubmit回调函数
        if (onSubmit !== undefined 
          && typeof onSubmit === "function") {
          onSubmit(values);
        }
      });
    }

    render() {
      // 获取组件对外暴露的props
      // title：窗口标题
      // okText：窗口确认按钮文字
      // visible：窗口是否可见
      // form：与该组件绑定的表单对象，负责表单格式检验等操作
      // onCancel：取消操作处理函数
      // formItemList：窗口内的表单输入组件
      // formItemLayout：表单布局配置
      // isFormModal：是否是表单窗口（若为否则为展示窗口）
      // children：若为展示窗口，则直接使用传入的子组件
      // showCancel：是否显示取消键
      // width：宽度
      const { title, okText, visible, form, formItemLayout, 
        isFormModal=true, children, showCancel=true, width,
        onCancel, formItemList } = this.props;
      const { getFieldDecorator } = form;

      // 默认的窗口内表单的布局配置
      const defaultFormItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      };

      // 开始渲染
      return(
        <Modal
          visible={visible}
          title={title}
          onCancel={onCancel}
          saveDistance={100}
          footer={[
            showCancel ? <Button key="cancel" onClick={onCancel}>
              取消
            </Button> : "",
            <Button key="submit" type="primary" onClick={this.submit}>
              {okText ? okText : "确定"}
            </Button>,
          ]}
          width={width ? width : 530}
        >
          {isFormModal ? <Form {...(
            formItemLayout ? formItemLayout 
            : defaultFormItemLayout)}>
            {
              formItemList && (formItemList instanceof Array) ? 
              formItemList.map((formItem, index) => 
                <Form.Item key={index} label={formItem.label}>
                  {getFieldDecorator(formItem.key ? formItem.key : "", { 
                    rules: formItem.rules ? formItem.rules : [],
                    initialValue: formItem.initialValue ? formItem.initialValue : null
                  })(
                    formItem.content
                  )}
                </Form.Item>
              ) : ""
            }
          </Form> : children}
        </Modal>
      );
    }
  }
)

export default BasicModal;