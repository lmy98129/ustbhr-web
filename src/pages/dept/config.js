import { Divider, Input } from 'antd';
import { dateFormat } from '../../utils/format';

/**
 * 表格格式及内容的配置文件
 * 需要父组件传入两个on函数完成修改和删除操作
 * 并实现“操作”列的固定，创建时间的格式转换等功能
 * 
 * @param {object} param 输入的参数对象
 */
export const columnsConfig = ({ onEdit, onDelete }) => [
  // {
  //   title: "编号",
  //   dataIndex: "id",
  //   key: "id",
  // },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "部门代号",
    dataIndex: "deptKey",
    key: "deptKey",
  },
  {
    title: "创建时间",
    dataIndex: "registerDate",
    key: "registerDate",
    render: (text) => dateFormat(new Date(text), "yyyy-MM-dd"),
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 120,
    render: (text, record) => (
      <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <div style={{color: "#1890ff", cursor: "pointer"}} onClick={() => onEdit(record)}>修改</div>
        <Divider type="vertical" />
        <div style={{color: "rgb(209, 66, 71)", cursor: "pointer"}} onClick={() => onDelete(record)}>删除</div>
      </div>
    )
  }
]

/**
 * 表单窗口的格式、内容配置
 * 
 * @param {*} formItem 在编辑表单窗口中传入的被编辑项目，
 *                     也就是各输入框的初始值
 */
export const formItemList = (formItem) => [
  {
    label: "部门名称",
    key: "name",
    initialValue: formItem ? formItem.name : "",
    rules: [
      { required: true, message: "请输入部门名称" },
      { type: "string", max: 30, message: "字数大于30"}
    ],
    content: (
      <Input placeholder="请输入部门名称，30字以内" />
    )
  },
  {
    label: "部门代码",
    key: "deptKey",
    initialValue: formItem ? formItem.deptKey : "",
    rules: [
      { required: true, message: "请输入部门代码" },
      { type: 'string', pattern: /^[0-9A-Z]+$/, message: '请填写正确的部门代码：大写英文、数字的组合' },
      { type: "string", max: 30, message: "字数大于30" }
    ],
    content: (
      <Input placeholder="请输入部门代码，大写英文、数字的组合"/>
    )
  }
];

/**
 * 批量操作的下拉菜单配置
 * 主要是配置菜单项目名称和点击后的处理函数
 * 
 * @param {object} param  传入的参数对象
 */
export const menuConfig = ({ handleDelete }) => [
  {
    title: "删除选中",
    handler: handleDelete,
    style: { color: "rgb(209, 66, 71)" }
  },
]