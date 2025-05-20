package grpc_server

import (
	"context"
	"fmt"

	// "planner-microservice/planner"
	pb "planner-microservice/proto"
	"planner-microservice/worker"
	"time"
)

type PlannerServer struct {
	pb.UnimplementedPlannerServiceServer
	jobQueue chan worker.Job
}

func NewPlannerServer(workerCount int) *PlannerServer {
	server := &PlannerServer{
		jobQueue: make(chan worker.Job, 10), // Buffer size of 10
	}

	// Initialize worker pool
	for i := 0; i < workerCount; i++ {
		go worker.StartWorker(server.jobQueue)
	}

	return server
}

func (s *PlannerServer) GeneratePlan(ctx context.Context, req *pb.PlanRequest) (*pb.PlanResponse, error) {
	// Create a job
	jobID := fmt.Sprintf("%d", time.Now().UnixNano())
	job := worker.Job{
		ID:           jobID,
		Request:      req,
		ResponseChan: make(chan *pb.PlanResponse, 1),
		ErrorChan:    make(chan error, 1),
	}

	// Submit job to worker pool
	select {
	case s.jobQueue <- job:
		// Wait for result or context cancellation
		select {
		case response := <-job.ResponseChan:
			return response, nil
		case err := <-job.ErrorChan:
			return nil, err
		case <-ctx.Done():
			return nil, ctx.Err()
		}
	default:
		return nil, fmt.Errorf("job queue is full")
	}
}
