import { connect } from 'dva'
import { Component, Fragment } from 'react';
import { Icon } from 'antd'
import styles from './User.css';
import { warning, deleteConfirm, normalConfirm } from '../../utils/message';

import BasicTable from '../../components/main/BasicTable';
import ExecButton from '../../components/main/ExecButton';
import ExecDropDown from '../../components/main/ExecDropdown';
import BasicInquiryBar from '../../components/main/BasicInquiryBar';
import BasicModal from '../../components/main/BasicModal';
import BasicDrawer from '../../components/main/BasicDrawer';
import BasicSelectiveModal from '../../components/main/BasicSelectiveModal';

import { formItemListConfig, extraFormItemListConfig, inquiryBarDropDownConfig, detailModalItemListConfig,
  columnsConfig, formItemLayout, menuConfig, searchHelper, batchEditFormItemConfig,
  fileUploadModalItemListConfig, } from './config';

const InquiryBar = BasicInquiryBar("user_inquiry");
const DetailModal = BasicModal("user_detail");
const EditDrawer = BasicDrawer("edit_user");
const CreateDrawer = BasicDrawer("create_user");
const BatchEditModal = BasicSelectiveModal("batch_edit_user");
const FileUploadModal = BasicModal("file_upload");

class User extends Component {

  state = {
    // 创建用户记录窗口是否打开
    createModalVisible: false,
    // 编辑用户记录窗口是否打开
    editModalVisible: false,
    // 用户详情窗口是否打开
    detailModalVisible: false,
    // 批量修改窗口是否打开
    batchEditModalVisible: false,
    // 文件上传窗口是否打开
    fileUploadModalVisible: false,
    // 正在编辑的项目
    editingItem: {},
    // 表格中选中的项目
    selectedIds: [],
  }

  componentDidMount() {
    const { dispatch, 
      deptModel: { deptList },
      roleModel: { roleList },
    } = this.props;

    const title = "用户管理"
    dispatch({ type: "mainModel/title", payload: { title } });

    dispatch({ type: "userModel/list"});

    if (deptList === undefined || deptList.length <= 0) {
      dispatch({ type: "deptModel/list" });
    }

    if (roleList === undefined || roleList.length <= 0) {
      dispatch({ type: "roleModel/list" });
    }

  }

  /**
   * 显示创建用户记录窗口
   */
  showCreateModal = () => {
    this.setState({ createModalVisible: true });
  }

  /**
   * 隐藏创建用户记录窗口
   */
  hideCreateModal = () =>{
    const form = this.createModalFormRef.props.form;
    // 清除窗口中表单的内容
    form.resetFields();
    this.setState({ createModalVisible: false });
  }

