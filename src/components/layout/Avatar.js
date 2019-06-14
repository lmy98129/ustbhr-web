import styles from './Avatar.css';

const Avatar = ({ name, path }) => {
  return (
    <div className={styles["avatar-wrapper"]}>
      <img className={styles.avatar} src={path} alt="Avatar"/>
      <div className={styles["name-wrapper"]}>
        <div className={styles.name}>{name}</div>
      </div>
    </div>
  )
}

export default Avatar;