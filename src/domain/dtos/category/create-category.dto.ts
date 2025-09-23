export class CreateCategoryDto {
  constructor(
    public readonly name: string,
    public readonly available: boolean
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { name, available } = object;
    let availableBoolean = available;
    if (!name) return ["Missing name"];
    if (available === undefined) return ["Missing available"];
    if (typeof available !== "boolean") availableBoolean = available === "true";
    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }
}
