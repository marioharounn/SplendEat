from django.db import models
from .recipe import Recipe
from .splend_eat_user import SplendEatUser

class Comment(models.Model):
    recipe = models.ForeignKey(Recipe,on_delete=models.CASCADE,related_name='comments')
    author = models.ForeignKey(SplendEatUser, on_delete=models.CASCADE, related_name='author')
    body = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_on']

    def __str__(self):
        return 'Comment {} by {}'.format(self.body, self.author.username)