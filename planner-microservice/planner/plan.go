package planner

import (
	"fmt"
	"math"
	"planner-microservice/utils"
	"sort"
)

type Planner struct {
	title       string
	build_unit  string
	period_unit string
	tasks       []Task
	routines    []Routine
	n_periods   int
	n_blocks    int
	table       [][]TableCell
}

func NewPlanner(
	title string,
	build_unit string,
	period_unit string,
	tasks []Task,
	routines []Routine,
	n_periods int,
	n_blocks int) *Planner {
	return &Planner{
		title:       title,
		build_unit:  build_unit,
		period_unit: period_unit,
		tasks:       tasks,
		routines:    routines,
		n_periods:   n_periods,
		n_blocks:    n_blocks,
		table:       make([][]TableCell, n_periods),
	}
}

func totalTime(tasks []Task, routines []Routine, periods int) int {
	sum := 0

	for _, task := range tasks {
		sum += task.required_time
	}

	routineSum := 0
	for _, routine := range routines {
		routineSum += routine.required_time
	}
	sum += routineSum * periods

	return sum
}

func totalTasksTime(tasks []Task) int {
	sum := 0
	for _, task := range tasks {
		sum += task.required_time
	}
	return sum
}

// Least number of blocks required to complete all tasks and routines
func leastBlocks(tasks []Task, routines []Routine, periods int) int {
	blocks := 1

	// Find largest unbreakable task time
	for _, task := range tasks {
		if !task.is_breakable && task.required_time > blocks {
			blocks = task.required_time
		}
	}

	// Add routine times if any exist
	for _, routine := range routines {
		blocks += routine.required_time
	}

	return blocks
}

func maxBlocks(tasks []Task, routines []Routine, blocks_unit string) int {
	var maxPossibleBlocks int

	switch blocks_unit {
	case "hour":
		maxPossibleBlocks = 24
	case "day":
		maxPossibleBlocks = 7
	default:
		maxPossibleBlocks = 4
	}

	periods := 1
	blocks := totalTime(tasks, routines, periods)

	for blocks > maxPossibleBlocks {
		periods++
		blocks = totalTime(tasks, routines, periods)
	}

	return blocks
}

func IsValid(tasks []Task, routines []Routine, blocks_unit string) bool {
	var maxPossibleBlocks int

	switch blocks_unit {
	case "hour":
		maxPossibleBlocks = 24
	case "day":
		maxPossibleBlocks = 7
	default:
		maxPossibleBlocks = 4
	}

	leastBlocks := leastBlocks(tasks, routines, 1)
	return leastBlocks <= maxPossibleBlocks
}

func NPeriodsFromBlocks(tasks []Task, routines []Routine, nBlocks int) int {
	totalTasksTime := totalTasksTime(tasks)
	routinesPerPeriod := totalTime([]Task{}, routines, 1)
	return utils.DeviseAndCeil(nBlocks-routinesPerPeriod, totalTasksTime)
}

func NBlocksFromPeriods(tasks []Task, routines []Routine, nPeriods int) int {
	totalTimeValue := totalTime(tasks, routines, nPeriods)

	return utils.DeviseAndCeil(nPeriods, totalTimeValue)
}

func LeastPeriods(tasks []Task, routines []Routine, maxBlocks int) int {
	return NPeriodsFromBlocks(tasks, routines, maxBlocks)
}

func MaxPeriods(tasks []Task, routines []Routine, leastBlocks int) int {
	return NPeriodsFromBlocks(tasks, routines, leastBlocks)
}

func (p *Planner) TotalTimeInPeriodUnit() string {
	timeUnitsValue := map[string]int{
		"minute": 1,
		"hour":   60,
		"day":    1440,
		"week":   10080,
		"month":  43200,
	}

	buildUnitValue := timeUnitsValue[p.build_unit]
	periodUnitValue := timeUnitsValue[p.period_unit]

	totalTimeInMinutes := totalTime(p.tasks, p.routines, p.n_periods) * buildUnitValue
	totalTime := math.Round(float64(totalTimeInMinutes) / float64(periodUnitValue))

	return fmt.Sprintf("%.0f %s", totalTime, p.period_unit)
}

func compareTasks(a, b Task) bool {
	if !a.is_breakable {
		return true
	}
	if !b.is_breakable {
		return false
	}
	return a.required_time < b.required_time
}

func (p *Planner) isPlacesAvailable(freq int, index int) bool {
	if len(p.table[index])+freq > p.n_blocks {
		return false
	}
	return true
}

func (p *Planner) addRoutine(routine Routine) {
	cells := make([]TableCell, routine.required_time)
	for i := range cells {
		cells[i] = TableCell{
			_type:   "routine",
			todo_id: routine.id,
		}
	}

	for i := range p.n_periods {
		if p.table[i] == nil {
			p.table[i] = make([]TableCell, 0)
		}
		p.table[i] = append(cells, p.table[i]...)
	}
}

