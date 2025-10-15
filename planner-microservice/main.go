// package main

// import (
// 	"planner-microservice/handler"
// 	"planner-microservice/planner"

// 	"github.com/gofiber/fiber/v2"
// )

// func main() {
// 	planner.TestSamplePlanner()

// 	app := fiber.New()

// 	// Start worker pool
// 	handler.InitWorkerPool(10) // 10 concurrent workers

// 	// Job endpoint
// 	app.Post("/job", handler.HandleJob)

// 	app.Listen(":3000")
// }

package main

import (
	"log"
	"net"
	"planner-microservice/grpc_server"
	pb "planner-microservice/proto"

	"google.golang.org/grpc"
)

func main() {
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterPlannerServiceServer(s, grpc_server.NewPlannerServer())

	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
