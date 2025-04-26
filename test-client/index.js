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

  const request = {
    build_unit: "hour",
    period_unit: "day",
    tasks,
    routines,
    n_periods: 5,
    n_blocks: 5,
  };

  client.generatePlan(request, (error, response) => {
    if (error) {
      console.error("Error:", error);
      return;
    }

    console.log("Plan generated successfully!");
    console.log("Total time:", response.total_time);
    console.log("\nPeriods:");
    response.periods.forEach((period, index) => {
      console.log(`\nPeriod ${index + 1}:`);
      period.cells.forEach((cell) => {
        console.log(`- ${cell.type}: ${todosMap.get(cell.todo_id).title}`);
      });
    });
  });
}

main();
