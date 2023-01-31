import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SurveyActions {
    values: Array<{id: number; value: string; error: string | null; touched: boolean}>
}

let count = 0;

const validate = (text: string) => {
    if(text.trim().length === 0) {
        return 'This field is required';
    }
    if(text.trim().length > 20) {
        return 'Action text should be less than 20 characters';
    }
    return null;
}

const formSlice = createSlice({
    name: 'survey-form',
    initialState: {
        values: []
    } as SurveyActions,
    reducers: {
        handleCreate: (state) => {
            state.values.push({
                id: count++,
                value: '',
                error: null,
                touched: false
            })
        },
        handleChange: (state, {payload}: PayloadAction<{id: number, text: string}>) => {
            const index = state.values.findIndex(action => action.id === payload.id);
            if(index === -1) {
                return;
            }
            state.values[index].value = payload.text;
            state.values[index].error = validate(payload.text);
        },
        handleBlur: (state, {payload}: PayloadAction<number>) => {
            const surveyAction = state.values.find(action => action.id === payload);
            if(surveyAction) {
                surveyAction.touched = true;
            }
        },
        handleDelete: (state, {payload}: PayloadAction<number>) => {
            state.values = state.values.filter(action => action.id !== payload);
        },

        handleReorder: (state, {payload}: PayloadAction<Array<number>>) => {
            const newState = payload.map(id => {
                const actionIndex = state.values.findIndex(action => action.id === id);
                return state.values[actionIndex];
            })

            state.values = newState;
        }
    }
})


export const {handleBlur, handleChange, handleCreate, handleDelete, handleReorder} = formSlice.actions
export default formSlice.reducer;