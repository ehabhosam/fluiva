## Running a Basic Load Test

```sh
ghz \
  --insecure \
  --proto ../planner-microservice/proto/planner.proto \
  --call planner.PlannerService.GeneratePlan \
  --concurrency 10 \
  --total 100 \
  --data-file request.json \
  localhost:50051
```

- `--insecure`: Use if your server does not use TLS.
- `--proto`: Path to the proto file (relative to this directory).
- `--call`: The full RPC method to test.
- `--concurrency`: Number of concurrent requests.
- `--total`: Total number of requests to send.
- `--data-file`: Path to the JSON file with the request payload.
- `localhost:50051`: Address of the running gRPC server.

---

## Running a Harder Load Test

Increase concurrency and total requests for a more intense test:

```sh
ghz \
  --insecure \
  --proto ../planner-microservice/proto/planner.proto \
  --call planner.PlannerService.GeneratePlan \
  --concurrency 50 \
  --total 1000 \
  --data-file request.json \
  localhost:50051
```
