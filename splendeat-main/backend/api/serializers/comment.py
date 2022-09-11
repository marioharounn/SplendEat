from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ..models import Comment

from . import recipe as r
from . import splend_eat_user

from .debug_serializers import debug_field

class CommentSerializer(ModelSerializer):
  recipe = SerializerMethodField()
  author = SerializerMethodField()

  def __init__(
    self,
    *args,
    recipe_serializer_args = {'comments':False, 'author':False},
    author_serializer_args = {'last_comments':False, 'last_recipes':False},
    **kwargs
  ):
    self.recipe_serializer_args = recipe_serializer_args
    self.author_serializer_args = author_serializer_args
    for key in [key for key, value in kwargs.items() if key in self.fields and not value]:
      self.fields.pop(key)
      kwargs.pop(key)
    super().__init__(*args, **kwargs)

  class Meta:
      model = Comment
      fields = '__all__'

  @debug_field
  def get_author(self, obj):
    return splend_eat_user.SplendEatUserSerializer(obj.author, **self.author_serializer_args).data

  @debug_field
  def get_recipe(self, obj):
    return r.RecipeSerializer(obj.recipe, **self.recipe_serializer_args).data