from django.db import models
from django.contrib.auth.models import User
from . import recipe

class SplendEatUser(User):
  class Meta:
    verbose_name = "SplendEatUser"
    verbose_name_plural = "SplendEatUsers"
    proxy = True  
