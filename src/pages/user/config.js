import { Input, Radio, Select, Divider, Upload,
  Descriptions, DatePicker, Icon, Dropdown, Menu } from 'antd';
import { dateFormat } from '../../utils/format';
import { Fragment } from 'react';
import moment from 'moment';
import { success, error, warning } from '../../utils/message';

const { Option } = Select;
const { Dragger } = Upload;
const Descript = Descriptions;

const GENDER_ENUM = ["未知", "男", "女", "男", "女", "其他"];

export const searchHelper = 
  <span>1. 查询时关键字可以留空。<br/>
        2. 工号只支持查询数字，若需查询前后缀，请选择“部门名称”、“职位”等项目。<br />
        3. 点击“取消”按键清空查询条件。
  </span>;

/**
 * 新建表单窗口的格式、内容配置
 * 
 * @param {object}  validators 传入的校验器
 */
export const formItemListConfig = ({
  validateToNextPassword,
  compareToFirstPassword,
  handleConfirmBlur,
  deptList, styles, roleList,
  editingItem,
}) => [
  {
    label: "姓名",
    key: "name",
    initialValue: editingItem ? editingItem.name : "",
    rules: [
      { required: true, message: "请输入用户姓名" },
      { type: "string", max: 30, message: "字数大于30"}
    ],
    content: (
      <Input placeholder="请输入姓名，30字以内" />
    ),
  },
  {
    label: "密码",
    key: "password",
    rules: [
      // { required: true, message: "请输入密码" },
      { validator: validateToNextPassword },
      { type: "string", max: 30, message: "字数大于30"}
    ],
    content: (
      <Input.Password 
        placeholder="30字以内，留空则为默认密码" 
      />
    )
  },
  {
    label: "确认密码",
    key: "confirm",
    rules: [
      // { required: true, message: '请确认您的密码！' },
      { validator: compareToFirstPassword },
      { type: "string", max: 30, message: "字数大于30"}
    ],
    content: (
      <Input.Password 
        onBlur={handleConfirmBlur}
        placeholder="30字以内，留空则为默认密码" 
      />
    )
  },
  {
    label: "选择部门",
    key: "deptId",
    initialValue: editingItem && editingItem.deptId ? editingItem.deptId : undefined,
    rules: [
      { required: true, message: "请选择所属部门" },
    ],
    content: (
      <Select 
        getPopupContainer={triggerNode => triggerNode.parentNode}
        className={styles ? styles["dept-select"] : ""}
      >
        {deptList ? deptList.map(dept => (
          <Option key={dept.id} value={dept.id}>{dept.name}</Option>
        )) : ""}
      </Select>
    )
  },
  {
    label: "选择职位",
    key: "roleId",
    initialValue: editingItem && editingItem.roleId ? editingItem.roleId : undefined,
    rules: [
      { required: true, message: "请选择职位" },
    ],
    content: (
      <Select 
        getPopupContainer={triggerNode => triggerNode.parentNode}
        className={styles ? styles["role-select"] : ""}
      >
        {roleList ? roleList.map(role => (
          <Option key={role.id} value={role.id}>{roleWidget(role.name, role.color)}</Option>
        )) : ""}
      </Select>
    )
  },
  {
    label: "性别",
    key: "gender",
    initialValue: editingItem && editingItem.gender >= 0 ? editingItem.gender : 0,
    rules: [
      { required: true, message: "请选择性别" },
    ],
    content: (
      // 0、未知，1、男，2、女，3、女改男，4、男改女，5、其他
      <Radio.Group>
        <Radio value={1}>男</Radio>
        <Radio value={2}>女</Radio>
        <Radio value={5}>其他</Radio>
      </Radio.Group>
    )
  },
];

// TODO: 编辑界面需要添加更多信息

const dateFormatList = ["YYYY-MM-DD", "YYYY-MM-DD HH:mm"]

