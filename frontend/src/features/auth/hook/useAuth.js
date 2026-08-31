import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, clearAuth, setLoading, setError } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({ email, username, password });
            return { success: true, message: data.message || "Registration successful." };
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
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
            dispatch(setError(error.response?.data?.message || "Failed to fetch user details"));
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
            const message = error.response?.data?.message || "Login failed";
            dispatch(setError(message));
            return { success: false, message };
        } finally {
            dispatch(setLoading(false));
        }
    }

    function handleLogout() {
        dispatch(clearAuth());
        return true;
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    };
}
