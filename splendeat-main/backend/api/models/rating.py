from django.db import models

from .recipe import Recipe
from .splend_eat_user import SplendEatUser
from django.core.validators import MaxValueValidator, MinValueValidator 

class Rating(models.Model):
  author = models.ForeignKey(SplendEatUser, on_delete=models.CASCADE)
  recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
  stars = models.PositiveIntegerField(default= 1, validators=[MinValueValidator(1), MaxValueValidator(5)])


  def __str__(self):
    return f"{self.recipe} - {self.stars * '★'} by {self.author}"


