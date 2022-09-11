from django.db import models

from .recipe import Recipe


class Ingredient(models.Model):
    name = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=8, decimal_places=3)
    unit = models.CharField(max_length=10)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)

    def __str__(self):
        return ("%s     %.0f %s" % (self.name, self.amount, self.unit))
