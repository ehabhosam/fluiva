package planner

import "planner-microservice/utils"

type Todo struct {
	id            string
	title         string
	description   string
	required_time int
	_type         string
}

func NewTodo(
	title string,
	description string,
	required_time int,
	_type string) *Todo {
	if _type != "task" && _type != "routine" {
		panic("Invalid type: must be either 'task' or 'routine'")
	}

	return &Todo{
		id:          utils.GenerateID(),
		title:       title,
		description: description,
	}
}

type Task struct {
	Todo
	priority     int
	is_breakable bool
}

func NewTask(
	title string,
	description string,
	required_time int,
	priority int,
	is_breakable bool) *Task {
	return &Task{
		Todo:         *NewTodo(title, description, required_time, "task"),
		priority:     priority,
		is_breakable: is_breakable,
	}
}

type Routine struct {
	Todo
}

func NewRoutine(
	title string,
	description string,
	required_time int) *Routine {
	return &Routine{
		Todo: *NewTodo(title, description, required_time, "routine"),
	}
}

type TableCell struct {
	_type   string
	todo_id string
}

func NewTableCell(_type string, todo_id string) *TableCell {
	if _type != "task" && _type != "routine" {
		panic("Invalid type: must be either 'task' or 'routine'")
	}

	return &TableCell{
		_type:   _type,
		todo_id: todo_id,
	}
}
