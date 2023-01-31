import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const useAuth = () => {
    const {token, error} = useSelector((state: RootState) => state.auth);
    return useMemo(() => ({token, error}), [token, error]);
}

export default useAuth;