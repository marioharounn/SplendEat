import { UserModel, CommentModel, IngredientModel } from '.';
// import CommentModel from './commentModel';
// import IngredientModel from './ingredientModel';

class RecipeModel {
  id: number;
  author?: UserModel; 
  name: string;
  description: string;
  duration: Date;
  portions: number;
  publish_date: Date;
  last_modified: Date;
  recipe_image?: string;
  ingredients: IngredientModel[];
  categories: string[];
  instruction: string;
  comments?: CommentModel[];
  rating: number;
  is_favourited?: boolean;

  constructor(input: RecipeModel) {
    this.id = input.id;
    this.author = input.author;
    this.name = input.name;
    this.description = input.description;
    this.duration = input.duration;
    this.portions = input.portions;
    this.publish_date = input.publish_date;
    this.last_modified = input.last_modified;
    this.recipe_image = input.recipe_image;
    this.ingredients = input.ingredients;
    this.categories = input.categories;
    this.instruction = input.instruction;
    this.comments = input.comments;
    this.rating = input.rating;
    this.is_favourited = input.is_favourited;
  }

  static fromJson = (jsonObject: any) => {
    return new RecipeModel({
      id: jsonObject.id,
      author: jsonObject.author != undefined ? UserModel.fromJson(jsonObject.author) : undefined,
      name: jsonObject.name,
      description: jsonObject.description,
      duration: jsonObject.duration,
      portions: jsonObject.portion,
      publish_date: new Date(jsonObject.publish_date),
      last_modified: new Date(jsonObject.last_modified),
      ingredients: jsonObject.ingredients.map((j: any) => IngredientModel.fromJson(j)),
      recipe_image: jsonObject.recipe_image,
      categories: jsonObject.categories,
      instruction: jsonObject.instruction,
      comments: jsonObject.comments?.map((i: any) => CommentModel.fromJson(i)) || undefined,
      rating: jsonObject.rating,
      is_favourited: jsonObject.is_favourited,
    });
  }
}

export default RecipeModel;