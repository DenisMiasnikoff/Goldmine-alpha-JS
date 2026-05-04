import styles from './Sidebar.module.scss';

export default function Sidebar({isVisible}) {
 const sidebarClasses = `${styles.sidebar} ${!isVisible ? styles.sidebarHidden : ''}`;
  return (
    <nav className={sidebarClasses}>
      <ul className={styles.sideNav}>
        <li className={`${styles.sideNav__item} ${styles.sideNav__item_active}`}>
          <a href="#" className={styles.sideNav__link}>
            <span>🏠 Home</span>
          </a>
        </li>
        <li className={styles.sideNav__item}>
          <a href="#" className={styles.sideNav__link}>
            <span>🔥 Popular</span>
          </a>
        </li>
        <li className={styles.sideNav__item}>
          <a href="#" className={styles.sideNav__link}>
            <span>⚒️ My Dungeons</span>
          </a>
        </li>
      </ul>

      <div className={styles.legal}>
        &copy; 2026 goldenden347. All rights reserved.
      </div>
    </nav>
  );
}