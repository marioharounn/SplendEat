from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ..models import Recipe, Ingredient, Rating,Comment
from .ingredient import IngredientSerializer
from django.db.models import Avg

from . import comment
from . import splend_eat_user

from .debug_serializers import debug_field

class RecipeSerializer(ModelSerializer):
    categories = SerializerMethodField()
    ingredients = SerializerMethodField()
    rating = SerializerMethodField()
    number_of_ratings = SerializerMethodField()
    comments = SerializerMethodField()
    # author = splend_eat_user.SplendEatUserSerializer(**self.author_serializer_args)
    # favorited_by = splend_eat_user.SplendEatUserSerializer(**self.favorited_by_serializer_args, many=True)
    author = SerializerMethodField()
    favorited_by = SerializerMethodField()
    is_favourited = SerializerMethodField()

    def __init__(
      self,
      *args,
      comments_serializer_args = {'recipe': False},
      author_serializer_args = {'last_recipes':False, 'last_comments': False, 'favorites': False},
      favorited_by_serializer_args = {'favorites':False, 'last_recipes':False, 'last_comments': False},
      **kwargs
    ):
      self.comments_serializer_args = comments_serializer_args
      self.author_serializer_args = author_serializer_args
      self.favorited_by_serializer_args = favorited_by_serializer_args
      for key in [key for key, value in kwargs.items() if key in self.fields and not value]:
        self.fields.pop(key)
        kwargs.pop(key)

      # Decide whether to include whether the recipe is favourited or not
      if 'user' in kwargs:
        self.user = kwargs.pop('user')
      else:
        self.fields.pop('is_favourited')

      super().__init__(*args, **kwargs)

    class Meta:
        model = Recipe
        fields = '__all__'

    @debug_field
    def get_author(self, obj):
      return splend_eat_user.SplendEatUserSerializer(obj.author, **self.author_serializer_args).data
    
    @debug_field
    def get_favorited_by(self, obj):
      return splend_eat_user.SplendEatUserSerializer(obj.favorited_by, **self.favorited_by_serializer_args, many=True).data
    
    def get_categories(self, obj):
        return [category.name for category in obj.categories.all()]
    
    def get_ingredients(self, obj):
      return IngredientSerializer(Ingredient.objects.filter(recipe=obj), many=True).data
    
    def get_rating(self, obj):
        return Rating.objects.filter(recipe=obj).aggregate(Avg('stars'))['stars__avg']

    def get_number_of_ratings(self, obj):
        return Rating.objects.filter(recipe=obj).count()

    @debug_field
    def get_comments(self, obj):
        return comment.CommentSerializer(Comment.objects.filter(recipe = obj), **self.comments_serializer_args, many=True).data

    def get_is_favourited(self, obj):
        return self.user in obj.favorited_by.all()