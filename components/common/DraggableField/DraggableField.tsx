import React, { useRef} from "react";
import cn from 'classnames';
import { PlusIcon } from "@heroicons/react/24/solid";
import { Reorder } from "framer-motion";
import Draggable from "../Draggable/Draggable";
import useSurveyActions from "../../../hooks/useSurveyActions";
import { useAppDispatch } from "../../../store";
import { handleCreate, handleChange, handleBlur, handleDelete, handleReorder } from "../../../store/survey_form";


const DraggableField = () => {
  const {actionIds, actions, isTouched, isValid} = useSurveyActions();
  const dispatch = useAppDispatch();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    dispatch(handleChange({id, text: event.target.value}));
  }

  const blurHandler = (id: number) => {
    dispatch(handleBlur(id));
  }

  const deleteHandler = (id: number) => {
    dispatch(handleDelete(id));
  }

  return (
    <div className="space-y-1">
      <span className="block text-gray-800 text-sm">Choices</span>
      <div className={cn("flex flex-col border", {'border-red-800': isTouched && !isValid, 'border-gray-300': !isTouched || isValid})}>
        <Reorder.Group
          as="div"
          ref={parentRef}
          onReorder={(newActionIds) => dispatch(handleReorder(newActionIds)) }
          axis="y"
          values={actionIds}
          className="flex-1"
        >
          {actions.length === 0 && <div className="h-20 flex space-y-1 flex-col items-center px-2 text-center text-xs md:text-sm text-gray-700 justify-center">
              <span>No Entry yet, add or reorder</span>
              <span>You should add at least 2 choices and at most 10 choices</span>
          </div>}
          {actions.length > 0 && actions.map((action) => (
            <Draggable
              constraints={parentRef}
              key={action.id}
              action={action}
              onChange={changeHandler}
              onBlur={blurHandler}
              onDelete={deleteHandler}
            />
          ))}
        </Reorder.Group>
        <button type='button'  onClick={() => dispatch(handleCreate())} className={cn("h-8 flex items-center justify-center font-medium border-t space-x-3 text-secondary text-xs focus:outline-none", {'border-t-red-800': isTouched && !isValid, 'border-t-gray-300': !isTouched || isValid})}>
          <PlusIcon className="w-4 h-4 stroke-2" />
          <span className="uppercase">Add New Choice</span>
        </button>
      </div>
    </div>
  );
};

export default DraggableField;
