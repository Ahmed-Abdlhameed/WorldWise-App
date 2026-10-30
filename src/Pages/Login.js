// Imports:
import Button from "../Components/Button";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("ahmed@example.com");
  const [password, setPassword] = useState("qwertyy");

  // Contexts:
  const { login, isAuthenticated } = useContext(AuthContext);

  // Hooks:
  const navigate = useNavigate();

  // Functions:
  // handleSubmit function:
  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    };
  }

  // Effects (we use an effect as getting any data from a context and navigating are async operations):
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/layout", { replace: true }); // Just like in Routes so we can go back.
    }
  }, [isAuthenticated, navigate]);

  // Return:
  return (
    <main className={styles.login}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type={"primary"}>Login</Button>
        </div>
      </form>
    </main>
  );
}
