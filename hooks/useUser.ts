import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const useUser = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    return useMemo(() => user, [user]);
}

export default useUser;