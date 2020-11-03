from django.contrib import admin
from .models import Food, FoodInstance, Recipe, Review, Comment


admin.site.register(FoodInstance)
admin.site.register(Food)
admin.site.register(Recipe)
admin.site.register(Review)
admin.site.register(Comment)
