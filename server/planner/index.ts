import TableCell from './tablecell';
import Task from './task';
import Routine from './routine';

import generateId from '../utils/generateId';

export type Unit = 'minute' | 'hour' | 'day' | 'week' | 'month';

export default class Planner {
  plan_title: string;
  build_unit: Unit;
  period_unit: Unit;
  tasks: Task[];
  routines: Routine[];
  n_periods: number;
  n_blocks: number;
  plan_id: string;
  constructor(
    plan_title: string,
    tasks: Task[],
    routines: Routine[],
    build_unit: Unit,
    period_unit: Unit,
    n_periods: number,
    n_blocks: number,
  ) {
    this.plan_title = plan_title;
    this.build_unit = build_unit;
    this.period_unit = period_unit;
    this.tasks = tasks;
    this.routines = routines;
    this.n_periods = n_periods;
    this.n_blocks = n_blocks;
    // this.plan_id = generateId();
  }

  result_array: TableCell[][] = [];

  static Divisor(value: number, totalTime: number) {
    return Math.ceil(totalTime / value);
  }

  static totalTime(_tasks: Task[], _routines: Routine[], _periods: number) {
    let sum = 0;
    if (_tasks.length) {
      sum = _tasks.reduce((accumulator, object) => {
        return accumulator + object.required_time;
      }, 0);
    }
    if (_routines.length) {
      sum +=
        _routines.reduce((accumulator, object) => {
          return accumulator + object.repeated_units;
        }, 0) * _periods;
    }
    return sum;
  }

  static totalTasksTime(_tasks: Task[]) {
    let sum = 0;
    if (_tasks) {
      sum = _tasks.reduce((accumulator, object) => {
        return accumulator + object.required_time;
      }, 0);
    }
    return sum;
  }

  static leastBlocks(_tasks: Task[], _routines: Routine[]) {
    let blocks = 0;
    for (let task of _tasks) {
      if (!task.isDivisible) {
        blocks = task.required_time > blocks ? task.required_time : blocks;
      }
    }
    if (blocks === 0) {
      blocks++;
    }
    if (_routines) {
      for (let routine of _routines) {
        blocks += routine.repeated_units;
      }
    }
    return blocks;
  }

  static maxBlocks(_tasks: Task[], _routines: Routine[], blocks_unit: Unit) {
    const maxPossibleBlocks =
      blocks_unit === 'hour' ? 24 : blocks_unit === 'day' ? 7 : 4;
    let p = 1;
    let blocks = this.n_blocksFromPeriods(_tasks, _routines, p);
    while (blocks > maxPossibleBlocks) {
      blocks = this.n_blocksFromPeriods(_tasks, _routines, ++p);
    }
    return blocks;
  }

  static leastPeriods(_tasks: Task[], _routines: Routine[], maxBlocks: number) {
    return this.n_periodsFromBlocks(_tasks, _routines, maxBlocks);
  }

  static maxPeriods(_tasks: Task[], _routines: Routine[], leastBlocks: number) {
    return this.n_periodsFromBlocks(_tasks, _routines, leastBlocks);
  }

  // validate that the least blocks are less than the maximoum possible blocks
  static isValid(__tasks: Task[], __routines: Routine[], blocks_unit: string) {
    const maxPossibleBlocks =
      blocks_unit.toLowerCase() === 'hour'
        ? 24
        : blocks_unit.toLowerCase() === 'day'
          ? 7
          : 4;
    let leastBlocks = this.leastBlocks(__tasks, __routines);
    return leastBlocks <= maxPossibleBlocks;
  }

  static n_periodsFromBlocks(
    _tasks: Task[],
    _routines: Routine[],
    n_blocks: number,
  ) {
    const totalTasksTime = this.totalTasksTime(_tasks);
    const routinesPerPeriod = this.totalTime([], _routines, 1);
    return this.Divisor(n_blocks - routinesPerPeriod, totalTasksTime);
  }

  static n_blocksFromPeriods(
    _tasks: Task[],
    _routines: Routine[],
    n_periods: number,
  ) {
    const totalTime = this.totalTime(_tasks, _routines, n_periods);
    return this.Divisor(n_periods, totalTime);
  }

