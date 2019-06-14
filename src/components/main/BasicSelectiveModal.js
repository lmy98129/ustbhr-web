import { Component } from 'react';
import { Form, Table, 
  Col, Row, Button } from 'antd';
import Modal from 'drag-modal';

import BasicHelperIcon from './BasicHelperIcon';
import { warning } from '../../utils/message';

const BasicSelectiveModal = (name) => Form.create({ name })(
  class extends Component {
      /**
     * 按下表单窗口的提交按钮后的处理
     */
    submit = () => {
      const { form, onSubmit } = this.props;
  
      // 表单验证
      form.validateFields((err, values) => {
        // 出现错误，不提交
        if (err) {
          return;
        }

        // 至少有一个填写才能交
        let canUpdate = false;
        for (let item in values) {
          if (values[item] !== null) canUpdate = true;
        }
        
        // 没有一个填写，不能交
        if (!canUpdate) {
          warning("请至少填写一项");
          return;
        }
  
        // 清空当前表单输入，数据已经存到了values参数中
        form.resetFields();

        // 调用父组件传入的onSubmit回调函数
        if (onSubmit !== undefined 
          && typeof onSubmit === "function") {
          onSubmit(values);
        }
      });
    }

    clear = () => {
      const { form } = this.props;
      // 清除窗口中表单的内容
      form.resetFields();
    }

    render() {
      const { title, width, visible, onCancel,
        selectedItems, columns, form, formItemList,
        okText
       } = this.props;

      const { getFieldDecorator } = form;

      return (
        <Modal
          title={title}
          width={width}
          // style={{ top: top !== undefined ? top : 20 }}
          visible={visible}
          zIndex={1700}
          onCancel={onCancel}
          saveDistance={100}
        >
          <Table 
            title={() => <div
              style={{
                fontSize: "16px",
                color: "rgba(0, 0, 0, 0.85)",
                paddingLeft: "5px",
                paddingRight: "5px",
                display: "flex",
                justifyContent: "space-between"
              }}>
                已选{selectedItems.length}个项目
                <BasicHelperIcon searchHelper={
                  <span>批量操作使用帮助：<br/>
                  1. 请在需要对选中用户记录批量修改的项目中输入内容，留空代表该项不需要修改。<br />
                  2. 若误输入到不需更改的项目，请点击“清空已填”按钮清空当前输入的内容，重新填写。<br />
                  3. 使用本界面能够完成员工的部门调动、职位变动、工作职责变动、入职离职批量办理等功能。
                  </span>
                } fontSize="18px" />
              </div>
            }
            dataSource={selectedItems}
            columns={columns}
            scroll={{ x: 1500 }}
            rowKey="id"
            pagination={{
              pageSize: 3
            }}
          />
          <Form
            style={{ 
              margin: "10px auto 10px", 
              width: "90%"
            }}
          >
            <Row>
              {
                formItemList && (formItemList instanceof Array) ? 
                formItemList.map((formItem, index) => 
                  <Col xs={24} sm={24} md={12} lg={8}  key={index}>
                    <Form.Item key={index} label={formItem.label}>
                      {getFieldDecorator(formItem.key ? formItem.key : "", { 
                        rules: formItem.rules ? formItem.rules : [],
                        initialValue: formItem.initialValue ? formItem.initialValue : null
                      })(
                        formItem.content
                      )}
                    </Form.Item>
                  </Col>
                ) : ""
              }
            </Row>
          </Form>
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
              zIndex: 1500,
            }}
          >
            <Button key="clear" onClick={this.clear} style={{ marginRight: 8 }}>
                清空已填
            </Button>
            <Button key="cancel" onClick={onCancel} style={{ marginRight: 8 }}>
                取消
            </Button>
            <Button key="submit" type="primary" onClick={this.submit}>
              {okText ? okText : "确定"}
            </Button>
          </div>
        </Modal>
      )
    }
  }
)

export default BasicSelectiveModal;