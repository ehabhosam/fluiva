package worker

import (
	"log"
	"math/rand"
	"time"
)

type Job struct {
	ID string
}

// Worker function that processes jobs
func StartWorker(jobQueue <-chan Job) {
	for job := range jobQueue {
		log.Println("Processing job:", job.ID)

		// Simulate long computation
		workTime := time.Duration(rand.Intn(5)+5) * time.Second
		time.Sleep(workTime)

		log.Println("Job finished:", job.ID, "Took:", workTime)
	}
}