  /**
   * 创建用户记录表单提交时的处理
   * 
   * @param {object} data 表单的数据
   */
  handleCreate = (data) => {
    const { dispatch } = this.props;
    // 隐藏窗口
    this.setState({ createModalVisible: false });
    // 发起请求
    dispatch({ type: "userModel/register", payload: data });

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
    const form = this.createModalFormRef.props.form;
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
    const form = this.createModalFormRef.props.form;
    // 当前密码框有值value且confirmDirty为true表示后一个密码框中有值时
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  /**
   * 查询处理函数
   */
  onSearch = (data) => {
    const { dispatch } = this.props;
    dispatch({ type: "userModel/update", payload: { currentPage: 1 } });
    if (data.deptId !== undefined && typeof data.deptId === 'string') {
      data.deptId = parseInt(data.deptId);
    }
    if (data.roleId !== undefined && typeof data.roleId === 'string') {
      data.roleId = parseInt(data.roleId);
    }
    dispatch({ type: "userModel/search", payload: data });
  }

  /**
   * 取消查询
   */
  onCancelSearch = () => {
    const { dispatch } = this.props;
    dispatch({ type: "userModel/update", payload: { currentPage: 1 } });
    
    dispatch({ type: "userModel/list" });
  }

  /**
   * 批量删除员工记录表单提交时的处理
   */
  handleBatchDelete = () => {
    const { selectedIds } = this.state;
    if (selectedIds === undefined 
      || selectedIds.length <= 0) {
        warning("请至少选择一项");
        return;
    }

    deleteConfirm({
      title: "删除用户记录",
      content: <span>确认删除所选用户记录？该操作不可恢复。</span>,
      handler: () => {
        const { dispatch } = this.props;
        dispatch({ type: "userModel/batchDelete", payload: selectedIds });
      }
    })
  }

  /**
   * 批量修改员工记录
   */
  handleBatchEdit = (data) => {
    const { dispatch } = this.props;
    const { selectedIds } = this.state;
    this.setState({ batchEditModalVisible: false });
    const { form } = this.batchEditModalFormRef.props;
    form.resetFields();

    if ( data.registerDate && data.registerDate.format ) {
      data.registerDate = data.registerDate.format("YYYY-MM-DD HH:mm");
    }
    if (data.unregisterDate && data.unregisterDate.format ) {
      data.unregisterDate = data.unregisterDate.format("YYYY-MM-DD HH:mm");
    }
    
    dispatch({ type: "userModel/batchEdit", payload: { data, list: selectedIds } });
  }

  /**
   * 表格选中项目改变时的处理
   */
  onTableSelectChange = (keys, rows) => {
    this.setState({ selectedIds: keys });
  }

  /**
   * 显示编辑用户记录窗口
   * 
   * @param {object} editingItem 被编辑的项目
   */
  showEditModal = (editingItem) => {
    this.setState({ editModalVisible: true, editingItem });
  }

  /**
   * 隐藏编辑用户记录窗口
   */
  hideEditModal = () =>{
    const form = this.editModalFormRef.props.form;
    form.resetFields();
    this.setState({ editModalVisible: false });
  }

  /**
   * 编辑用户记录表单提交时的处理
   * 
   * @param {object} data 表单的数据
   */
  handleEdit = (data) => {
    const { dispatch } = this.props;
    this.setState({ editModalVisible: false });
    if ( data.registerDate && data.registerDate.format ) {
      data.registerDate = data.registerDate.format("YYYY-MM-DD HH:mm");
    }
    if (data.unregisterDate && data.unregisterDate.format ) {
      data.unregisterDate = data.unregisterDate.format("YYYY-MM-DD HH:mm");
    }
    if (data.birthdate && data.birthdate.format ) {
      data.birthdate = data.birthdate.format("YYYY-MM-DD");
    }
    dispatch({ type: "userModel/edit", payload: data });
  }

  /**
   * 删除用户记录表单提交时的处理
   * 
   * @param {object} data 表单的数据
   */
  handleDelete = (data) => {
    deleteConfirm({
      title: "删除用户记录",
      content: <span>确认删除该条用户记录？该操作不可恢复。</span>,
      handler: () => {
        const { dispatch } = this.props;
        dispatch({ type: "userModel/delete", payload: data.id });
      }
    })
  }

  /**
   * 显示用户详细信息的窗口
   * 
   * @param {object} editingItem 被编辑的项目
   */
  showDetailModal = (editingItem) => {
    this.setState({ detailModalVisible: true, editingItem });
  }

  /**
   * 隐藏编辑用户记录窗口
   */
  hideDetailModal = () =>{
    const form = this.editModalFormRef.props.form;
    form.resetFields();
    this.setState({ detailModalVisible: false });
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
   * 显示批量修改用户记录窗口
   */
  showBatchEditModal = () => {
    const { selectedIds } = this.state;
    if (selectedIds === undefined 
      || selectedIds.length <= 0) {
        warning("请至少选择一项");
        return;
    }
    this.setState({ batchEditModalVisible: true });
  }

  /**
   * 隐藏批量修改用户记录窗口
   */
  hideBatchEditModal = () => {
    const form = this.batchEditModalFormRef.props.form;
    // 清除窗口中表单的内容
    form.resetFields();
    this.setState({ batchEditModalVisible: false });
  }

  /**
   * 保存窗口的引用
   * 作用是父组件能够访问子组件的内部方法
   * 
   * @param {object} formRef 窗口引用
   */
  saveBatchEditModalRef = formRef => {
    this.batchEditModalFormRef = formRef;
  }

  /**
   * 翻页
   * 
   */
  handlePageChange = (pagination) => {
    const { dispatch, userModel: { isSearching, keyword } } = this.props;
    // 修改当前页数
    dispatch({ type: "userModel/update", payload: { currentPage: pagination.current } });
    // 正在搜索则使用这个翻页
    if (isSearching) {
      dispatch({ type: "userModal/search", payload: keyword });
    } else {
      dispatch({ type: "userModel/list" });
    }
  }

  /**
   * 任命主管
   * 
   */
  handleReassignDeptHeader = () => {
    const { userModel: { userList } } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds === undefined 
      || selectedIds.length <= 0) {
      warning("请选择一项");
      return;
    } else if (selectedIds.length > 1) {
      warning("请只选择一项");
      return;
    }

    const selectedItems = userList.filter(item => selectedIds.indexOf(item.id) >= 0);
    if (selectedIds.length <= 0) {
      warning("该项目无效");
      return;
    }
    const selectedItem = selectedItems[0];
    if (selectedItem.roleId === 1) {
      warning("用户已经是部门主管");
      return;
    }

    // 弹出确认框
    normalConfirm({
      title: "任命主管",
      content: <span>{`“${selectedItem.name}”将被任命为“${selectedItem.department}”的新部门主管。`}<br />
                请确认以上信息后再点击“确定”</span>,
      handler: () => {
        const { dispatch } = this.props;
        dispatch({ type: "userModel/reassign", payload: { deptId: selectedItem.deptId, newId: selectedItem.id } });
      }
    })

  }

  /**
   * 显示文件上传窗口
   * 
   */
  hideFileUploadDetailModal = () => {
    this.setState({ fileUploadModalVisible: false });
    const { dispatch, userModel: { isSearching, keyword } } = this.props;
    // 正在搜索则使用这个翻页
    if (isSearching) {
      dispatch({ type: "userModal/search", payload: keyword });
    } else {
      dispatch({ type: "userModel/list" });
    }
  }

  /**
   * 隐藏文件上传窗口
   * 
   */
  showFileUploadDetailModal = () => {
    this.setState({ fileUploadModalVisible: true });
  }

  /**
   * 当页面长度变化时
   * 
   */
  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    // 修改页面长度，一样会触发翻页
    dispatch({ type: "userModel/update", payload: { pageSize } });
  }

