import { useEffect } from "react";
import { useAuth } from "./useAuth";

export function useAuthInit() {
    const { handleGetMe } = useAuth();

    useEffect(() => {
        handleGetMe();
    }, []);

    return null;
}