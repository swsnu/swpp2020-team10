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

class Ingredient(models.Model):
    name = models.CharField(blank=True, default='', max_length=80)
    image = models.TextField(default='', blank=True)

    def __str__(self):
        return self.name

class FridgeItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='fridgeitem_user_id',
        null=True,
        blank=True
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete= models.CASCADE,
        related_name='fridgeitem_ingrdient',
        null=True,
        blank=True
    )
    name = models.CharField(blank=True, default='', max_length=80)
    image = models.TextField(default='', blank=True)
    quantity = models.IntegerField(default=0)
    unit = models.CharField(blank=True, default='', max_length=80)
    expiry_date = models.DateTimeField(blank=True, null=True, default=now)
    def save(self, *args, **kwargs):
        self.iamge = get_object_or_404(Ingredient, pk=self.ingredient.id).image
        super(FridgeItem, self).save(*args, **kwargs)

class Recipe(models.Model):
    title = models.TextField()
    ingredient_lines = ArrayField(models.TextField(default='', blank=True), default=list, blank=True)
    content = ArrayField(models.TextField(default='', blank=True), default=list, blank=True)
    image = models.TextField(default='', blank=True)
    rating = models.FloatField(default=0.0)
    count_ratings = models.IntegerField(default=0)
    diet_labels = ArrayField(models.CharField(max_length=15), default=list, blank=True)
    health_labels = ArrayField(models.CharField(max_length=20), default=list, blank=True)
    calories = models.IntegerField(default=0)
    cooking_time = models.IntegerField(default=0)
    serving = models.IntegerField(default=0)

class IngredientIncidence(models.Model):
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete= models.CASCADE,
        related_name='ingredientincidence_ingrdient',
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='ingredientincidence_recipe_id',
    )
    quantity = models.IntegerField(default = 0)
    unit = models.CharField(max_length=10, null = True)

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
    image_url = models.TextField(blank=True)
    content = models.TextField(default='')
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)
    time_posted = models.DateTimeField(default=now, blank=True, null=True)
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
        related_name='comment_user_id',
        default=None
    )
    author_name = models.CharField(max_length=80, default='', blank=True, null = True)
    content = models.TextField(default='')
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)
    time_posted = models.DateTimeField(default=now, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.author_name is None or len(self.author_name) == 0:
            self.author_name = get_object_or_404(User, pk=self.user.id).username
        super(Comment, self).save(*args, **kwargs)

class RecipeProfile(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recipe_profile_user_id',
        default=None,
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='recipe_profile_review_id',
        default=None,
    )
    rating = models.FloatField(default=0.0)

class ReviewProfile(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='review_profile_user_id',
        default=None,
    )
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='review_profile_review_id',
        default=None,
    )
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)

class CommentProfile(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comment_profile_user_id',
        default=None,
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='comment_profile_comment_id',
        default=None,
    )
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)

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
