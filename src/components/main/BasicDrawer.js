import { Drawer, Form, Button } from 'antd';
import { Component } from 'react';

const BasicDrawer = (name) => Form.create({ name })(
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
      const { 
        formItemLayout, formItemList, form, 
        title, width, visible, onCancel, okText,
        placement="right",
      } = this.props;

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

      return (
        <Drawer
          title={title}
          width={width}
          visible={visible}
          zIndex={1600}
          onClose={onCancel}
          placement={placement}
        >
          {
            <Form {...(
              formItemLayout ? formItemLayout 
              : defaultFormItemLayout)}
              style={{marginBottom: "60px"}}
            >
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
            </Form>
          }
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 1700,
            }}
          >
            <Button key="cancel" onClick={onCancel} style={{ marginRight: 8 }}>
                取消
            </Button>
            <Button key="submit" type="primary" onClick={this.submit}>
              {okText ? okText : "确定"}
            </Button>
          </div>
        </Drawer>
      )
    }
  }
)

export default BasicDrawer;
