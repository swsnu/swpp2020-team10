import datetime

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils.timezone import now

class SearchSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    diet_labels = ArrayField(models.CharField(max_length=15), default=list, blank=True)
    health_labels = ArrayField(models.CharField(max_length=20), default=list, blank=True)
    calories = models.IntegerField(default=0)
    cooking_time = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)

class FridgeItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='fridgeitem_user_id',
    )
    name = models.CharField(blank=True, default='', max_length=80)
    quantity = models.IntegerField(default=0)
    expiry_date = models.DateTimeField(auto_now_add=True, blank=True)

    '''
    def save(self, *args, **kwargs):
        if len(self.name) == 0:
            self.name = self.food.name
        super(FridgeItem, self).save(*args, **kwargs)
    '''

class Recipe(models.Model):
    title = models.CharField(max_length=80)
    content = models.TextField(default='')
    rating = models.FloatField(default=0.0)
    count_ratings = models.IntegerField(default=0)
    ingredients = models.JSONField(default=None, null=True)
    diet_labels = ArrayField(models.CharField(max_length=15), default=list, blank=True)
    health_labels = ArrayField(models.CharField(max_length=20), default=list, blank=True)
    calories = models.IntegerField(default=0)
    cooking_time = models.IntegerField(default=0)
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
    author_name = models.CharField(max_length=80, default='', blank=True, null = True)
    title = models.CharField(max_length=80)
    content = models.TextField(default='')
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)
    time_posted = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    def save(self, *args, **kwargs):
        if self.author_name is None or len(self.author_name) == 0:
            self.author_name = get_object_or_404(User, pk=self.user.id).username
        super(Review, self).save(*args, **kwargs)

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
    author_name = models.CharField(max_length=80, default='', blank=True, null = True)
    content = models.TextField(default='')
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)
    time_posted = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.author_name is None or len(self.author_name) == 0:
            self.author_name = get_object_or_404(User, pk=self.user.id).username
        super(Comment, self).save(*args, **kwargs)

class Preference(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='preference_user',
    )
    label_norm = models.FloatField(default = 0.0)
    ingredient_norm = models.FloatField(default = 0.0)

class LabelPreference(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='label_preference_user',
    )
    name = models.CharField(max_length=20, default='')
    score = models.FloatField(default=0.0)

class IngredientPreference(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ing_pref_user',
    )
    name = models.CharField(max_length=30, default='')
    score = models.FloatField(default=0.0)