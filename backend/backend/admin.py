from django.contrib import admin
from .models import Food, FridgeItem, Recipe, Review, Comment


admin.site.register(FridgeItem)
admin.site.register(Food)
admin.site.register(Recipe)
admin.site.register(Review)
admin.site.register(Comment)
