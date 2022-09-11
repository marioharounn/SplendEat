from django.contrib import admin
from .models import Recipe, Ingredient, SplendEatUser, Rating,Category, Comment, SplendEatUser

class CategoryView(admin.ModelAdmin):
  search_fields = ('name',)



class CommentView(admin.ModelAdmin):
  list_display = ('author', 'body', 'recipe', 'created_on', 'active')
  list_filter = ('active', 'created_on')
  search_fields = ('name', 'email', 'body')
  actions = ['approve_comments']

  def approve_comments(self, request, queryset):
    queryset.update(active=True)



class IngredientInline(admin.TabularInline):
  model = Ingredient

class RecipeCommentInline(admin.TabularInline):
  model = Comment
  max_num=0
  fields = ('author', 'active', 'created_on', 'body')
  readonly_fields = fields

class RecipeView(admin.ModelAdmin):
  search_fields = ('name', 'author', 'instruction', 'description')
  list_display = ('id', 'name', 'author')
  autocomplete_fields = ('author',)
  filter_horizontal = ('categories',)
  fields = (
    ('name', 'author'),
    ('portion', 'duration'),
    'recipe_image',
    ('description', 'instruction'),
    'categories',
    'favorited_by',
  )
  inlines = [IngredientInline, RecipeCommentInline]



class RecipeInline(admin.TabularInline):
  model = Recipe
  max_num=0
  fields = ('name', 'duration', 'portion')
  readonly_fields = fields

class UserCommentInline(admin.TabularInline):
  model = Comment
  max_num=0
  fields = ('recipe', 'active', 'created_on', 'body')
  readonly_fields = fields

class FavoriteInline(admin.TabularInline):
  model = Recipe
  verbose_name = "Favorite"
  verbose_name_plural = "Favorites"
  max_num=0
  fields = ('name', 'author')
  readonly_fields = fields

class SplendEatUserView(admin.ModelAdmin):
  search_fields = ('username', 'email')
  list_display = ('id', 'username', 'email', 'is_staff')
  inlines = [RecipeInline, FavoriteInline, UserCommentInline]

admin.site.register(Recipe, RecipeView)
admin.site.register(SplendEatUser, SplendEatUserView)
admin.site.register(Rating)
admin.site.register(Comment, CommentView)
admin.site.register(Category)
