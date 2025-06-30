import { motion } from "framer-motion";
import React from "react";

export interface Task {
  id: string;
  text: string;
  hours: number;
  position: { x: number; y: number };
  zIndex: number;
  color: string;
}

interface TaskCardProps {
  task: Task;
  containerRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  onDragStart: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onDragEnd: () => void;
  onDelete?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  containerRef,
  isSelected,
  onDragStart,
  onDrag,
  onDragEnd,
  onDelete,
}) => {
  return (
    <motion.div
      className={`absolute cursor-move shadow-md rounded-lg border-2 ${task.color}`}
      style={{
        width: "150px",
        zIndex: task.zIndex,
        boxShadow: isSelected ? "0 0 15px rgba(0,0,0,0.2)" : undefined,
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{
        x: task.position.x,
        y: task.position.y,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
      drag
      dragMomentum={false}
      onDragStart={() => onDragStart(task.id)}
      onDrag={(_, info) => {
        if (containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const x = info.point.x - containerRect.left;
          const y = info.point.y - containerRect.top;
          onDrag(task.id, x, y);
        }
      }}
      onDragEnd={onDragEnd}
      onDoubleClick={() => onDelete?.(task.id)}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{task.text}</h3>
        <div className="text-xs mt-1 flex items-center justify-between">
          <span className="font-semibold">
            {task.hours} {task.hours === 1 ? "hour" : "hours"}
          </span>
          <span className="text-xs text-gray-400 italic">
            double-click to remove
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
