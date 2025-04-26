if you update the proto file, you have to regenerate the proto go files with the new updates using this command:

```bash
protoc --go_out=. --go_opt=paths=source_relative \          unixehab@unixehab-pc
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/planner.proto
```
