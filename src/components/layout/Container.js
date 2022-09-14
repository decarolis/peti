import styles from './Container.module.scss';

function Container({ children }) {
  return <main className={styles.container}>{children}</main>;
}

export default Container;
