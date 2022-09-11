import RecipeModel from "./recipeModel"
import UserModel from "./userModel"

class CommentModel {
  recipe?: RecipeModel;
  author?: UserModel;
  body: string;
  created_on: Date;
  active: boolean;

  constructor(input: CommentModel) {
    this.recipe = input.recipe;
    this.author = input.author;
    this.body = input.body;
    this.created_on = input.created_on;
    this.active = input.active;
  }

  static fromJson = (jsonObject: any) =>
    new CommentModel({
      recipe: (jsonObject.recipe != null) ? RecipeModel.fromJson(jsonObject.recipe) : undefined,
      author: (jsonObject.author != null) ? UserModel.fromJson(jsonObject.author) : undefined,
      body: jsonObject.body,
      created_on: new Date(jsonObject.created_on),
      active: jsonObject.active,
    });
}

export default CommentModel;