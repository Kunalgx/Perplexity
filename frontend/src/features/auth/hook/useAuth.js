import { useDispatch } from "react-redux";
import { register, login, logout, getMe } from "../service/auth.api";
import { setUser, clearAuth, setLoading, setError } from "../auth.slice";

// Helper function to extract error message from backend response
const extractErrorMessage = (error) => {
    // Check if we have a response with data
    if (error.response?.data) {
        const data = error.response.data;

        // If there's a message field, use it
        if (data.message) {
            return data.message;
        }

        // If there are validation errors array, extract the first one
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            // Find the first error message
            const firstError = data.errors[0];
            if (typeof firstError === 'string') {
                return firstError;
            }
            if (firstError.msg) {
                return firstError.msg;
            }
            if (firstError.message) {
                return firstError.message;
            }
        }
    }

    // Fallback to generic message
    return "An error occurred. Please try again.";
};

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({ email, username, password });
            return { success: true, message: data.message || "Registration successful." };
        } catch (error) {
            const message = extractErrorMessage(error);
            dispatch(setError(message));
            return { success: false, message };
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
            return data.user;
        } catch (error) {
            const message = extractErrorMessage(error);
            dispatch(setError(message));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await login({ email, password });
            dispatch(setUser(data.user));
            return { success: true, message: data.message || "Login successful." };
        } catch (error) {
            // For login, use generic message for security
            const message = error.response?.status === 401 || error.response?.status === 404 || error.response?.status === 403
                ? "Invalid email or password."
                : extractErrorMessage(error);
            dispatch(setError(message));
            return { success: false, message };
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.warn("Logout request failed, continuing local sign-out.", error);
        } finally {
            dispatch(clearAuth());
        }
        return true;
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    };
}