  render() {
    const { 
      loading,
      deptModel: { deptList }, 
      userModel: { userList, total, pageSize }, 
      roleModel: { roleList },
    } = this.props;

    const {
      createModalVisible,
      detailModalVisible,
      editModalVisible,
      batchEditModalVisible,
      fileUploadModalVisible,
      editingItem,
      selectedIds,
    } = this.state

    const inquiryBarDropDown = inquiryBarDropDownConfig({ 
      deptList, styles, roleList
    });

    const menu = menuConfig({ 
      handleDelete: this.handleBatchDelete,
      handleEdit: this.showBatchEditModal,
    })

    const createFormItemList = formItemListConfig({
      validateToNextPassword: this.validateToNextPassword,
      compareToFirstPassword: this.compareToFirstPassword,
      handleConfirmBlur: this.handleConfirmBlur,
      deptList, styles, roleList, editingItem: {}
    })

    const editBaseFormItemList = formItemListConfig({
      validateToNextPassword: this.validateToNextPassword,
      compareToFirstPassword: this.compareToFirstPassword,
      handleConfirmBlur: this.handleConfirmBlur,
      deptList, styles, roleList, editingItem,
    })

    const editExtraFormItemList = extraFormItemListConfig({ 
      editingItem 
    })

    const editFormItemList = editBaseFormItemList
      .concat(editExtraFormItemList)
      .filter(item => item.key !== 'password' && item.key !== 'confirm');

    const columns = columnsConfig({
      onEdit: this.showEditModal, 
      onDelete: this.handleDelete, 
      onDetail: this.showDetailModal,
    })

    const detailModalItemList = detailModalItemListConfig({
      editingItem
    })

    const batchDetailModalFormItemList = batchEditFormItemConfig({
      deptList, roleList, styles,
    })

    const fileUploadModalItemList = fileUploadModalItemListConfig({
      action: '/api/v1/user/uploads',
    }, this.hideFileUploadDetailModal)

    return (
      <Fragment>
        <InquiryBar 
          searchBarWidth="300px"
          maxWidth="1000px"
          onSearch={this.onSearch}
          onCancel={this.onCancelSearch}
          searchHint="请输入姓名、工号数字、职责等关键字"
          formItemList={inquiryBarDropDown}
          searchHelper={searchHelper}
        />
        <BasicTable
          columns={columns}
          dataSource={userList ? userList : []}
          scroll={{ x: 1500 }}
          rowKey="id"
          loading={loading.models.userModel}
          createHandler={this.showCreateModal}
          rowSelection={{
            onChange: this.onTableSelectChange,
          }}
          total={total}
          onChange={this.handlePageChange}
          showSizeChanger={true}
          pageSize={pageSize}
          onShowSizeChange={this.onShowSizeChange}
        >
          <ExecDropDown 
            name="批量操作" 
            menu={menu} 
          />
          <ExecButton 
            name="任命主管" 
            handler={this.handleReassignDeptHeader}
          />
          <ExecButton 
            name="文件导入" 
            icon={<Icon type="cloud-upload" style={{ fontSize: "15px" }} />}
            handler={this.showFileUploadDetailModal}
          />
        </BasicTable>  
        <CreateDrawer 
          title="新建用户记录"
          wrappedComponentRef={this.saveCreateModalFormRef}
          visible={createModalVisible}
          onSubmit={this.handleCreate}
          onCancel={this.hideCreateModal}
          width={450}
          placement="left"
          okText="提交"
          formItemList={createFormItemList}
          formItemLayout={formItemLayout}
        />
        <EditDrawer
          title="编辑用户记录"
          wrappedComponentRef={this.saveEditModalFormRef}
          visible={editModalVisible}
          onSubmit={this.handleEdit}
          onCancel={this.hideEditModal}
          width={500}
          formItemList={editFormItemList}
          formItemLayout={formItemLayout}
          editKey={{id: editingItem.id}}
        />
        <DetailModal
          title="用户资料"
          isFormModal={false}
          visible={detailModalVisible}
          onSubmit={this.hideDetailModal}
          showCancel={false}
          onCancel={this.hideDetailModal}
          width={700}
        >
          {detailModalItemList}
        </DetailModal>
        <FileUploadModal
          title="文件导入"
          isFormModal={false}
          visible={fileUploadModalVisible}
          onSubmit={this.hideFileUploadDetailModal}
          showCancel={false}
          onCancel={this.hideFileUploadDetailModal}
          width={700}
        >
          {fileUploadModalItemList}
        </FileUploadModal>
        <BatchEditModal 
          title="批量修改"
          width={1024}
          top={0}
          visible={batchEditModalVisible}
          onCancel={this.hideBatchEditModal}
          wrappedComponentRef={this.saveBatchEditModalRef}
          columns={columns.filter(item => item.key !== 'action')}
          selectedItems={userList ? userList.filter(item => selectedIds.indexOf(item.id) >= 0) : []}
          formItemList={batchDetailModalFormItemList}
          onSubmit={this.handleBatchEdit}
        />
      </Fragment>
    );
  }

}

export default connect(({ mainModel, deptModel, userModel, roleModel, loading }) => ({ 
  mainModel, deptModel, userModel, roleModel, loading
 }))(User);
