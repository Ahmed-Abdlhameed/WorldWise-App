// Imports:
import { createContext, useReducer } from "react";

// Contexts:
const AuthContext = createContext();

// Reducer vars:
const initialState = {
    user: null,
    isAuthenticated: false,
};

// Reducer function:
const reducer = (state, action) => {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload, isAuthenticated: true }
        case "logout":
            return { ...state, user: null, isAuthenticated: false }
        default:
            throw new Error("Unknown action type");
    }
}

// Fake user:
const FAKE_USER = {
    name: "Ahmed",
    email: "ahmed@example.com",
    password: "qwertyy",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

// Provider component:
function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Destructuring state:
    const { user, isAuthenticated } = state;

    // Login function:
    const login = (email, password) => {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({ type: "login", payload: FAKE_USER });
        }
    };

    // Logout function:
    const logout = () => {
        dispatch({ type: "logout" });
    };

    // Returning the provider:
    return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

// Exporting:
export { AuthContext, AuthProvider };