export const extraFormItemListConfig = ({ editingItem }) => [
  {
    label: "入职时间",
    key: "registerDate",
    initialValue: editingItem && editingItem.registerDate 
      && editingItem.registerDate !== null && editingItem.registerDate !== "" ? 
      moment(editingItem.registerDate, dateFormatList[1]) : null,
    rules: [
      { type:'object', required: true, message: "请输入入职时间" },
    ],
    content: (
      <DatePicker 
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        placeholder="请选择日期和时间" 
        showTime
        format={dateFormatList[1]}
      />
    ),
  },
  {
    label: "当前状态",
    key: "status",
    initialValue: editingItem && editingItem.status >= 0 ? editingItem.status : 0,
    rules: [
      { required: true, message: "请选择状态" },
    ],
    content: (
      <Radio.Group>
        <Radio value={1}>在职</Radio>
        <Radio value={2}>离职</Radio>
      </Radio.Group>
    ),
  },
  {
    label: "离职时间",
    key: "unregisterDate",
    initialValue: editingItem && editingItem.unregisterDate 
      && editingItem.unregisterDate !== null && editingItem.unregisterDate !== "" ? 
      moment(editingItem.unregisterDate, dateFormatList[1]) : null,
    rules: [
      { type:'object', required: false, },
    ],
    content: (
      <DatePicker 
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        placeholder="请选择日期和时间" 
        showTime 
        format={dateFormatList[1]}
      />
    ),
  },
  {
    label: "工作职责",
    key: "position",
    initialValue: editingItem ? editingItem.position : "",
    rules: [
      { type: "string", max: 50, message: "字数大于50"}
    ],
    content: (
      <Input placeholder="请输入工作职责50字简述" />
    ),
  },
  {
    label: "生日",
    key: "birthdate",
    initialValue: editingItem && editingItem.birthdate 
      && editingItem.birthdate !== null && editingItem.birthdate !== "" ? 
      moment(editingItem.birthdate, dateFormatList[0]) : null,
    rules: [
      { type:'object', required: false, },
    ],
    content: (
      <DatePicker 
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        placeholder="请选择日期" 
        format={dateFormatList[0]}
      />
    )
  },
  {
    label: "联系方式",
    key: "contact",
    initialValue: editingItem ? editingItem.contact : "",
    rules: [
      { type: "string", max: 200, message: "字数大于200"}
    ],
    content: (
      <Input placeholder="请输入有效联系方式，200字以内" />
    ),
  },
  {
    label: "自我介绍",
    key: "intro",
    initialValue: editingItem ? editingItem.intro : "",
    rules: [
      { type: "string", max: 400, message: "字数大于400"}
    ],
    content: (
      <Input.TextArea 
        rows={5}
        placeholder="请输入自我介绍，以上字数有限无法完全输入的，可以在此填写，400字以内" 
      />
    ),
  },

]

/**
 * 查询栏下拉菜单的配置函数
 * 
 * @param {object}  deptList 传入的部门数据
 * @param {object}  roleList 传入的部门数据
 */
export const inquiryBarDropDownConfig = ({ deptList, roleList, styles }) => [
  {
    label: "部门名称",
    key: "deptId",
    rules: [],
    content: (
      <Select 
        className={styles ? styles["dept-select"] : ""}
        placeholder="请选择所属部门"
      >
        {deptList ? deptList.map(dept => (
          <Option key={dept.id}>{dept.name}</Option>
        )) : ""}
      </Select>
    )
  },
  {
    label: "职位",
    key: "roleId",
    rules: [],
    content: (
      <Select 
        className={styles ? styles["role-select"] : ""}
        placeholder="请选择职位"
      >
        {roleList ? roleList.map(role => (
          <Option key={role.id}>{roleWidget(role.name, role.color)}</Option>
        )) : ""}
      </Select>
    )
  }
];

const roleWidget = (role, color) => (
  <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
    <div 
      style={{
        height: "7px", 
        width: "7px", 
        borderRadius: "7px",
        background: color,
        marginRight: "10px",    
      }}
    />
    <div>{role}</div>
  </div>
)

export const columnsConfig =({ onEdit, onDelete, onDetail }) => [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "工号",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: "所属部门",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "性别",
    dataIndex: "gender",
    gender: "gender",
    render: text => GENDER_ENUM[text],
  },
  {
    title: "职位",
    dataIndex: "role",
    key: "role",
    render: (role, record) => roleWidget(role, record.roleColor),
  },
  {
    title: "工作职责",
    dataIndex: "position",
    key: "position",
    render: (text) => text !== undefined && text !== "" && text !== null? text : "暂无",
  },
  {
    title: "入职时间",
    dataIndex: "registerDate",
    key: "registerDate",
    render: (text) => dateFormat(new Date(text), "yyyy-MM-dd hh:mm"),
  },
  {
    title: "状态",
    dataIndex: "statusString",
    key: "statusString",
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 150,
    render: (text, record) => {
      const overlay = (
        <Menu>
          <Menu.Item
            key={1}
            onClick={() => onDetail(record)} 
          >
            资料详情
          </Menu.Item>
          <Menu.Item
            style={{color: "rgb(209, 66, 71)"}}
            key={2}
            onClick={() => onDelete(record)}
          >
            删除用户
          </Menu.Item>
        </Menu>
      );

      return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          {/* <div style={{color: "#1890ff", cursor: "pointer"}} onClick={() => onDetail(record)}>详情</div>
          <Divider type="vertical" /> */}
          <div style={{color: "#1890ff", cursor: "pointer", fontSize: "14px"}} onClick={() => onEdit(record)}>编辑</div>
          <Divider type="vertical" />
          <Dropdown overlay={overlay}>
            <div style={{color: "#1890ff", cursor: "pointer", fontSize: "14px"}} >更多 <Icon type="down" style={{fontSize: "12px"}} /></div>
          </Dropdown>
        </div>
      )
    }
  }
];

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export const menuConfig = ({ 
  handleDelete, handleEdit
 }) => [
   {
     title: "修改选中",
     handler: handleEdit,
    },
    {
      title: "删除选中",
      handler: handleDelete,
      style: { color: "rgb(209, 66, 71)" }
    },
]

