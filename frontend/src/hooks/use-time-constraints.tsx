import { RoutineInput, TaskInput } from "@/api/types";
import { divisor } from "@/lib/utils";
import { useMemo, useState } from "react";

function getPeriodsFromBlocks(
  totalTasksTime: number,
  totalRoutinesTime: number,
  nBlocks: number,
) {
  return divisor(totalTasksTime, nBlocks - totalRoutinesTime);
}

function getBlocksFromPeriods(
  totalTasksTime: number,
  totalRoutinesTime: number,
  nPeriods: number,
) {
  const totalTime = totalTasksTime + totalRoutinesTime * nPeriods;
  return divisor(totalTime, nPeriods);
}

export default function useTimeConstaints(
  tasks: TaskInput[],
  routines: RoutineInput[],
) {
  const [nBlocks, setNBlocks] = useState<number>(0);
  const [nPeriods, setNPeriods] = useState<number>(0);

  // total tasks time
  const totalTasksTime = useMemo(() => {
    return tasks.reduce((total, task) => total + task.requiredTime, 0);
  }, [tasks]);

  // PER PERIOD routines time total
  const totalRoutinesTime = routines.reduce(
    (total, routine) => total + routine.requiredTime,
    0,
  );

  const incrementBlocks = () => {
    setNBlocks((prev) => {
      const newBlocks = prev + 1;
      setNPeriods(
        getPeriodsFromBlocks(totalTasksTime, totalRoutinesTime, newBlocks),
      );
      return newBlocks;
    });
  };

  const decrementBlocks = () => {
    setNBlocks((prev) => {
      const newBlocks = Math.max(prev - 1, 0);
      setNPeriods(
        getPeriodsFromBlocks(totalTasksTime, totalRoutinesTime, newBlocks),
      );
      return newBlocks;
    });
  };

  const incrementPeriods = () => {
    setNPeriods((prev) => {
      const newPeriods = prev + 1;
      setNBlocks(
        getBlocksFromPeriods(totalTasksTime, totalRoutinesTime, newPeriods),
      );
      return newPeriods;
    });
  };

  const decrementPeriods = () => {
    setNPeriods((prev) => {
      const newPeriods = Math.max(prev - 1, 0);
      setNBlocks(
        getBlocksFromPeriods(totalTasksTime, totalRoutinesTime, newPeriods),
      );
      return newPeriods;
    });
  };

  const setInitialConstraints = (maxBlocks: number, leastBlocks: number) => {
    const blocks = Math.floor((maxBlocks + leastBlocks) / 2);
    const periods = getPeriodsFromBlocks(
      totalTasksTime,
      totalRoutinesTime,
      blocks,
    );
    setNBlocks(blocks);
    setNPeriods(periods);
  };

  return {
    nBlocks,
    incrementBlocks,
    decrementBlocks,
    nPeriods,
    incrementPeriods,
    decrementPeriods,
    setInitialConstraints,
  };
}
