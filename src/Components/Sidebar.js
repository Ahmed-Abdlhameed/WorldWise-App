import { Outlet } from "react-router-dom";
import LayoutNav from "./LayoutNav";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo />
            <LayoutNav />
            <Outlet />
            <footer className={styles.footer}>
                <p className={styles.copyright}>
                    &copy; Copyright {new Date().getFullYear()} by WorldWise Inc.
                </p>
            </footer>
        </div>
    );
}

export default Sidebar