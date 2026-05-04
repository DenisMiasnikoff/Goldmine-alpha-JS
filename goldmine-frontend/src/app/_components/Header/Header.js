import styles from './Header.module.scss';

export default function Header({onLogoClick}) {
  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={onLogoClick} style={{cursor:'pointer'}}>
        <span>Goldmine</span>
      </div>

      <form action="#" className={styles.search}>
        <input type="text" className={styles.searchInput} placeholder="Search for communities" />
        <button className={styles.searchButton}>
          {/* Use a simple SVG or text icon for now */}
          <span className={styles.searchIcon}>🔍</span>
        </button>
      </form>

      <nav className={styles.userNav}>
        <div className={styles.userNavIconBox}>
          <span className={styles.userNavIcon}>🔔</span>
          <span className={styles.userNavNotification}>0</span>
        </div>
        <div className={styles.userNavUser}>
          <div className={styles.userNavUserPhoto}>M</div>
          <span className={styles.userNavUserName}>Username</span>
        </div>
      </nav>
    </header>
  );
}