import RegisterWidget from '../../components/login/RegisterWidget';
import styles from './Register.css';

/**
 * 注册页面
 */
const register = () => {
  
  document.title = "注册";

  return (
    <div className={styles["register-widget-wrapper"]}>
      <div className={styles["register-title"]}>注册初始账号</div>
      <RegisterWidget />
    </div>
  )
}

export default register;
