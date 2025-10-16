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
    dragElastic?: number | boolean;
    dragTransition?: any;
}

const TaskCard: React.FC<TaskCardProps> = (props) => {
    const {
        task,
        containerRef,
        isSelected,
        onDragStart,
        onDrag,
        onDragEnd,
        onDelete,
    } = props;
    return (
        <motion.div
            className="absolute cursor-move rounded-xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
                type: "tween",
                duration: 0.2,
                ease: "easeOut",
            }}
            drag
            dragMomentum={false}
            dragElastic={0}
            dragTransition={{ power: 0, timeConstant: 0 }}
            style={{
                x: task.position.x,
                y: task.position.y,
                width: "200px",
                zIndex: task.zIndex,
                boxShadow: isSelected ? "0 0 15px rgba(0,0,0,0.2)" : undefined,
            }}
            onDragStart={() => onDragStart(task.id)}
            onDrag={(_, info) => {
                if (containerRef.current) {
                    const containerRect =
                        containerRef.current.getBoundingClientRect();
                    const x = info.point.x - containerRect.left;
                    const y = info.point.y - containerRect.top;
                    onDrag(task.id, x, y);
                }
            }}
            onDragEnd={onDragEnd}
            onDoubleClick={() => onDelete?.(task.id)}
            whileDrag={{ scale: 1.02, opacity: 0.95 }}
        >
            <div className={`relative ${task.color} rounded-xl p-4 shadow-lg`}>
                {/* Close button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(task.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 text-lg font-bold"
                >
                    ×
                </button>

                {/* Task content */}
                <div className="text-white">
                    <h3 className="font-medium text-sm leading-tight mb-1">
                        {task.text}
                    </h3>
                    <div className="text-xs opacity-90">
                        {task.hours} {task.hours === 1 ? "hour" : "hours"}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
