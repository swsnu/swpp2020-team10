from django.contrib import admin
from .models import SearchSetting, FridgeItem, Recipe, Review, \
                    Comment, Preference, LabelPreference, IngredientPreference

admin.site.register(SearchSetting)
admin.site.register(FridgeItem)
admin.site.register(Recipe)
admin.site.register(Review)
admin.site.register(Comment)
admin.site.register(Preference)
admin.site.register(LabelPreference)
admin.site.register(IngredientPreference)
