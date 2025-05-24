
import { ReactNode } from "react";
import { Droppable } from "react-beautiful-dnd";

interface DraggableBlocksContainerProps {
  periodId: number;
  children: ReactNode;
}

const DraggableBlocksContainer = ({
  periodId,
  children,
}: DraggableBlocksContainerProps) => {
  return (
    <Droppable droppableId={`period-${periodId}`} type="BLOCK">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-h-[50px]"
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DraggableBlocksContainer;
