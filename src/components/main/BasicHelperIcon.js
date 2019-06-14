import { Icon, Tooltip } from 'antd';
import styles from './BasicHelperIcon.css';

const BasicHelperIcon = ({ searchHelper, fontSize }) => (
  <Tooltip 
    title={
      <div style={{ fontSize: "13px" }}>
        {searchHelper}
      </div>
    } 
    placement="bottom"
  >
      <Icon 
        style={{ fontSize: fontSize ? fontSize : "20px" }}        
        type="question-circle" 
        theme="outlined"
        className={styles["helper-icon"]}
      />
  </Tooltip> 
)

export default BasicHelperIcon;