import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAppDispatch } from "../store";
import { handleReset } from "../store/survey_form";

const useSurveyActions = () => {
    const dispatch = useAppDispatch();
    const actions = useSelector((state: RootState) => state.survey.values);
    const memoisedActions = useMemo(() => actions, [actions]);
    const actionLength = memoisedActions.length;
    const actionIds =  memoisedActions.map(action => action?.id);
    const isValid = actionLength === 0 ? false : memoisedActions.every(action => action?.error === null) && actionLength > 1 && !(actionLength > 10);
    const isTouched = actionLength === 0 ? false : memoisedActions.every(action => action?.touched);

    const reset = useCallback(() => {
        dispatch(handleReset())
    }, [dispatch])

    return {
        actionIds,
        actions: memoisedActions,
        isValid,
        values: useMemo(() => actions.map(action => action.value), [actions]),
        isTouched,
        reset
    }
}


export default useSurveyActions;