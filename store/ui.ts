import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyPreviewData } from "../types";

interface AlertState {
  message: string | null;
  show: boolean;
  type: "error" | "success";
  timeout: number;
}

interface ModalState {
  isVisible: boolean;
  data: SurveyPreviewData | null;
}

interface InitialUiState {
  alert: AlertState;
  modal: ModalState;
}

const initialAlertState: AlertState = {
  message: null,
  show: false,
  type: "success",
  timeout: 4000,
};

const initialState: InitialUiState = {
  alert: initialAlertState,
  modal: {
    isVisible: false,
    data: null
  }
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showAlert: (
      state,
      {
        payload: { message, type = "success", timeout = 3000 },
      }: PayloadAction<{
        message: string;
        type?: AlertState["type"];
        timeout?: number;
      }>
    ) => {
      return {
        ...state,
        alert: {
          show: true,
          message,
          type,
          timeout,
        },
        
      };
    },
    dismissAlert: (state) => {
      return {
        ...state,
        alert: {
          ...initialAlertState,
          type: state.alert.type
        }
      }
    },
    showModal: (state, {payload}: PayloadAction<SurveyPreviewData>) => {
      state.modal.isVisible = true;
      state.modal.data = payload;
    },
    closeModal: (state) => {
      state.modal.isVisible = false;
      state.modal.data = null;
    }
  },
});

export const { dismissAlert, showAlert, showModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
