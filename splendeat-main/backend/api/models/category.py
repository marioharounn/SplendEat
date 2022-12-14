from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=20)

    class Meta:
      verbose_name_plural = "Categories"

    def __str__(self):
        return (f"{self.name}")