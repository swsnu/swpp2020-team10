"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import view_user, view_setting, view_recipe, view_review, \
    view_comment, view_food, view_search, view_recommendation

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/signup/', view_user.signup, name='signup'),
    path('api/user/signin/', view_user.signin, name='signin'),
    path('api/user/signout/', view_user.signout, name='signout'),
    path('api/user/status/', view_user.status, name='status'),
    path('api/user/profile/', view_user.profile, name='profile'),
    path('api/user/setting/', view_setting.setting, name='setting'),
    path('api/user/<int:_id>/notification/', view_user.notification, name='notification'),
    path('api/recipe/', view_recipe.recipes, name='recipes'),
    path('api/recipe/<int:_id>/', view_recipe.recipe_by_id, name='recipe_by_id'),
    path('api/recipe/<int:_id>/review/', view_review.recipe_review, name='recipe_review'),
    path('api/review/<int:_id>/', view_review.review_by_id, name='review_by_id'),
    path('api/review/<int:_id>/reaction/', view_review.reaction, name='review_reaction'),
    path('api/review/<int:_id>/comment/', view_comment.review_comment, name='get_review_comment'),
    path('api/comment/<int:_id>/', view_comment.comment_by_id, name='comment_by_id'),
    path('api/comment/<int:_id>/reaction/', view_comment.reaction, name='comment_reaction'),
    # path('api/food/', view_food.manage_food, name='manage_food'),
    path('api/search/', view_search.search, name='search'),
    path('api/fridge/<int:_id>/user/', view_food.manage_fridge, name='manage_fridge'),
    path('api/fridge/item/<int:_id>/', view_food.fridge_by_id, name='fridge_by_id'),
    path('api/recommendation/',view_recommendation.recommendation, name='recommendation'),
    path('api/recommendation/reaction/', view_recommendation.recommendation_react, name='recommendation_react')
]
