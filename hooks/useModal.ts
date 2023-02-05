import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "../store";
import {showModal, closeModal } from "../store/ui";
import type { SurveyPreviewData } from "../types";

const useModal = () => {
    const data = useSelector((state: RootState) => state.ui.modal);
    const dispatch = useAppDispatch();
    const open = (surveyData: SurveyPreviewData) => {
        dispatch(showModal(surveyData));
    }

    const close = () => {
        dispatch(closeModal());
    }

    return {
        ...data,
        open,
        close
    }
}

export default useModal;