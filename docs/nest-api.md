# PlanSync API Documentation

This document outlines the endpoints available in the PlanSync API for managing plans, todos, periods, and blocks.

## Base URL

All endpoints are relative to the base URL of your server, e.g., `https://api.plansync.com` or `http://localhost:3000`.

## Authentication

All endpoints require authentication. Include the authentication token in the `Authorization` header:

```
Authorization: Bearer your-jwt-token
```

The JWT token should contain a `sub` field with the user's ID.

## Plans API

### Get User Plans

Retrieves a list of all plans belonging to the authenticated user.

**Endpoint**: `GET /plan`

**Response**:

```json
[
  {
    "id": 1,
    "title": "Weekly Study Plan",
    "description": "My study plan for finals week",
    "type": "WEEKLY",
    "created_at": "2023-05-23T10:30:00.000Z",
    "_count": {
      "todos": 6,
      "periods": 7
    }
  },
  {
    "id": 2,
    "title": "Daily Work Schedule",
    "description": "My work routine",
    "type": "DAILY",
    "created_at": "2023-05-20T08:15:00.000Z",
    "_count": {
      "todos": 8,
      "periods": 3
    }
  }
]
```

### Get Plan Details

Retrieves complete data for a specific plan including all todos, periods, and blocks.

**Endpoint**: `GET /plan/:id`

**Parameters**:

- `id`: Plan ID (integer)

**Response**:

```json
{
  "id": 1,
  "title": "Weekly Study Plan",
  "description": "My study plan for finals week",
  "type": "WEEKLY",
  "user_id": "e1a66c88-ddb5-4876-8719-e5ec4eda63a4",
  "created_at": "2023-05-23T10:30:00.000Z",
  "deleted_at": null,
  "todos": [
    {
      "id": 1,
      "title": "Math Assignment",
      "description": "Complete calculus problems 1-20",
      "required_time": 120,
      "priority": "HIGH",
      "is_breakable": true,
      "type": "TASK",
      "plan_id": 1
    },
    {
      "id": 2,
      "title": "Morning Exercise",
      "description": "Daily workout routine",
      "required_time": 30,
      "priority": null,
      "is_breakable": false,
      "type": "ROUTINE",
      "plan_id": 1
    }
  ],
  "periods": [
    {
      "id": 1,
      "index": 0,
      "plan_id": 1,
      "blocks": [
        {
          "id": 1,
          "index": 0,
          "done_at": null,
          "period_id": 1,
          "todo_id": 2,
          "todo": {
            "id": 2,
            "title": "Morning Exercise",
            "description": "Daily workout routine",
            "required_time": 30,
            "priority": null,
            "is_breakable": false,
            "type": "ROUTINE",
            "plan_id": 1
          }
        },
        {
          "id": 2,
          "index": 1,
          "done_at": null,
          "period_id": 1,
          "todo_id": 1,
          "todo": {
            "id": 1,
            "title": "Math Assignment",
            "description": "Complete calculus problems 1-20",
            "required_time": 120,
            "priority": "HIGH",
            "is_breakable": true,
            "type": "TASK",
            "plan_id": 1
          }
        }
      ]
    }
  ]
}
```

### Get Time Constraints

Retrieves the valid time constraints for a specific plan type.

**Endpoint**: `GET /planner/time-constraints`

**Request Body**:

```json
{
  "tasks": [
    {
      "title": "Math Assignment",
      "description": "Complete calculus problems 1-20",
      "requiredTime": 120,
      "priority": "HIGH",
      "isBreakable": true
    }
  ],
  "routines": [
    {
      "title": "Morning Exercise",
      "description": "Daily workout routine",
      "requiredTime": 30
    }
  ],
  "blocksUnit": "hour"
}
```

**Response**:

```json
{
  "leastBlocks": 2,
  "maxBlocks": 8,
  "leastPeriods": 1,
  "maxPeriods": 4
}
```

### Generate Plan

Creates a new plan with todos and automatically generates periods and blocks based on the provided configuration.

**Endpoint**: `POST /plan`

**Request Body**:

```json
{
  "title": "My Weekly Study Plan",
  "description": "Study plan for finals week",
  "type": "WEEKLY",
  "buildUnit": "30min",
  "periodUnit": "day",
  "nPeriods": 7,
  "nBlocks": 16,
  "tasks": [
    {
      "title": "Math Assignment",
      "description": "Complete calculus problems 1-20",
      "requiredTime": 120,
      "priority": "HIGH",
      "isBreakable": true
    },
    {
      "title": "History Essay",
      "description": "Write 5-page essay on World War II",
      "requiredTime": 180,
      "priority": "NORMAL",
      "isBreakable": true
    }
  ],
  "routines": [
    {
      "title": "Morning Exercise",
      "description": "Daily workout routine",
      "requiredTime": 30
    },
    {
      "title": "Review Notes",
      "description": "Review class notes before bed",
      "requiredTime": 20
    }
  ]
}
```

**Response**:

```json
{
  "plan": {
    "id": 1,
    "title": "My Weekly Study Plan",
    "description": "Study plan for finals week",
    "type": "WEEKLY",
    "user_id": "e1a66c88-ddb5-4876-8719-e5ec4eda63a4",
    "created_at": "2023-05-23T10:30:00.000Z",
    "deleted_at": null,
    "todos": [...],
    "periods": [...]
  },
}
```

