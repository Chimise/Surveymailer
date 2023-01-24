import React, {useState} from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Reorder } from "framer-motion";
import Draggable from "../Draggable/Draggable";

const DraggableField = () => {
  const [items, setItems] = useState(['hello']);
  return (
    <div className="space-y-1">
    <span className="block text-gray-800 text-sm">Actions</span>
      <div className="flex flex-col border border-gray-300">
        <Reorder.Group onReorder={setItems} values={items} className="flex-1">
          {/* <div className="h-20 flex items-center text-sm text-gray-700 justify-center">
              No Entry, click the button below to add one
          </div> */}
          {items.map(item => <Draggable key={item} value={item} />)}
        </Reorder.Group>
        <button className="h-8 flex items-center justify-center font-medium border-t border-t-gray-300 space-x-3 text-secondary text-xs focus:outline-none">
          <PlusIcon className="w-4 h-4 stroke-2" />
          <span className="uppercase">Add New Action</span>
        </button>
      </div>
    </div>
  );
};

export default DraggableField;
