import generateId from "../utils/generateId";

export default class Todo {
  id: string;
  title: string;
  description: string;
  // color?: string | null;
  constructor(title: string, description: string, color: string | null = null) {
    this.id = generateId();
    this.title = title;
    this.description = description;
    // this.color = color;
  }
}
