import { type ReactNode } from "react";
import styles from "../styles/layout.module.scss";
import Header from "../components/Header";
import { Spin } from "antd";

interface ILayoutProps {
  children: ReactNode;
  loading?: boolean;
}

function Layout({ children, loading }: ILayoutProps) {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.layout}>
        <Spin spinning={loading} size="large" fullscreen />
        <main className={styles.main}>{loading ? null : children}</main>
      </div>
    </div>
  );
}

export default Layout;
