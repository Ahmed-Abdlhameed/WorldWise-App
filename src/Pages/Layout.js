import Map from "../Components/Map";
import Sidebar from "../Components/Sidebar";
import User from "../Components/User";
import Styles from "./Layout.module.css";

function Layout() {
    return (
        <div className={Styles.app}>
            <Sidebar />
            <Map />
            <User />
        </div>
    );
}

export default Layout