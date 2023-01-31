import { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, RootState } from "../store";
import { useSelector } from "react-redux";
import { showAlert, dismissAlert } from "../store/ui";

const useAlert = () => {
    const {message, timeout, type, show} = useSelector((state: RootState) => state.ui.alert);
    const dispatch = useAppDispatch();

    // Handler to Dispatch action to show alert
    const handleShowAlert = ({message, type, timeout}: {message: string; type?: 'error' | 'success', timeout?: number}) => {
        
        dispatch(showAlert({message, type: 'success', timeout}));
    };

    // Handler to dispatch action to dismiss alert
    const handleDismissAlert = useCallback(() => {
        dispatch(dismissAlert());
    }, [dispatch]);

    

    return {
        message,
        timeout,
        type,
        show,
        handleShowAlert,
        handleDismissAlert
    }

}


export default useAlert;