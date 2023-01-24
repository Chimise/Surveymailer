import React, { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import cn from 'classnames';
import { GridIcon } from "../../icons";
import {TrashIcon} from '@heroicons/react/24/solid';

interface DraggableProps {
    value: string;
}

const Draggable = ({value}: DraggableProps) => {
  const [text, setText] = useState(value);
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={text}
      as="div"
      className="w-full bg-white p-2 first:border-none last:border-none border-x border-x-gray-300"
      dragListener={false}
      dragControls={controls}
    >
      <Disclosure as="div">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between items-center px-4 py-1 h-6 text-left text-sm font-medium text-slate-600 focus:outline-none">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 flex rounded-full items-center justify-center bg-gray-400">
                  <div className={cn("w-0 h-0 border-x-[5px] border-x-transparent border-b-[5px] -mt-0.5 border-b-gray-900 transition-transform duration-150", {'rotate-0': !open, 'rotate-180': open})} />
                </div>
                <span>Hello World</span>
              </div>
              <div className="flex items-center text-gray-500 space-x-4">
                    <TrashIcon className='w-4 h-4' />
                    <GridIcon className="w-4 h-4" />
                </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              No. This is really happenning now
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </Reorder.Item>
  );
};

export default Draggable;
