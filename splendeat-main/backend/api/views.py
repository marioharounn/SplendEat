from urllib import response
from django.shortcuts import render
from .serializers import RecipeSerializer, IngredientSerializer, SplendEatUserSerializer, RatingSerializer
from .models import Recipe, Ingredient, SplendEatUser, Rating
import json

from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet, GenericViewSet, ModelViewSet, ReadOnlyModelViewSet

from .serializers import (
  CategorySerializer,
  CommentSerializer,
  IngredientSerializer,
  RecipeSerializer,
  SplendEatUserRegistrationSerializer,
  SplendEatUserSerializer,
)

from .models import (
  Category,
  Comment,
  Ingredient,
  Recipe,
  SplendEatUser,
)

def getRecipesWithOptionalUserFields(request, recipeObjects, **serializerKwArgs ):
  if not request.user.is_authenticated:
    serializer = RecipeSerializer(recipeObjects, **serializerKwArgs)
    return Response(serializer.data)
  else:
    user = SplendEatUser.objects.get(id=request.user.id)
    serializer = RecipeSerializer(
      recipeObjects,
      user=user,
      comments_serializer_args={
        'recipe': False,
        'author_serializer_args': {
          'last_comments':False,
          'last_recipes':False,
          'favorites':False
        }
      },
      **serializerKwArgs
    )
    return Response(serializer.data)

class RecipeView(ViewSet):
    queryset = Recipe.objects.all()

    @action(detail=False, methods=["get"])
    def random(self, request):
      recipe = Recipe.objects.order_by('?').first()
      return Response(RecipeSerializer(recipe).data)


    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def rate(self, request, pk):
        """gir en rating"""
        rating = request.data['rating']

        try:
            recipeID = int(pk)
            recipe = Recipe.objects.get(id=recipeID)

            rating_num = int(rating)
            if ( 1 > rating_num > 5):
                return Response(
                    'Provide a rating between 1 and 5',
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                rating_obj = Rating.objects.get(recipe=recipe, author__id=request.user.id)
                rating_obj.stars = rating_num
                rating_obj.save()
            except Rating.DoesNotExist:
                Rating.objects.create(
                    recipe=recipe,
                    author=request.user,
                    stars=rating_num,
                )

        except ValueError:
            return Response(
                'Bad input. Try again',
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response('OK')


    def list(self, request):
        return getRecipesWithOptionalUserFields(request, Recipe.objects.all(), many=True)
        
    def retrieve(self, request, pk=None):
        recipe = get_object_or_404(self.queryset, pk=pk)
        return getRecipesWithOptionalUserFields(request, recipe)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def toggle_favourite(self, request, pk):
        user = SplendEatUser.objects.get(id=request.user.id)
        recipe = Recipe.objects.get(id=pk)

        if recipe.favorited_by.filter(username=user.username).exists():
            recipe.favorited_by.remove(user)
            return Response(False)
        else:
            recipe.favorited_by.add(user)
            return Response(True)
        


class RatingView(ModelViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all()


class CommentView(ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def create(self, request):
        commenter = request.user
        body = request.data['comment']
        recipe = request.data['recipeID']

        Comment.objects.create(
            author=commenter,
            body=body,
            recipe=Recipe.objects.get(id=recipe)
        )
        return Response("OK")




class CategoryView(ReadOnlyModelViewSet):
    serializer_class = CategorySerializer 
    queryset = Category.objects.all()


class CategoryItemsView(ReadOnlyModelViewSet):
    serializer_class = RecipeSerializer

    def list(self, request, name):
        return getRecipesWithOptionalUserFields(request, Recipe.objects.filter(categories__name__exact = name), many=True)
        
    # def retrieve(self, request, pk=None):
    #     recipe = get_object_or_404(self.queryset, pk=pk)
    #     return getRecipesWithOptionalUserFields(request, recipe)

    def get_queryset(self):
        self.name = self.kwargs["name"]
        return Recipe.objects.filter(categories__name__exact = self.name)


class UserView(ReadOnlyModelViewSet):
    serializer_class = SplendEatUserSerializer
    queryset = SplendEatUser.objects.all()
    lookup_field="username"
    permission_classes=[IsAuthenticated]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Retrieves the currently logged in user"""
        user = SplendEatUser.objects.get(id=request.user.id)
        return Response(SplendEatUserSerializer(user).data)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def recipes(self, request, username):
        """Retrieves all recipes of a user (as compared to only the 10 most recent)"""
        recipes = Recipe.objects.filter(
            author__username=username).order_by('last_modified')
        return Response(RecipeSerializer(recipes, many=True).data)

    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def exists(self, request, username):
        """Returns a boolean which tells you whether or not the user exists"""
        exists = SplendEatUser.objects.filter(username=username).exists()
        return Response(exists)


class AuthView(ViewSet):
    queryset = SplendEatUser.objects.all()
    @action(detail=False, methods=["post"])
    def register(self, request):
        """Register a new user"""
        username = request.data['username']
        password = request.data['password']

        user = SplendEatUserRegistrationSerializer(data=request.data)
        user.is_valid(raise_exception=True)
        user_obj = user.save()

        login(request, user_obj)
        return Response('OK')

    @action(detail=False, methods=["post"])
    def login(self, request):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response('OK')
        else:
            return Response('Could not log in. Is your password correct?', status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=["get"])
    def logout(self, request):
        logout(request)
        return Response('OK')


