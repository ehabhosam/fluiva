# PlanSync Planner Microservice API Documentation

This document outlines the gRPC API provided by the PlanSync Planner Microservice, which is responsible for generating optimized time schedules based on tasks and routines.

## Overview

The Planner Microservice is a Go-based gRPC service that handles complex scheduling algorithms for PlanSync. It receives information about tasks and routines, along with scheduling constraints, and returns an optimized schedule arranged in periods and blocks.

## Service Definition

The service is defined in `proto/planner.proto` and offers the following RPC methods:

```proto
service PlannerService {
    rpc GeneratePlan (PlanRequest) returns (PlanResponse) {}
    rpc GetTimeConstraints (TimeConstraintsRequest) returns (TimeConstraintsResponse) {}
}
```

## Data Models

### Core Data Types

#### Todo

Represents a basic task or routine item:

```proto
message Todo {
    string id = 1;
    string title = 2;
    string description = 3;
    int32 required_time = 4;
    string type = 5;
}
```

#### Task

A specialized Todo with priority and breakability properties:

```proto
message Task {
    Todo todo = 1;
    int32 priority = 2;
    bool is_breakable = 3;
}
```

#### Routine

A specialized Todo that represents recurring activities:

```proto
message Routine {
    Todo todo = 1;
}
```

#### TableCell

Represents a single cell in the generated schedule:

```proto
message TableCell {
    string type = 1;
    string todo_id = 2;
}
```

#### Period

A collection of table cells representing a time period:

```proto
message Period {
    repeated TableCell cells = 1;
}
```

## API Methods

### 1. Generate Plan

Generates an optimized schedule based on the given tasks, routines, and constraints.

#### Request: PlanRequest

```proto
message PlanRequest {
    string build_unit = 1;      // Time unit for blocks (e.g., "15min", "30min")
    string period_unit = 2;     // Time unit for periods (e.g., "day", "hour")
    repeated Task tasks = 3;    // Tasks to schedule
    repeated Routine routines = 4; // Routines to schedule
    int32 n_periods = 5;        // Number of periods to generate
    int32 n_blocks = 6;         // Number of blocks per period
}
```

#### Response: PlanResponse

```proto
message PlanResponse {
    repeated Period periods = 1;   // Generated periods with assigned tasks
    string total_time = 2;         // Total time estimation (e.g., "14 days")
}
```

#### Example Usage

```go
client := pb.NewPlannerServiceClient(conn)
res, err := client.GeneratePlan(context.Background(), &pb.PlanRequest{
    BuildUnit:  "30min",
    PeriodUnit: "day",
    Tasks: []*pb.Task{
        {
            Todo: &pb.Todo{
                Id:           "1",
                Title:        "Complete assignment",
                Description:  "Finish math homework",
                RequiredTime: 120, // in minutes
                Type:         "task",
            },
            Priority:    3, // high priority
            IsBreakable: true,
        },
    },
    Routines: []*pb.Routine{
        {
            Todo: &pb.Todo{
                Id:           "2",
                Title:        "Morning exercise",
                Description:  "Daily workout",
                RequiredTime: 30, // in minutes
                Type:         "routine",
            },
        },
    },
    NPeriods: 7,  // e.g., 7 days
    NBlocks:  16, // e.g., 16 blocks per day
})
```

### 2. Get Time Constraints

Calculates time constraints based on a set of tasks and routines.

#### Request: TimeConstraintsRequest

```proto
message TimeConstraintsRequest {
    repeated Task tasks = 1;
    repeated Routine routines = 2;
    string blocks_unit = 3;  // The unit for blocks (e.g., "hour", "day")
}
```

#### Response: TimeConstraintsResponse

```proto
message TimeConstraintsResponse {
    int32 least_blocks = 1;   // Minimum blocks required
    int32 max_blocks = 2;     // Maximum blocks possible
    int32 least_periods = 3;  // Minimum periods required
    int32 max_periods = 4;    // Maximum periods possible
}
```

#### Example Usage

```go
client := pb.NewPlannerServiceClient(conn)
res, err := client.GetTimeConstraints(context.Background(), &pb.TimeConstraintsRequest{
    Tasks: []*pb.Task{
        {
            Todo: &pb.Todo{
                Id:           "1",
                Title:        "Complete assignment",
                Description:  "Finish math homework",
                RequiredTime: 120,
                Type:         "task",
            },
            Priority:    3,
            IsBreakable: true,
        },
    },
    Routines: []*pb.Routine{
        {
            Todo: &pb.Todo{
                Id:           "2",
                Title:        "Morning exercise",
                Description:  "Daily workout",
                RequiredTime: 30,
                Type:         "routine",
            },
        },
    },
    BlocksUnit: "day",
})
```

## Scheduling Logic

The microservice implements the following scheduling priorities:

1. **Unbreakable tasks** are scheduled as continuous blocks
2. **High priority tasks** are scheduled before normal and low priority tasks
3. **Routines** are inserted at the beginning of each period
4. The scheduler attempts to **distribute tasks optimally** across periods

## Error Handling

The service returns standard gRPC error codes:

- `INVALID_ARGUMENT`: When the request contains invalid parameters
- `UNAVAILABLE`: When the service is unavailable
- `INTERNAL`: For internal server errors

## Environment Configuration

The service runs on port `50051` by default, which can be modified using the following environment variables:

- `PLANNER_SERVICE_HOST`: Host address (default: localhost)
- `PLANNER_SERVICE_PORT`: Port number (default: 50051)

## Deployment

The service can be built and run using the provided Makefile:

```bash
# Build the application
make build

# Run the application
make run

# Clean build artifacts
make clean
```

## Proto Generation

If you update the proto file, regenerate the Go files with:

```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/planner.proto
```

## Priority Values

Task priorities are represented as integers:
- `1`: Low priority
- `2`: Normal priority
- `3`: High priority