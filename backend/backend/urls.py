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
from .views import view_user, view_recipe, view_review, view_comment

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', view_user.signup, name='signup'),
    path('api/signin/', view_user.signin, name='signin'),
    path('api/signout/', view_user.signout, name='signout'),
    path('api/user/', view_user.profile, name='profile'),
    path('api/recipe/', view_recipe.recipes, name='recipes'),
    path('api/recipe/<int:_id>/', view_recipe.recipe_by_id, name='recipe_by_id'),
    path('api/recipe/<int:_id>/review/', view_review.recipe_review, name='recipe_review'),
    path('api/review/<int:_id>/', view_review.review_by_id, name='review_by_id'),
    path('api/review/<int:_id>/reaction/', view_review.reaction, name='review_reaction'),
    path('api/review/<int:_id>/comment/', view_comment.review_comment, name='get_review_comment'),
    path('api/comment/<int:_id>/', view_comment.comment_by_id, name='comment_by_id'),
    path('api/comment/<int:_id>/reaction/', view_comment.reaction, name='comment_reaction'),

]
