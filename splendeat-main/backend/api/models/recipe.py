from django.db import models
from multiselectfield import MultiSelectField
from django.contrib.auth.models import User

from .category import Category
from . import splend_eat_user as s

class Recipe(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=1000)
    duration = models.DurationField()
    portion = models.PositiveIntegerField()
    instruction = models.TextField(max_length=5000, default='')

    # Dato på oppskrift
    publish_date = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    author = models.ForeignKey(s.SplendEatUser, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category)

    # Bilde til oppskrift
    recipe_image = models.ImageField(blank=True, null=True, upload_to='media/%Y/%m/%D')

    favorited_by = models.ManyToManyField(s.SplendEatUser, 'favorites')

    def __str__(self):
        return "%s, for %s persons" % (self.name, self.portion)