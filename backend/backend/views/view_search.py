import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.postgres.search import SearchVector, TrigramSimilarity
from django.db.models import Q
from backend.models import Recipe

# Fetches setting by user id
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
        recipes = [recipe for recipe in filtered_recipes]
        response_data = {
            'count': len(recipes),
            'recipes': recipes
        }

        return JsonResponse(response_data, status=200)

    return HttpResponseNotAllowed(["GET"])