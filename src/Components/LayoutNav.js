import styles from "./LayoutNav.module.css";
import { NavLink } from "react-router-dom";

function LayoutNav() {
    return (
        <nav className={styles.nav}>
            <ul>
                <li>
                    <NavLink to="cities">Cities</NavLink>
                </li>
                <li>
                    <NavLink to="countries">Countries</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default LayoutNav