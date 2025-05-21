const fs = require("fs");
const { isBigUint64Array } = require("util/types");

// Helper functions from your Planner logic (simplified for JS)
function totalTasksTime(tasks) {
  return tasks.reduce((acc, t) => acc + t.todo.required_time, 0);
}
function totalRoutinesTime(routines, n_periods) {
  return routines.reduce((acc, r) => acc + r.repeated_units, 0) * n_periods;
}
function totalRoutinesTimePerPeriod(routines) {
  return routines.reduce((acc, r) => acc + r.repeated_units, 0);
}
function Divisor(value, totalTime) {
  return Math.ceil(totalTime / value);
}

// Generate many tasks and routines
const tasks = [];
for (let i = 1; i <= 5; i++) {
  tasks.push({
    todo: {
      id: `${i}`,
      title: `Task ${i}`,
      description: "",
      required_time: Math.floor(Math.random() * 10) + 10, // 10-19
      type: "task",
    },
    priority: (i % 3) + 1,
    is_breakable: Math.random() > 0.3,
  });
}
const routines = [];
for (let i = 1; i <= 1; i++) {
  routines.push({
    todo: {
      id: `r${i}`,
      title: `Routine ${i}`,
      description: "",
      required_time: 1,
      type: "routine",
    },
    repeated_units: Math.floor(Math.random() * 2) + 1, // 1-2
  });
}

// Calculate constraints
const build_unit = "hour";
const period_unit = "day";
const totalTasks = totalTasksTime(tasks);
console.log(`Total tasks: ${totalTasks}`);
const totalRoutinesPerPeriod = totalRoutinesTimePerPeriod(routines);
console.log(`Total routines per period: ${totalRoutinesPerPeriod}`);
const n_blocks = 6;
const n_periods = Math.ceil(totalTasks / (n_blocks - totalRoutinesPerPeriod));

console.log(`Number of blocks: ${n_blocks}`);
console.log(`Number of periods: ${n_periods}`);

// Compose request
const request = {
  build_unit,
  period_unit,
  tasks,
  routines,
  n_periods,
  n_blocks,
};

fs.writeFileSync("big-request.json", JSON.stringify(request, null, 2));
console.log(
  "Generated request.json with",
  tasks.length,
  "tasks and",
  routines.length,
  "routines.",
);
