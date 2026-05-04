import styles from './Button.module.scss';

export default function Button({ children, variant = 'gold', type = 'button' }) {
  // This combines the base .btn class with whatever variant you pass (gold or white)
  const buttonClass = `${styles.btn} ${styles[variant]}`;

  return (
    <button type={type} className={buttonClass}>
      {children}
    </button>
  );
}