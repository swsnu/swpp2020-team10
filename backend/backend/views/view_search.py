import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.postgres.search import SearchVector, TrigramSimilarity
from django.db.models import Q
from django.views.decorators.csrf import ensure_csrf_cookie
from backend.models import Recipe, FridgeItem, IngredientIncidence


# Fetches setting by user id
@ensure_csrf_cookie
def search(request):
    if request.method == 'GET':
        search_query = request.GET.get('q')
        filter_rating = request.GET.get('rating')
        filter_sort = request.GET.get('sort')
        filter_from = int(request.GET.get('from'))
        filter_to = int(request.GET.get('to'))

        diet_labels = request.GET.getlist('diet_labels')
        health_labels = request.GET.getlist('health_labels')
        calories = request.GET.get('calorie')
        cooking_time = request.GET.get('time')
        fridge_able = request.GET.get('fridge_able')
        
        query = Recipe.objects

        filter_q = Q()
        filter_q &= Q(diet_labels__contains=diet_labels)
        filter_q &= Q(health_labels__contains=health_labels)
        if calories is not None:
            filter_q &= Q(calories__lte=int(calories))
        if cooking_time is not None:
            filter_q &= Q(cooking_time__lte=int(cooking_time))
        if filter_rating is not None:
            filter_q &= Q(rating__gte=float(filter_rating))

        if search_query is not None:
            query = query.annotate(
                similarity=TrigramSimilarity('title', search_query)
            ).filter(filter_q, similarity__gt=0.3).order_by('-similarity')
        else:
            query = query.filter(filter_q)

        if filter_sort is not None:
            if filter_sort == "time":
                query = query.order_by('cooking_time')
            elif filter_sort == "calorie":
                query = query.order_by('calories')
            elif filter_sort == "rating":
                query = query.order_by('-rating')

        filtered_recipes = query.all()[filter_from:filter_to].values()
        feasible_recipes = []
        if fridge_able != 'true':
            feasible_recipes = filtered_recipes
        else:
            try:
                my_ingredients = set()
                rec_ing_list = dict()
                for it in FridgeItem.objects.filter(user_id=request.user.id).all().values():
                    my_ingredients.add(it['ingredient_id'])
                for it in IngredientIncidence.objects.all().values():
                    if it['recipe_id'] in rec_ing_list:
                        rec_ing_list[it['recipe_id']].append(it['ingredient_id'])
                    else:
                        rec_ing_list[it['recipe_id']] = [it['ingredient_id']]
                for r in filtered_recipes:
                    if r['id'] not in rec_ing_list:
                        feasible_recipes.append(r)
                    else:
                        r_ing = rec_ing_list[r['id']]
                        flag = True
                        for ing in r_ing:
                            if ing not in my_ingredients:
                                flag = False
                                break
                        if flag is True:
                            feasible_recipes.append(r)
            except (KeyError, ValueError, IndexError):
                feasible_recipes = filtered_recipes
        recipes = [recipe for recipe in feasible_recipes]
        response_data = {
            'count': len(recipes),
            'recipes': recipes
        }

        return JsonResponse(response_data, status=200)

    return HttpResponseNotAllowed(["GET"])