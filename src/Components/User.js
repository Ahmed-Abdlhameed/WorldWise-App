import styles from "./User.module.css";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function User() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleClick() {
    logout();
    navigate("/");
  }

  return (
    user && (
      <div className={styles.user}>
        <img src={user.avatar} alt={user.name} />
        <span>Welcome, {user.name}</span>
        <button onClick={handleClick}>Logout</button>
      </div>
    )
  );
}

export default User;