export const detailModalItemListConfig = ({ 
  editingItem: { name, gender, userId, department, 
    role, roleColor, position, birthdate, contact, intro, 
    registerDate, statusString, }
}) => (
  <Fragment>
    <Descript bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 1 }}>
      <Descript.Item label="姓名" span={1}>{name ? name : "暂无"}</Descript.Item>
      <Descript.Item label="所属部门" span={2}>{department ? department : "暂无"}</Descript.Item>
      <Descript.Item label="性别" span={1} >{gender ? GENDER_ENUM[gender] : "未知"}</Descript.Item>
      <Descript.Item label="工号" span={2}>{userId ? userId : "暂无"}</Descript.Item>
      <Descript.Item label="职称" span={1}>{role ? roleWidget(role, roleColor) : "暂无"}</Descript.Item>
      <Descript.Item label="入职时间" span={3}>{registerDate ? dateFormat(new Date(registerDate), "yyyy-MM-dd hh:mm") : "暂无"}</Descript.Item>
      <Descript.Item label="当前状态" span={6}>{statusString ? statusString : "暂无"}</Descript.Item>
      <Descript.Item label="工作职责" span={6}>{position ? position : "暂无"}</Descript.Item>
      <Descript.Item label="生日" span={1}>{birthdate ? birthdate : "暂无"}</Descript.Item>
      <Descript.Item label="联系方式" span={2}>{contact ? contact : "暂无"}</Descript.Item>
      <Descript.Item label="自我介绍" span={6}>{intro ? intro : "暂无"}</Descript.Item>
    </Descript>
  </Fragment>
)

export const batchEditFormItemConfig = ({ deptList, roleList, styles }) => [
  {
    label: "选择部门",
    key: "deptId",
    content: (
      <Select 
        getPopupContainer={triggerNode => triggerNode.parentNode}
        className={styles ? styles["dept-select"] : ""}
      >
        {deptList ? deptList.map(dept => (
          <Option key={dept.id} value={dept.id}>{dept.name}</Option>
        )) : ""}
      </Select>
    )
  },
  {
    label: "选择职位",
    key: "roleId",
    content: (
      <Select 
        getPopupContainer={triggerNode => triggerNode.parentNode}
        className={styles ? styles["role-select"] : ""}
      >
        {roleList ? roleList.map(role => (
          <Option key={role.id} value={role.id}>{roleWidget(role.name, role.color)}</Option>
        )) : ""}
      </Select>
    )
  },
  {
    label: "入职时间",
    key: "registerDate",
    content: (
      <DatePicker 
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        placeholder="请选择日期和时间" 
        showTime
        format={dateFormatList[1]}
      />
    ),
  },
  {
    label: "当前状态",
    key: "status",
    content: (
      <Radio.Group>
        <Radio value={1}>在职</Radio>
        <Radio value={2}>离职</Radio>
      </Radio.Group>
    ),
  },
  {
    label: "离职时间",
    key: "unregisterDate",
    rules: [
      { type:'object', required: false, },
    ],
    content: (
      <DatePicker 
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        placeholder="请选择日期和时间" 
        showTime 
        format={dateFormatList[1]}
      />
    ),
  },
  {
    label: "工作职责",
    key: "position",
    rules: [
      { type: "string", max: 50, message: "字数大于50"}
    ],
    content: (
      <Input placeholder="请输入工作职责50字简述" />
    ),
  },
]

export const fileUploadModalItemListConfig = (props, hideHandler) => (
  <Fragment>
    <div style={{ marginBottom: "10px" }} >
      用户信息批量导入Excel模板：<a href="http://localhost:8080/static/ustbhr_import_template.xlsx">下载地址</a><br /> 
    </div>
    <Dragger 
      {...props}
      showUploadList={false}
      name="file"
      multiple={true}
      onChange={(info) => {
        const status = info.file.status;
        if (status === 'error') {
          error(`文件${info.file.name}上传失败`);
          hideHandler();
          return;
        }
        if (status !== 'uploading' && info.file.response.code !== 0) {
          warning(info.file.response.code);
          hideHandler();
          return
        }
        if (status === 'done') {
          success(`文件${info.file.name}已成功上传.`);
          hideHandler();
          return;
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">填写完毕，拖拽文件或点击此区域以上传</p>
    </Dragger>
  </Fragment>
)