import { Component, Fragment } from 'react';
import { Table, Row, Icon } from 'antd';
import styles from './BasicTable.css'
import ExecButton from './ExecButton';

/**
 * 自行封装的表格组件BasicTable
 * 主要功能是实现可定制表格格式和内容、
 * 可定制表格上方除查询外的其他操作按钮等
 * 
 */
class BasicTable extends Component {

  render() {
    // 获取组件对外暴露的props
    // columns：表格各列内容和结构配置
    // dataSource：从后端获取到的表格数据
    // loading：表格数据是否在加载
    // rowSelection：当表格某几行被选中时的处理，一般是记录这些被选项目
    // isShowAdd：是否显示新建按钮
    // createHandler：新建操作处理函数
    // rowKey：表格每行key的取值，一般是id
    // scroll：是否允许表格在内容超长时横向或纵向滚动
    // total: 表格项目总数，允许修改
    const { 
      columns, children, dataSource, loading, rowSelection,
      isShowAdd = true, createHandler, rowKey, scroll, total,
      onChange, pageSize=10, showSizeChanger=false, onShowSizeChange,
    } = this.props;

    // 开始渲染
    return (
      <Fragment>
        <Row 
          className={styles.row}
          gutter={12}
          type="flex"
          justify="start"
        >
          { isShowAdd ? 
          <ExecButton 
            icon={<Icon type="plus" />}
            btnType="primary"
            handler={createHandler}
            name="新建"
          /> : ""}
          {children}
        </Row>
        <Table
          className={styles.table}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={dataSource}
          scroll={scroll}
          loading={loading}
          total={total ? total: dataSource.length}
          pagination={{  
            pageSize,
            total: total ? total: dataSource.length,
            showTotal: (total, range) => (`${range[0]}-${range[1]}项 共${total}项`),
            onShowSizeChange,
            showSizeChanger,
          }}
          rowKey={rowKey}
          onChange={onChange}
        />
      </Fragment>
    );
  }
}

export default BasicTable;