package planner

type Todo struct {
	Id           string
	Title        string
	Description  string
	RequiredTime int
	Type         string
}

func NewTodo(
	id string,
	title string,
	description string,
	required_time int,
	_type string) *Todo {
	if _type != "task" && _type != "routine" {
		panic("Invalid type: must be either 'task' or 'routine'")
	}

	return &Todo{
		Id:           id,
		Title:        title,
		Description:  description,
		RequiredTime: required_time,
		Type:         _type,
	}
}

type Task struct {
	Todo
	Priority    int
	IsBreakable bool
}

func NewTask(
	id string,
	title string,
	description string,
	required_time int,
	priority int,
	is_breakable bool) *Task {
	return &Task{
		Todo:        *NewTodo(id, title, description, required_time, "task"),
		Priority:    priority,
		IsBreakable: is_breakable,
	}
}

type Routine struct {
	Todo
}

func NewRoutine(
	id string,
	title string,
	description string,
	required_time int) *Routine {
	return &Routine{
		Todo: *NewTodo(id, title, description, required_time, "routine"),
	}
}

type TableCell struct {
	Type   string
	TodoId string
}

func NewTableCell(_type string, todo_id string) *TableCell {
	if _type != "task" && _type != "routine" {
		panic("Invalid type: must be either 'task' or 'routine'")
	}

	return &TableCell{
		Type:   _type,
		TodoId: todo_id,
	}
}