### Update Plan

Updates the metadata of a specific plan.

**Endpoint**: `POST /plan/:id`

**Parameters**:

- `id`: Plan ID (integer)

**Request Body**:

```json
{
  "title": "Updated Weekly Study Plan",
  "description": "Updated study plan for finals week",
  "type": "WEEKLY"
}
```

All fields in the request body are optional.

**Response**:

```json
{
  "id": 1,
  "title": "Updated Weekly Study Plan",
  "description": "Updated study plan for finals week",
  "type": "WEEKLY",
  "user_id": "e1a66c88-ddb5-4876-8719-e5ec4eda63a4",
  "created_at": "2023-05-23T10:30:00.000Z",
  "deleted_at": null
}
```

### Reorder Periods

Changes the ordering (indexes) of periods within a plan.

**Endpoint**: `POST /plan/reorder-periods`

**Request Body**:

```json
{
  "periods": [
    {
      "periodId": 1,
      "newIndex": 2
    },
    {
      "periodId": 2,
      "newIndex": 0
    },
    {
      "periodId": 3,
      "newIndex": 1
    }
  ]
}
```

**Response**:

```json
[
  {
    "id": 1,
    "index": 2,
    "plan_id": 1
  },
  {
    "id": 2,
    "index": 0,
    "plan_id": 1
  },
  {
    "id": 3,
    "index": 1,
    "plan_id": 1
  }
]
```

### Move Block

Moves a block from one period to another and/or changes its position within a period.

**Endpoint**: `POST /plan/move-block`

**Request Body**:

```json
{
  "blockId": 1,
  "targetPeriodId": 2,
  "targetIndex": 3
}
```

**Response**:

```json
{
  "id": 1,
  "index": 3,
  "done_at": null,
  "period_id": 2,
  "todo_id": 5,
  "todo": {
    "id": 5,
    "title": "Math Assignment",
    "description": "Complete calculus problems 1-20",
    "required_time": 120,
    "priority": "HIGH",
    "is_breakable": true,
    "type": "TASK",
    "plan_id": 1
  }
}
```

### Reorder Blocks

Changes the ordering (indexes) of blocks within a single period.

**Endpoint**: `POST /plan/reorder-blocks`

**Request Body**:

```json
{
  "periodId": 1,
  "blocks": [
    {
      "blockId": 1,
      "newIndex": 2
    },
    {
      "blockId": 2,
      "newIndex": 0
    },
    {
      "blockId": 3,
      "newIndex": 1
    }
  ]
}
```

**Response**:

```json
[
  {
    "id": 1,
    "index": 2,
    "done_at": null,
    "period_id": 1,
    "todo_id": 3
  },
  {
    "id": 2,
    "index": 0,
    "done_at": null,
    "period_id": 1,
    "todo_id": 1
  },
  {
    "id": 3,
    "index": 1,
    "done_at": null,
    "period_id": 1,
    "todo_id": 2
  }
]
```

## Data Models

### Plan Types

```
enum PlanType {
  DAILY
  WEEKLY
  MONTHLY
}
```

### Todo Types

```
enum TodoType {
  TASK
  ROUTINE
}
```

### Priority Levels

```
enum Priority {
  LOW
  NORMAL
  HIGH
}
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid input (e.g., validation errors)
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses include a message describing the error:

```json
{
  "statusCode": 404,
  "message": "Plan with ID 123 not found",
  "error": "Not Found"
}
```

### Complete Block

Marks a block as completed or incomplete.

**Endpoint**: `POST /plan/complete-block`

**Request Body**:

```json
{
  "blockId": 1,
  "completed": true
}
```

The `completed` field is optional and defaults to `true`. Setting it to `false` will mark the block as incomplete.

**Response**:

```json
{
  "id": 1,
  "index": 0,
  "done_at": "2023-05-23T15:45:30.000Z",
  "period_id": 1,
  "todo_id": 5,
  "todo": {
    "id": 5,
    "title": "Math Assignment",
    "description": "Complete calculus problems 1-20",
    "required_time": 120,
    "priority": "HIGH",
    "is_breakable": true,
    "type": "TASK",
    "plan_id": 1
  }
}
```

When marking as incomplete, the `done_at` field will be `null`.

## Tips for Consumption

1. Always include the authentication token in requests
2. Handle errors gracefully by checking status codes
3. When moving or reordering items, ensure IDs are valid and belong to the authenticated user
4. For plan generation, ensure all required fields are provided

## User API

### Get User Profile

Retrieves the profile information of the authenticated user.

**Endpoint**: `GET /user/profile`

**Response**:

```json
{
  "id": "e1a66c88-ddb5-4876-8719-e5ec4eda63a4",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2023-05-10T15:30:00.000Z",
  "updated_at": "2023-05-15T09:45:00.000Z"
}
```

### Upsert User

Creates a new user record or updates an existing one based on the authenticated user information.

**Endpoint**: `POST /user/upsert`

**Response**:

```json
{
  "id": "e1a66c88-ddb5-4876-8719-e5ec4eda63a4",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2023-05-10T15:30:00.000Z",
  "updated_at": "2023-05-23T14:20:00.000Z"
}
```

This API documentation provides the necessary information for frontend applications to effectively interact with the PlanSync backend services.
