package worker

import (
	"planner-microservice/planner"
	pb "planner-microservice/proto"
)

type Job struct {
	ID           string
	Request      *pb.PlanRequest
	ResponseChan chan *pb.PlanResponse
	ErrorChan    chan error
}

func StartWorker(jobQueue chan Job) {
	for job := range jobQueue {
		// Process the job
		response, err := processJob(job.Request)
		if err != nil {
			job.ErrorChan <- err
			continue
		}
		job.ResponseChan <- response
	}
}

func processJob(req *pb.PlanRequest) (*pb.PlanResponse, error) {
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
