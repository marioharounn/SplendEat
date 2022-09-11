class IngredientModel {
  name: string;
  amount: number;
  unit: string;

  constructor(input: IngredientModel) {
    this.name = input.name;
    this.amount = input.amount;
    this.unit = input.unit;
  }

  static fromJson(jsonObject: any) {
    return new IngredientModel({
      name: jsonObject.name,
      amount: jsonObject.amount,
      unit: jsonObject.unit,
    });
  }
}

export default IngredientModel;