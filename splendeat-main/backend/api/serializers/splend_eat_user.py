from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ..models import SplendEatUser, Recipe, Rating, Comment

from . import comment
from . import recipe

from .debug_serializers import debug_field

class SplendEatUserSerializer(ModelSerializer):
    last_recipes = SerializerMethodField()
    last_comments = SerializerMethodField()
    favorites = SerializerMethodField()

    def __init__(
      self,
      *args,
      last_comments_serializer_args = {
        'author': False,
        'recipe_serializer_args': {'comments': False, 'favorited_by': False}
      },
      last_recipes_serializer_args = {'author': False, 'favorited_by': False},
      favorites_serializer_args = {
        'favorited_by': False,
        'author': False,
        'comments_serializer_args': {
          'author_serializer_args': {
            'last_recipes': False,
            'last_comments': False,
            'favorites': False,
          }
        }
      },
      **kwargs
    ):
      self.last_comments_serializer_args = last_comments_serializer_args
      self.last_recipes_serializer_args = last_recipes_serializer_args
      self.favorites_serializer_args = favorites_serializer_args
      for key in [key for key, value in kwargs.items() if key in self.fields and not value]:
        self.fields.pop(key)
        kwargs.pop(key)
      super().__init__(*args, **kwargs)

    class Meta:
        model = SplendEatUser
        # This option exposes a crazy lot of information
        # fields = '__all__'
        fields = (
            'username',
            'email',
            'first_name',
            'last_name',
            'is_superuser',
            'is_staff',
            'date_joined',
            'is_active',
            'last_recipes',
            'last_comments',
            'favorites',
        )

    @debug_field
    def get_last_comments(self, obj):
        recipes = Comment.objects.filter(
            author=obj).order_by('created_on')[:10]
        return comment.CommentSerializer(recipes, **self.last_comments_serializer_args, many=True).data

    @debug_field
    def get_last_recipes(self, obj):
        recipes = Recipe.objects.filter(
            author=obj).order_by('last_modified')[:10]
        return recipe.RecipeSerializer(recipes, **self.last_recipes_serializer_args, many=True).data

    @debug_field
    def get_favorites(self, obj):
        recipes=[favorite for favorite in obj.favorites.all()]
        return recipe.RecipeSerializer(recipes, **self.favorites_serializer_args, many=True).data
