import styles from "./Logo.css";

const Logo = ({ 
  path, collapsed, color, title, weight,
  titleMaxWidth, wrapperMaxWidth, wrapperMargin
}) => {
  return (
    <div className={styles["logo-wrapper"]} style={{maxWidth: wrapperMaxWidth, margin: wrapperMargin}}>
      <img className={collapsed ? styles.logo+" "+styles["logo-collapsed"] : styles.logo} src={path} alt="logo"/>
      <div className={collapsed ? styles["name-wrapper-hidden"]: styles["name-wrapper"]}>
        <div className={styles.name} style={{color: color, maxWidth: titleMaxWidth, fontWeight: weight}}>{title}</div>
      </div>
    </div>
  )
}

export default Logo;