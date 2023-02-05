import React, { PointerEvent} from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import cn from "classnames";
import { GridIcon } from "../../icons";
import { TrashIcon } from "@heroicons/react/24/solid";
import Input from '../../ui/Input';

interface DraggableProps {
  action: {value: string; id: number; error: string | null; touched: boolean}
  constraints: React.MutableRefObject<HTMLDivElement | null>;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  onBlur: (id: number) => void;
  onDelete: (id: number) => void;
}

const placeholders = ['Very Unhappy', 'Unhappy', 'Neutral', 'Happy', 'Very Happy']

const Draggable = ({ action: {value, id, error, touched}, constraints, onChange, onBlur, onDelete }: DraggableProps) => {
  const controls = useDragControls();
  const pointerDownHandler = (
    event: PointerEvent<Element>,
    open: boolean,
    close: (
      node?: HTMLElement | React.MutableRefObject<HTMLElement | null>
    ) => void
  ) => {
    controls.start(event);
    if (open) {
      close();
    }
  };
  return (
    <Reorder.Item
      dragConstraints={constraints}
      dragElastic={0.2}
      value={id}
      as="div"
      className="w-full bg-white group"
      dragListener={false}
      dragControls={controls}
    >
      <Disclosure defaultOpen as="div" className="w-full">
        {({ open, close }) => (
          <>
            <Disclosure.Button
              className={cn(
                "relative flex w-full border-t border-gray-300 group-first:border-t-0 justify-between items-center px-4 py-1 h-10 text-left text-sm font-medium text-slate-600 focus:outline-none",
                { "border-b-0": !open, "border-b": open }
              )}
            >
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 flex rounded-full items-center justify-center bg-gray-400">
                  <div
                    className={cn(
                      "w-0 h-0 border-x-[5px] border-x-transparent border-b-[5px] -mt-0.5 border-b-gray-900 transition-transform duration-150",
                      { "rotate-0": !open, "rotate-180": open }
                    )}
                  />
                </div>
                <span>{value}</span>
              </div>
              <div
                onClick={(evt) => evt.stopPropagation()}
                className="flex items-center text-gray-500 space-x-4"
              >
                <TrashIcon className="w-4 h-4" onClick={() => onDelete(id)} />
                <GridIcon
                  className="w-4 h-4"
                  onPointerDown={(event) =>
                    pointerDownHandler(event, open, close)
                  }
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-6 py-5 md:px-10 text-sm text-gray-500">
              <Input error={touched && error!} className='text-black' placeholder={placeholders[id % placeholders.length]} onChange={(evt) => onChange(evt, id)} value={value} onBlur={() => onBlur(id)} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </Reorder.Item>
  );
};

export default Draggable;
