import Todo from "./todo";

export default class Routine extends Todo {
    repeated_units: number;
    type: string;
    constructor(
        title: string,
        description: string,
        repeated_units: number
    ) {
        super(title, description);
        this.repeated_units = repeated_units;
        this.type = "routine";
    }
}