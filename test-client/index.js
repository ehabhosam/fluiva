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
    "localhost:50051",
    grpc.credentials.createInsecure(),
  );

  const tasks = [
    {
      todo: {
        id: "1",
        title: "medicinal chemistry",
        description: "",
        required_time: 10,
        type: "task",
      },
      priority: 3,
      is_breakable: true,
    },
    {
      todo: {
        id: "2",
        title: "sterial dosage form",
        description: "",
        required_time: 4,
        type: "task",
      },
      priority: 2,
      is_breakable: true,
    },
  ];

  const routines = [
    {
      todo: {
        id: "1",
        title: "Cook & Clean",
        description: "",
        required_time: 1,
        type: "routine",
      },
    },
  ];

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

    client.generatePlan(request, (error, response) => {
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
          console.log(`- ${cell.type}: ${todosMap.get(cell.todo_id).title}`);
        });
      });
    });
  });
}

main();
