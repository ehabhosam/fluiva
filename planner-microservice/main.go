package main

import (
	"planner-microservice/handler"
	"planner-microservice/planner"

	"github.com/gofiber/fiber/v2"
)

func main() {
	planner.TestSamplePlanner()

	app := fiber.New()

	// Start worker pool
	handler.InitWorkerPool(10) // 10 concurrent workers

	// Job endpoint
	app.Post("/job", handler.HandleJob)

	app.Listen(":3000")
}
