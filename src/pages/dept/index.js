import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { warning, deleteConfirm } from '../../utils/message';

import BasicTable from '../../components/main/BasicTable';
import BasicInquiryBar from '../../components/main/BasicInquiryBar';
import BasicModal from '../../components/main/BasicModal';
import ExecDropDown from '../../components/main/ExecDropdown';

import { columnsConfig, formItemList, menuConfig } from './config';

const CreateModal = BasicModal("create_dept");
const EditModal = BasicModal("edit_dept");
const InquiryBar = BasicInquiryBar("dept_inquiry");

/**
 * 部门管理页面
 */
class Dept extends Component {

  // 组件内部状态
  state = {
    // 创建部门记录窗口是否打开
    createModalVisible: false,
    // 编辑部门记录窗口是否打开
    editModalVisible: false,
    // 正在编辑的项目
    editingItem: {},
    // 表格中选中的项目
    selectedIds: [],
  }

  /**
   * react组件生命周期
   * 当页面组件被挂在到DOM树上时
   */
  componentDidMount() {
    const { dispatch } = this.props;
    // 设置页面标题
    const title = "部门管理"
    dispatch({ type: "mainModel/title", payload: { title } })

    // 获取组件
    dispatch({ type: "deptModel/list" });

  }

  /**
   * 显示创建部门记录窗口
   */
  showCreateModal = () => {
    this.setState({ createModalVisible: true });
  }

  /**
   * 隐藏创建部门记录窗口
   */
  hideCreateModal = () =>{
    const form = this.createModalFormRef.props.form;
    // 清除窗口中表单的内容
    form.resetFields();
    this.setState({ createModalVisible: false });
  }

  /**
   * 创建部门记录表单提交时的处理
   * 
   * @param {object} data 表单的数据
   */
  handleCreate = (data) => {
    const { dispatch } = this.props;
    // 隐藏窗口
    this.setState({ createModalVisible: false });
    // 发起请求
    dispatch({ type: "deptModel/register", payload: data });
  }

  /**
   * 保存窗口的引用
   * 作用是父组件能够访问子组件的内部方法
   * 
   * @param {object} formRef 窗口引用
   */
  saveCreateModalFormRef = formRef => {
    this.createModalFormRef = formRef;
  }

  /**
   * 显示编辑部门记录窗口
   * 
   * @param {object} editingItem 被编辑的项目
   */
  showEditModal = (editingItem) => {
    this.setState({ editModalVisible: true, editingItem });
  }

  /**
   * 隐藏编辑部门记录窗口
   */
  hideEditModal = () =>{
    const form = this.editModalFormRef.props.form;
    form.resetFields();
    this.setState({ editModalVisible: false });
  }

  /**
   * 编辑部门记录表单提交时的处理
   * 
   * @param {object} data 表单的数据
   */
  handleEdit = (data) => {
    const { dispatch } = this.props;
    this.setState({ editModalVisible: false });
    dispatch({ type: "deptModel/edit", payload: data });
  }

  /**
   * 保存窗口的引用
   * 作用是父组件能够访问子组件的内部方法
   * 
   * @param {object} formRef 窗口引用
   */
  saveEditModalFormRef = formRef => {
    this.editModalFormRef = formRef;
  }

  /**
   * 删除部门记录表单提交时的处理
   * 
   * @param {object} data 表单的数据
   */
  handleDelete = (data) => {
    deleteConfirm({
      title: "删除部门记录",
      content: <span>确认删除该条部门记录？该操作不可恢复。<br/>
        注意：删除后，所属部门的员工、部门主管等记录需要手动重新设置新部门。</span>,
      handler: () => {
        const { dispatch } = this.props;
        dispatch({ type: "deptModel/delete", payload: data.id });
      }
    })
  }

  /**
   * 批量删除部门记录表单提交时的处理
   */
  handleBatchDelete = () => {
    const { selectedIds } = this.state;
    if (selectedIds === undefined 
      || selectedIds.length <= 0) {
        warning("请至少选择一项");
        return;
    }

    deleteConfirm({
      title: "删除部门记录",
      content: <span>确认删除所选部门记录？该操作不可恢复。<br/>
        注意：删除后，所属部门的员工、部门主管等记录需要手动重新设置新部门。</span>,
      handler: () => {
        const { dispatch } = this.props;
        dispatch({ type: "deptModel/batchDelete", payload: selectedIds });
      }
    })

  }

  /**
   * 表格选中项目改变时的处理
   */
  onTableSelectChange = (keys, rows) => {
    this.setState({ selectedIds: keys });
  }

  /**
   * 查询处理函数
   */
  onSearch = (data) => {
    const { dispatch } = this.props;
    const { keyword } = data;
    if (keyword === undefined || keyword === "") {
      return;
    }
    dispatch({ type: "deptModel/search", payload: keyword });
  }

  /**
   * 取消查询
   */
  onCancelSearch = () => {
    const { dispatch } = this.props;
    dispatch({ type: "deptModel/list" });
  }

  render() {
    // 从props获取的model中
    // 存储的部门列表和是否加载中状态
    const { deptModel: { deptList }, loading } = this.props;
    // 组件内部state状态获取
    const { 
      createModalVisible, 
      editModalVisible, 
      editingItem,
    } = this.state;


    // 将表格中的“操作”列输入到表格配置生成函数中，生成表格配置
    const columns = columnsConfig({ 
      onEdit: this.showEditModal, 
      onDelete: this.handleDelete, 
    });

    // 将批量操作函数输入到下拉菜单生成函数中，生成菜单配置
    const menu = menuConfig({ 
      handleDelete: this.handleBatchDelete 
    })

    // 开始渲染
    return (
      <Fragment>
        <InquiryBar 
          searchHint="请输入名称、代号等关键字"
          onSearch={this.onSearch}
          onCancel={this.onCancelSearch}
        />
        <BasicTable
          columns={columns}
          dataSource={deptList}
          scroll={{ x: 700 }}
          rowKey="id"
          createHandler={this.showCreateModal}
          loading={loading.models.deptModel}
          rowSelection={{
            onChange: this.onTableSelectChange,
          }}
        >
          <ExecDropDown 
            name="批量操作" 
            menu={menu} 
          />
        </BasicTable>

        <CreateModal 
          title="新建部门记录"
          wrappedComponentRef={this.saveCreateModalFormRef}
          visible={createModalVisible}
          onSubmit={this.handleCreate}
          onCancel={this.hideCreateModal}
          formItemList={formItemList()}
          okText="提交"
        />
        <EditModal 
          title="编辑部门记录"
          wrappedComponentRef={this.saveEditModalFormRef}
          visible={editModalVisible}
          onSubmit={this.handleEdit}
          onCancel={this.hideEditModal}
          editKey={{id: editingItem.id}}
          formItemList={formItemList(editingItem)}
        />
      </Fragment>
    )
  }
}

// 与各状态管理器的连接
export default connect(({ mainModel, deptModel, loading }) => ({ 
  mainModel, deptModel, loading,
 }))(Dept);