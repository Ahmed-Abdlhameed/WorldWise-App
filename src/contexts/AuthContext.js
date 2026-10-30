
import { createContext, useReducer } from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "worldwise-user";

const FAKE_USER = {
    name: "Ahmed",
    email: "ahmed@example.com",
    password: "qwertyy",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

// Restore the user from localStorage.
function getStoredUser() {
    try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedUser) return null;

        const user = JSON.parse(storedUser);

        if (!user || typeof user.email !== "string") {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
        }

        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        };
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
}

// Initial state:
const initialState = {
    user: null,
    isAuthenticated: false,
};

// Initialize from localStorage:
function init() {
    const user = getStoredUser();

    return {
        user,
        isAuthenticated: Boolean(user),
    };
}

// Reducer:
const reducer = (state, action) => {
    switch (action.type) {
        case "login":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };

        case "logout":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };

        default:
            throw new Error("Unknown action type");
    }
};

// Provider:
function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(
        reducer,
        initialState,
        init
    );

    const { user, isAuthenticated } = state;

    // Login:
    const login = (email, password) => {
        if (
            email === FAKE_USER.email &&
            password === FAKE_USER.password
        ) {
            const safeUser = {
                name: FAKE_USER.name,
                email: FAKE_USER.email,
                avatar: FAKE_USER.avatar,
            };

            localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify(safeUser)
            );

            dispatch({
                type: "login",
                payload: safeUser,
            });

            return true;
        }

        return false;
    };

    // Logout:
    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        dispatch({ type: "logout" });
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };