import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    // Contexts:
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // Effects:
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    // Return:
    /* If the user is authenticated, render the children else don't as they won't be 
       existing in the first place and so giving an error. */
    return isAuthenticated ? children : null
}

export default ProtectedRoute