package handler

import (
	"fmt"
	"log"
	"planner-microservice/worker"
	"time"

	"github.com/gofiber/fiber/v2"
)

// JobQueue channel for handling jobs
var JobQueue chan worker.Job

func InitWorkerPool(workerCount int) {
	JobQueue = make(chan worker.Job, 10) // Buffer size
	for i := 0; i < workerCount; i++ {
		go worker.StartWorker(JobQueue)
	}
}

func HandleJob(c *fiber.Ctx) error {
	jobID := fmt.Sprintf("%d", time.Now().UnixNano()) // Unique job ID
	job := worker.Job{ID: jobID}

	// Send job to the worker queue
	select {
	case JobQueue <- job:
		log.Println("Job submitted:", jobID)
		return c.JSON(fiber.Map{"message": "Job submitted", "job_id": jobID})
	default:
		return c.Status(503).JSON(fiber.Map{"error": "Job queue is full"})
	}
}