  totalTimeInPeriodUnit() {
    const timeUnitsValue: { [key in Unit]: number } = {
      minute: 1,
      hour: 60,
      day: 1440,
      week: 10080,
      month: 43200,
    };
    const totalTimeInMinutes =
      Planner.totalTime(this.tasks, this.routines, this.n_periods) *
      timeUnitsValue[this.build_unit];
    const totalTime = Math.round(
      totalTimeInMinutes / timeUnitsValue[this.period_unit],
    );
    return `${totalTime} ${this.period_unit}`;
  }

  #sortascending(a: Task, b: Task) {
    if (!a.isDivisible) {
      return -1;
    }
    if (!b.isDivisible) {
      return 1;
    }
    return a.required_time - b.required_time;
  }

  #isPlacesAvailable = (freq: number, index: number) => {
    if (this.result_array[index].length + freq > this.n_blocks) {
      return false;
    }
    return true;
  };

  #addRoutine(routine: Routine) {
    for (let i = 0; i < this.n_periods; i++) {
      // initialize array[i] if not defined
      if (!this.result_array[i]) {
        this.result_array[i] = [];
      }
      for (let j = 0; j < routine.repeated_units; j++) {
        // TODO: try to replace unshift with push
        this.result_array[i].unshift(new TableCell('routine', routine.id));
      }
    }
  }

  #calcFrequencyForXPeriod = (task_time: number, number_of_periods: number) => {
    return Math.ceil(task_time / number_of_periods);
  };

  #generateAvailability(TBF: number) {
    // TBF ==> taskBlocksFrequency
    let totalAvailablePlaces = 0;
    for (let period of this.result_array) {
      totalAvailablePlaces += this.n_blocks - period.length;
    }
    // this.result_array.reduce(
    //     (a, b) => this.n_blocks - a.length + (this.n_blocks - b.length)
    // );
    let av_index;
    if (TBF <= totalAvailablePlaces) {
      let shortest = this.result_array.reduce((a, b) =>
        a.length > b.length ? b : a,
      );
      // TODO: try to remove indexOf and calculate it during the loop before
      av_index = this.result_array.indexOf(shortest);
      const n_items_to_move = TBF - (this.n_blocks - shortest.length);
      outer: for (let i = 0; i < n_items_to_move; i++) {
        let _item = { ...shortest[shortest.length - 1] } as TableCell;
        for (let period of this.result_array) {
          if (
            period.length < this.n_blocks &&
            this.result_array.indexOf(period) != av_index
          ) {
            period.push(_item);
            shortest.splice(shortest.length - 1, 1);
            continue outer;
          }
        }
      }
    } else {
      // no place available, so add a period.
      this.result_array.push([]);
      this.n_periods++;
      av_index = this.result_array.length - 1;
    }
    return av_index;
  }

  generateTable() {
    /*
            returns a 2D array x * y where: 
            x: number of period_unit needed 
            y: numberOfBlocks per period_unit
            y is an array of (id)s
            */
    // make sure the result_array is clear
    this.result_array = [];
    // add routines
    for (let routine of this.routines) {
      this.#addRoutine(routine);
    }
    // add tasks to priority queues
    let highPriority: Task[] = [],
      normalPriority: Task[] = [],
      lowPriority: Task[] = [];
    // Making a deep clone of tasks to keep original data
    let tasksClone = [];
    for (let _task of this.tasks) {
      tasksClone.push({ ..._task });
    }

    tasksClone.forEach((task) => {
      switch (task.priority) {
        case 1:
          highPriority.push(task);
          break;
        case 2:
          normalPriority.push(task);
          break;
        case 3:
          lowPriority.push(task);
          break;
      }
    });

    // main function
    const addTaskToResultArray = (task: Task) => {
      // define default value for taskBlocksFrequency & handle undivisible
      let taskBlocksFrequency: number;
      if (!task.isDivisible) {
        taskBlocksFrequency = task.required_time;
      } else {
        taskBlocksFrequency = this.#calcFrequencyForXPeriod(
          task.required_time,
          this.n_periods,
        );
      }
      // flag to check if frequency changed
      let changed = false;
      // declare remaining_n_periods
      let remaining_n_periods;
      // function adds task to result_array
      const pushToResultArray = (index: number) => {
        for (let x = 0; x < taskBlocksFrequency; x++) {
          if (task.required_time === 0) {
            break;
          }
          this.result_array[index].push(new TableCell('task', task.id));
          task.required_time--;
        }
      };

      // main function to add task dependent on all occasions
      const Pusher = () => {
        // main loop on all periods
        for (let i = 0; i < this.n_periods; i++) {
          // initialize array[i] if not defined
          if (!this.result_array[i]) {
            this.result_array[i] = [];
          }
          // check if period is full
          if (this.result_array[i].length === this.n_blocks) {
            continue;
          }
          // handle unDivisbile tasks
          if (!task.isDivisible) {
            if (this.#isPlacesAvailable(taskBlocksFrequency, i)) {
              pushToResultArray(i);
            }
            continue;
          }

          // recalculate taskBlocksFrequency if changed
          if (changed) {
            remaining_n_periods = this.n_periods - (i + 1);
            this.#calcFrequencyForXPeriod(
              task.required_time,
              remaining_n_periods,
            );
            changed = false;
          }
          // push to result array depending on availability
          if (this.#isPlacesAvailable(taskBlocksFrequency, i)) {
            pushToResultArray(i);
            if (task.required_time === 0) {
              return;
            }
          } else {
            // no places available on array[i]
            while (!this.#isPlacesAvailable(taskBlocksFrequency, i)) {
              taskBlocksFrequency--;
              changed = true;
            } // now there are places available
            pushToResultArray(i);
            if (task.required_time === 0) {
              return;
            }
          }
        }
        // recurse if required_time has not finished
        if (task.required_time > 0) {
          if (!task.isDivisible) {
            let av_index = this.#generateAvailability(taskBlocksFrequency); // returns index of available place
            pushToResultArray(av_index);
          } else {
            this.#calcFrequencyForXPeriod(task.required_time, this.n_periods);
            Pusher();
          }
        }
      };
      // call Pusher function
      Pusher();
    };
    // sorting priority queues (unDivisbile first) then (shortest job first)
    // calling addTaskToResultArray for each task per prioirity
    if (highPriority.length) {
      highPriority = highPriority.sort(this.#sortascending);
      highPriority.forEach((task) => addTaskToResultArray(task));
    }
    if (normalPriority.length) {
      normalPriority = normalPriority.sort(this.#sortascending);
      normalPriority.forEach((task) => addTaskToResultArray(task));
    }
    if (lowPriority.length) {
      lowPriority = lowPriority.sort(this.#sortascending);
      lowPriority.forEach((task) => addTaskToResultArray(task));
    }
    // now the result array should be ready
    return this.result_array;
  }
}

/**
 * Time levels per plan: (example)
 I have to finish my tasks in n weeks : n ==> period_unit
 every task will consist of x days : x ==> build_unit
 */

// sample usage:
/*
    let mytasks = []; 
    mytasks.push(new Task('Next.js', '', '', 19))
    mytasks.push(new Task('socket.io', '', '', 8))
    mytasks.push(new Task('RN-Animated', '', '', 5))
    let myroutines = [];
    myroutines.push(new Routine('gym', '', '', 1)); 
    const routinesDailyTotal = myroutines.reduce((a,b)=> a + b.repeated_units ,0)
    let blocks = 4; 
    let totalTasksTime = Planner.totalTasksTime(mytasks); 
    let periods = Planner.Divisor(blocks, totalTasksTime); 
    blocks += routinesDailyTotal; 
    // validation
    // if (Math.ceil(totalTime / periods) >= blocks){throw new Error('Invaild time data')}
    let plan = new Planner(mytasks, myroutines, 'hour', 'day', periods, blocks); 
    const result = plan.generateTable(); 
    console.log('Table of Results: ')
    for (let row of result){
        console.log('Day:', row.map(item=> item.cell_id).join(' | '))
    }
 */
