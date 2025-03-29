// import generateId from "../utils/generateId";

export default class TableCell {
  type: string;
  todo_id: string;
  // done: boolean;
  // cell_id: string;
  constructor(type: string, todo_id: string) {
    this.type = type;
    this.todo_id = todo_id;
    // this.done = false;
    // this.cell_id = generateId();
  }
  // setDone() {
  //   this.done = true;
  // }
  // setNotDone() {
  //   this.done = false;
  // }
}
