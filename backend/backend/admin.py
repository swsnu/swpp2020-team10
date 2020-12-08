from django.contrib import admin
from .models import SearchSetting, FridgeItem, Recipe, Review, Comment, \
                    RecipeProfile, ReviewProfile, CommentProfile, \
                    Preference, LabelPreference, IngredientPreference, Ingredient, \
                    IngredientIncidence

admin.site.register(SearchSetting)
admin.site.register(FridgeItem)
admin.site.register(Recipe)
admin.site.register(Review)
admin.site.register(Comment)
admin.site.register(Preference)
admin.site.register(LabelPreference)
admin.site.register(IngredientPreference)
admin.site.register(Ingredient)
admin.site.register(IngredientIncidence)
admin.site.register(RecipeProfile)
admin.site.register(ReviewProfile)
admin.site.register(CommentProfile)
