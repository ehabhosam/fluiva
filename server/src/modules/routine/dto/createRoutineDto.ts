export class CreateRoutineDto {
  constructor(
    public title: string,
    public description: string,
    public repeatedUnits: number,
    public planId: number,
  ) {}
}
