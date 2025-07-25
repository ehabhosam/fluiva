const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.resolve(
  __dirname,
  "../planner-microservice/proto/planner.proto",
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Fix: Load the correct package definition
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const plannerService = protoDescriptor.planner.PlannerService; // Note: using 'planner' instead of 'proto'

function main() {
  // Create client using the correct service
  const client = new plannerService(
    "localhost:80",
    grpc.credentials.createInsecure(),
  );

  // Configurable number of tasks and routines
  const NUM_TASKS = 5;
  const NUM_ROUTINES = 2;

  const tasks = [];
  for (let i = 1; i <= NUM_TASKS; i++) {
    tasks.push({
      todo: {
        id: String(i),
        title: `Task ${i}`,
        description: `Description for Task ${i}`,
        required_time: 2 + i, // Example: required_time increases with i
        type: "task",
      },
      priority: Math.floor(Math.random() * 3) + 1, // 1-3
      is_breakable: true, // Example: alternate breakable
    });
  }

  const routines = [];
  for (let i = 1; i <= NUM_ROUTINES; i++) {
    routines.push({
      todo: {
        id: String(i),
        title: `Routine ${i}`,
        description: `Description for Routine ${i}`,
        required_time: 1, // Example: all routines take 1 hour
        type: "routine",
      },
    });
  }

  const todosMap = new Map();
  tasks.forEach((task) => todosMap.set(task.todo.id, task.todo));
  routines.forEach((routine) => todosMap.set(routine.todo.id, routine.todo));

  // First, get time constraints from the service (do not send n_periods or n_blocks)
  const timeConstraintsRequest = {
    tasks,
    routines,
    blocks_unit: "hour",
  };

  client.getTimeConstraints(timeConstraintsRequest, (tcError, tcResponse) => {
    if (tcError) {
      console.error("Error getting time constraints:", tcError);
      return;
    }

    console.log("Time Constraints:");
    console.log("Least Blocks:", tcResponse.least_blocks);
    console.log("Max Blocks:", tcResponse.max_blocks);
    console.log("Least Periods:", tcResponse.least_periods);
    console.log("Max Periods:", tcResponse.max_periods);

    const n_blocks = Math.round(
      (tcResponse.max_blocks + tcResponse.least_blocks) / 2,
    );
    const totalTasksTime = tasks.reduce((a, t) => {
      return a + t.todo.required_time;
    }, 0);
    const totalRoutinesTime = routines.reduce((a, t) => {
      return a + t.todo.required_time;
    }, 0);
    const n_periods = Math.ceil(
      totalTasksTime / (n_blocks - totalRoutinesTime),
    );

    console.log("total tasks time:", totalTasksTime);
    console.log("total routines time", totalRoutinesTime);

    console.log(`-------  ${n_blocks} hour/s per ${n_periods} day/s ------- `);

    // Use max_blocks and least_periods for the generatePlan request
    const request = {
      build_unit: "hour",
      period_unit: "day",
      tasks,
      routines,
      n_periods,
      n_blocks,
    };

    const big_request = {
      build_unit: "hour",
      period_unit: "day",
      tasks: [
        {
          todo: {
            id: "1",
            title: "Task 1",
            description: "",
            required_time: 18,
            type: "task",
          },
          priority: 2,
          is_breakable: true,
        },
        {
          todo: {
            id: "2",
            title: "Task 2",
            description: "",
            required_time: 19,
            type: "task",
          },
          priority: 3,
          is_breakable: false,
        },
        {
          todo: {
            id: "3",
            title: "Task 3",
            description: "",
            required_time: 16,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
        {
          todo: {
            id: "4",
            title: "Task 4",
            description: "",
            required_time: 10,
            type: "task",
          },
          priority: 2,
          is_breakable: true,
        },
        {
          todo: {
            id: "5",
            title: "Task 5",
            description: "",
            required_time: 11,
            type: "task",
          },
          priority: 3,
          is_breakable: false,
        },
        {
          todo: {
            id: "6",
            title: "Task 6",
            description: "",
            required_time: 11,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
        {
          todo: {
            id: "7",
            title: "Task 7",
            description: "",
            required_time: 13,
            type: "task",
          },
          priority: 2,
          is_breakable: true,
        },
        {
          todo: {
            id: "8",
            title: "Task 8",
            description: "",
            required_time: 15,
            type: "task",
          },
          priority: 3,
          is_breakable: true,
        },
        {
          todo: {
            id: "9",
            title: "Task 9",
            description: "",
            required_time: 18,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
        {
          todo: {
            id: "10",
            title: "Task 10",
            description: "",
            required_time: 16,
            type: "task",
          },
          priority: 2,
          is_breakable: true,
        },
        {
          todo: {
            id: "11",
            title: "Task 11",
            description: "",
            required_time: 15,
            type: "task",
          },
          priority: 3,
          is_breakable: true,
        },
        {
          todo: {
            id: "12",
            title: "Task 12",
            description: "",
            required_time: 17,
            type: "task",
          },
          priority: 1,
          is_breakable: false,
        },
        {
          todo: {
            id: "13",
            title: "Task 13",
            description: "",
            required_time: 11,
            type: "task",
          },
          priority: 2,
          is_breakable: false,
        },
        {
          todo: {
            id: "14",
            title: "Task 14",
            description: "",
            required_time: 12,
            type: "task",
          },
          priority: 3,
          is_breakable: true,
        },
        {
          todo: {
            id: "15",
            title: "Task 15",
            description: "",
            required_time: 19,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
        {
          todo: {
            id: "16",
            title: "Task 16",
            description: "",
            required_time: 13,
            type: "task",
          },
          priority: 2,
          is_breakable: true,
        },
        {
          todo: {
            id: "17",
            title: "Task 17",
            description: "",
            required_time: 12,
            type: "task",
          },
          priority: 3,
          is_breakable: true,
        },
        {
          todo: {
            id: "18",
            title: "Task 18",
            description: "",
            required_time: 19,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
        {
          todo: {
            id: "19",
            title: "Task 19",
            description: "",
            required_time: 15,
            type: "task",
          },
          priority: 2,
          is_breakable: true,
        },
        {
          todo: {
            id: "20",
            title: "Task 20",
            description: "",
            required_time: 18,
            type: "task",
          },
          priority: 3,
          is_breakable: false,
        },
        {
          todo: {
            id: "21",
            title: "Task 21",
            description: "",
            required_time: 15,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
        {
          todo: {
            id: "22",
            title: "Task 22",
            description: "",
            required_time: 14,
            type: "task",
          },
          priority: 2,
          is_breakable: false,
        },
        {
          todo: {
            id: "23",
            title: "Task 23",
            description: "",
            required_time: 16,
            type: "task",
          },
          priority: 3,
          is_breakable: true,
        },
        {
          todo: {
            id: "24",
            title: "Task 24",
            description: "",
            required_time: 14,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
        {
          todo: {
            id: "25",
            title: "Task 25",
            description: "",
            required_time: 19,
            type: "task",
          },
          priority: 2,
          is_breakable: true,
        },
        {
          todo: {
            id: "26",
            title: "Task 26",
            description: "",
            required_time: 12,
            type: "task",
          },
          priority: 3,
          is_breakable: true,
        },
        {
          todo: {
            id: "27",
            title: "Task 27",
            description: "",
            required_time: 18,
            type: "task",
          },
          priority: 1,
          is_breakable: false,
        },
        {
          todo: {
            id: "28",
            title: "Task 28",
            description: "",
            required_time: 18,
            type: "task",
          },
          priority: 2,
          is_breakable: false,
        },
        {
          todo: {
            id: "29",
            title: "Task 29",
            description: "",
            required_time: 12,
            type: "task",
          },
          priority: 3,
          is_breakable: true,
        },
        {
          todo: {
            id: "30",
            title: "Task 30",
            description: "",
            required_time: 11,
            type: "task",
          },
          priority: 1,
          is_breakable: true,
        },
      ],
      routines: [
        {
          todo: {
            id: "r1",
            title: "Routine 1",
            description: "",
            required_time: 1,
            type: "routine",
          },
          repeated_units: 2,
        },
        {
          todo: {
            id: "r2",
            title: "Routine 2",
            description: "",
            required_time: 1,
            type: "routine",
          },
          repeated_units: 1,
        },
        {
          todo: {
            id: "r3",
            title: "Routine 3",
            description: "",
            required_time: 1,
            type: "routine",
          },
          repeated_units: 1,
        },
        {
          todo: {
            id: "r4",
            title: "Routine 4",
            description: "",
            required_time: 1,
            type: "routine",
          },
          repeated_units: 1,
        },
        {
          todo: {
            id: "r5",
            title: "Routine 5",
            description: "",
            required_time: 1,
            type: "routine",
          },
          repeated_units: 1,
        },
      ],
      n_periods: 35,
      n_blocks: 18,
    };

    client.generatePlan(big_request, (error, response) => {
      if (error) {
        console.error("Error:", error);
        return;
      }

      console.log("\nPlan generated successfully!");
      console.log("Total time:", response.total_time);
      console.log("\nPeriods:");
      response.periods.forEach((period, index) => {
        console.log(`\nPeriod ${index + 1}:`);
        period.cells.forEach((cell) => {
          // console.log(`- ${cell.type}: ${todosMap.get(cell.todo_id).title}`);
          console.log(`- ${cell.type}: ${cell.todo_id}`);
        });
      });
    });
  });
}

main();
