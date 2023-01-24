import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const useAuth = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    return useMemo(() => token, [token]);
}

export default useAuth;