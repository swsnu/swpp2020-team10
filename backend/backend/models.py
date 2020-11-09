import datetime

from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
class Food(models.Model):
    name = models.CharField(max_length=80, default='')
    nutrition = models.JSONField(default=None)
    tag = models.JSONField(default=None)
    unit = models.CharField(max_length=10, blank=True, default='')

class FridgeItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='fridgeitem_user_id',
    )
    food = models.ForeignKey(
        Food,
        on_delete=models.CASCADE,
        related_name='fridgeitem_food_type',
    )
    name = models.CharField(blank=True, default='', max_length=80)
    quantity = models.IntegerField(default=0)
    expiry_date = models.DateField(default=now())
    nutrition_facts = models.JSONField(null=True, blank=True, default=None)

    def save(self, *args, **kwargs):
        if self.nutrition_facts is None:
            self.nutrition_facts = self.food.nutrition
        if len(self.name) == 0:
            self.name = self.food.name
        super(FridgeItem, self).save(*args, **kwargs)


class Recipe(models.Model):
    food = models.ForeignKey(
        Food,
        on_delete=models.CASCADE,
        related_name='recipe_food_type',
    )
    title = models.CharField(max_length=80)
    content = models.TextField(default='')
    rating = models.FloatField(default='0.0')
    count_ratings = models.IntegerField(default=0)
    ingredients = models.JSONField(default=None)
    cooking_time = models.IntegerField(default=0)
    tag = models.JSONField(default=None)
    serving = models.IntegerField(default=0)

class Review(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='review_recipe_id',
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='review_user_id',
    )
    title = models.CharField(max_length=80)
    content = models.TextField(default='')
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)

class Comment(models.Model):
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='comment_review_id',
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='review_comment_id',
        default=None
    )
    content = models.TextField(default='')
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)
