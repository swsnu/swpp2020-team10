import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.postgres.search import SearchVector, TrigramSimilarity
from django.db.models import Q
from backend.models import Ingredient


# Search matching ingredients
def ingredient(request):
    if request.method == 'GET':
        search_query = request.GET.get('q')
        query = Ingredient.objects

        if search_query is not None:
            query = query.annotate(
                similarity=TrigramSimilarity('name', search_query)
            ).filter(similarity__gt=0.2).order_by('-similarity')

        ingredients = query.all().values()
        if len(ingredients) > 5:
            ingredients = ingredients[:5]
        response_data = {
            'ingredients': ingredients
        }

        return JsonResponse(response_data, status=200)

    return HttpResponseNotAllowed(["GET"])