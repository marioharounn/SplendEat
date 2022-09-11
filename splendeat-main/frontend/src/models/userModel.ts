import { CommentModel } from '.';
import RecipeModel from './recipeModel'

class UserModel {
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  date_joined: Date;
  is_active: boolean;
  last_recipes?: RecipeModel[];
  last_comments?: CommentModel[];
  favorites?: RecipeModel[];

  constructor(input: UserModel) {
    this.username = input.username;
    this.email = input.email;
    this.first_name = input.first_name;
    this.last_name = input.last_name;
    this.date_joined = input.date_joined;
    this.is_staff = input.is_staff;
    this.is_active = input.is_active;
    this.last_recipes = input.last_recipes;
    this.last_comments = input.last_comments;
    this.favorites = input.favorites;
  }

  static fromJson = (jsonObject: any) =>
    new UserModel({
      username: jsonObject.username,
      email: jsonObject.email,
      first_name: jsonObject.first_name,
      last_name: jsonObject.last_name,
      is_staff: jsonObject.is_staff,
      date_joined: new Date(jsonObject.date_joined),
      is_active: jsonObject.is_active,
      last_recipes: jsonObject.last_recipes?.map((r: any) => RecipeModel.fromJson(r)) || undefined,
      last_comments: jsonObject.last_comments?.map((c: any) => CommentModel.fromJson(c)) || undefined,
      favorites: jsonObject.favorites?.map((r: any) => RecipeModel.fromJson(r)) || undefined
    });
}

export default UserModel;