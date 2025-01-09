import styles from "../styles/header.module.scss";

function Header() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Repositories</h1>
      </header>
    </div>
  );
}

export default Header;