func (p *Planner) generateAvailability(tbf int) (int, error) {
	totalAvailablePlaces := 0
	for _, period := range p.table {
		totalAvailablePlaces += p.n_blocks - len(period)
	}

	if tbf <= totalAvailablePlaces {
		// Find shortest period
		shortestIndex := 0
		for i := 1; i < len(p.table); i++ {
			if len(p.table[i]) < len(p.table[shortestIndex]) {
				shortestIndex = i
			}
		}

		if len(p.table[shortestIndex]) == 0 {
			return shortestIndex, nil
		}

		numItemsToMove := tbf - (p.n_blocks - len(p.table[shortestIndex]))

	outer:
		for i := 0; i < numItemsToMove; i++ {
			if len(p.table[shortestIndex]) == 0 {
				break
			}

			item := TableCell{
				_type:   p.table[shortestIndex][len(p.table[shortestIndex])-1]._type,
				todo_id: p.table[shortestIndex][len(p.table[shortestIndex])-1].todo_id,
			}

			for periodIndex, period := range p.table {
				if len(period) < p.n_blocks && periodIndex != shortestIndex {
					p.table[periodIndex] = append(p.table[periodIndex], item)
					p.table[shortestIndex] = p.table[shortestIndex][:len(p.table[shortestIndex])-1]
					continue outer
				}
			}
		}

		return shortestIndex, nil
	} else {
		p.table = append(p.table, make([]TableCell, 0, p.n_blocks))
		p.n_periods++
		return len(p.table) - 1, nil
	}
}

func (p *Planner) GenerateTable() [][]TableCell {
	// Add routines
	for _, routine := range p.routines {
		p.addRoutine(routine)
	}

	// Add tasks to priority queues
	var highPriority, normalPriority, lowPriority []Task

	// Make deep clone of tasks
	tasksClone := make([]Task, len(p.tasks))
	for i, task := range p.tasks {
		taskCopy := task
		tasksClone[i] = taskCopy
	}

	// split tasks by priority
	for _, task := range tasksClone {
		switch task.priority {
		case 1:
			highPriority = append(highPriority, task)
		case 2:
			normalPriority = append(normalPriority, task)
		case 3:
			lowPriority = append(lowPriority, task)
		}
	}

	addTaskToResultArray := func(task Task) {
		// Define default taskBlocksFrequency & handle undivisible
		var taskBlocksFrequency int
		if !task.is_breakable {
			taskBlocksFrequency = task.required_time
		} else {
			taskBlocksFrequency = utils.DeviseAndCeil(task.required_time, p.n_periods)
		}

		changed := false
		var remainingPeriods int

		pushToResultArray := func(index int) {
			for x := 0; x < taskBlocksFrequency; x++ {
				if task.required_time == 0 {
					break
				}
				p.table[index] = append(p.table[index], TableCell{
					_type:   "task",
					todo_id: task.id,
				})
				task.required_time--
			}
		}

		var pusher func()
		pusher = func() {
			for i := 0; i < p.n_periods; i++ {
				if p.table[i] == nil {
					p.table[i] = make([]TableCell, 0)
				}

				if len(p.table[i]) == p.n_blocks {
					continue
				}

				if !task.is_breakable {
					if p.isPlacesAvailable(taskBlocksFrequency, i) {
						pushToResultArray(i)
					}
					continue
				}

				if changed {
					remainingPeriods = p.n_periods - (i + 1)
					taskBlocksFrequency = utils.DeviseAndCeil(task.required_time, remainingPeriods)
					changed = false
				}

				if p.isPlacesAvailable(taskBlocksFrequency, i) {
					pushToResultArray(i)
					if task.required_time == 0 {
						return
					}
				} else {
					for !p.isPlacesAvailable(taskBlocksFrequency, i) {
						taskBlocksFrequency--
						changed = true
					}
					pushToResultArray(i)
					if task.required_time == 0 {
						return
					}
				}
			}

			if task.required_time > 0 {
				if !task.is_breakable {
					avIndex, _ := p.generateAvailability(taskBlocksFrequency)
					pushToResultArray(avIndex)
				} else {
					taskBlocksFrequency = utils.DeviseAndCeil(task.required_time, p.n_periods)
					pusher()
				}
			}
		}

		pusher()
	}

	// Process all priority levels in order
	priorities := [][]Task{highPriority, normalPriority, lowPriority}
	for _, priorityTasks := range priorities {
		if len(priorityTasks) > 0 {
			sort.Slice(priorityTasks, func(i, j int) bool {
				return compareTasks(priorityTasks[i], priorityTasks[j])
			})
			for _, task := range priorityTasks {
				addTaskToResultArray(task)
			}
		}
	}

	return p.table
}

func (p *Planner) LogResultArray() {
	for i, period := range p.table {
		fmt.Printf("Period %d: ", i+1)
		for _, cell := range period {
			switch cell._type {
			case "task":
				for _, task := range p.tasks {
					if task.id == cell.todo_id {
						fmt.Printf("%-15s", fmt.Sprintf("Task-[%s] ", task.title))
					}
				}
			case "routine":
				for _, routine := range p.routines {
					if routine.id == cell.todo_id {
						fmt.Printf("%-15s", fmt.Sprintf("Routine-[%s] ", routine.title))
					}
				}
			}
		}
		fmt.Println()
	}
}

func TestSamplePlanner() {
	// Create sample tasks
	tasks := []Task{
		{
			Todo: Todo{
				id:            "1",
				title:         "Study Math",
				required_time: 3,
			},
			priority:     1,
			is_breakable: true,
		},
		{
			Todo: Todo{
				id:            "2",
				title:         "Write Report",
				required_time: 4,
			},
			priority:     2,
			is_breakable: false,
		},
	}

	// Create sample routines
	routines := []Routine{
		{
			Todo: Todo{
				id:            "3",
				title:         "Exercise",
				required_time: 1,
			},
		},
		{
			Todo: Todo{
				id:            "4",
				title:         "Read News",
				required_time: 1,
			},
		},
	}

	// Create new planner
	planner := NewPlanner(
		"Weekly Schedule",
		"hour",
		"day",
		tasks,
		routines,
		3, // n_periods
		6, // n_blocks
	)

	// Generate and log table
	table := planner.GenerateTable()

	if table == nil {
		print("error while creating plan")
	}

	planner.LogResultArray()
}
