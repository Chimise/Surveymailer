import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type } from "os";
import { boolean, string } from "yup";

interface AlertState {
  message: string | null;
  show: boolean;
  type: "error" | "success";
  timeout: number;
}

interface InitialUiState {
  alert: AlertState;
}

const initialAlertState: AlertState = {
  message: null,
  show: false,
  type: "success",
  timeout: 4000,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    alert: initialAlertState,
  } as InitialUiState,
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
        alert: {
          ...initialAlertState,
          type: state.alert.type
        }
      }
    },
  },
});

export const { dismissAlert, showAlert } = uiSlice.actions;
export default uiSlice.reducer;
