import Todo from "./todo";

export default class Task extends Todo {
  required_time: number;
  priority: number;
  type: string;
  isDivisible: boolean;
  constructor(
    title: string,
    description: string,
    required_time: number,
    priority: number = 2,
    isDivisible: boolean = true
  ) {
    super(title, description);
    this.required_time = required_time;
    this.priority = priority;
    this.type = "task";
    this.isDivisible = isDivisible;
  }
}
