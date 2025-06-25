package grpc_server

import (
	"context"
	"fmt"
	"planner-microservice/planner"
	pb "planner-microservice/proto"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type PlannerServer struct {
	pb.UnimplementedPlannerServiceServer
}

func NewPlannerServer() *PlannerServer {
	return &PlannerServer{}
}

func (s *PlannerServer) GeneratePlan(ctx context.Context, req *pb.PlanRequest) (*pb.PlanResponse, error) {

	// ... (rest of your existing GeneratePlan logic)
	// Convert proto tasks to planner tasks
	tasks := make([]planner.Task, len(req.Tasks))

	for i, protoTask := range req.Tasks {
		tasks[i] = *planner.NewTask(
			protoTask.Todo.Id,
			protoTask.Todo.Title,
			protoTask.Todo.Description,
			int(protoTask.Todo.RequiredTime),
			int(protoTask.Priority),
			protoTask.IsBreakable,
		)
	}

	// Convert proto routines to planner routines
	routines := make([]planner.Routine, len(req.Routines))
	for i, protoRoutine := range req.Routines {
		routines[i] = *planner.NewRoutine(
			protoRoutine.Todo.Id,
			protoRoutine.Todo.Title,
			protoRoutine.Todo.Description,
			int(protoRoutine.Todo.RequiredTime),
		)
	}

	// Create new planner
	planner := planner.NewPlanner(
		req.BuildUnit,
		req.PeriodUnit,
		tasks,
		routines,
		int(req.NPeriods),
		int(req.NBlocks),
	)

	// Validate plan parameters
	if !planner.ValidatePlanParameters() {
		return nil, status.Error(codes.InvalidArgument, "invalid plan parameters")
	}

	// Generate table
	table := planner.GenerateTable()

	// Convert table to response format
	periods := make([]*pb.Period, len(table))
	for i, period := range table {
		cells := make([]*pb.TableCell, len(period))
		for j, cell := range period {
			cells[j] = &pb.TableCell{
				Type:   cell.Type,
				TodoId: cell.TodoId,
			}
		}
		periods[i] = &pb.Period{
			Cells: cells,
		}
	}

	return &pb.PlanResponse{
		Periods:   periods,
		TotalTime: planner.TotalTimeInPeriodUnit(),
	}, nil
}

func (s *PlannerServer) GetTimeConstraints(ctx context.Context, req *pb.TimeConstraintsRequest) (*pb.TimeConstraintsResponse, error) {
	// Convert proto tasks to planner tasks
	tasks := make([]planner.Task, len(req.Tasks))
	for i, protoTask := range req.Tasks {
		tasks[i] = *planner.NewTask(
			protoTask.Todo.Id,
			protoTask.Todo.Title,
			protoTask.Todo.Description,
			int(protoTask.Todo.RequiredTime),
			int(protoTask.Priority),
			protoTask.IsBreakable,
		)
	}

	// Convert proto routines to planner routines
	routines := make([]planner.Routine, len(req.Routines))
	for i, protoRoutine := range req.Routines {
		routines[i] = *planner.NewRoutine(
			protoRoutine.Todo.Id,
			protoRoutine.Todo.Title,
			protoRoutine.Todo.Description,
			int(protoRoutine.Todo.RequiredTime),
		)
	}

	fmt.Println(tasks)
	fmt.Println(routines)

	// For leastBlocks and maxBlocks, use periods = 1 as default for leastBlocks, and blocks_unit for maxBlocks
	leastBlocks := planner.LeastBlocks(tasks, routines, 1)
	maxBlocks := planner.MaxBlocks(tasks, routines, req.BlocksUnit)

	// For leastPeriods and maxPeriods, use maxBlocks and leastBlocks as arguments
	leastPeriods := planner.LeastPeriods(tasks, routines, maxBlocks)
	maxPeriods := planner.MaxPeriods(tasks, routines, leastBlocks)

	return &pb.TimeConstraintsResponse{
		LeastBlocks:  int32(leastBlocks),
		MaxBlocks:    int32(maxBlocks),
		LeastPeriods: int32(leastPeriods),
		MaxPeriods:   int32(maxPeriods),
	}, nil
}
