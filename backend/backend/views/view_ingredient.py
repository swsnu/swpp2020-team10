from django.http import HttpResponseNotAllowed, JsonResponse
from django.contrib.postgres.search import TrigramSimilarity
from django.views.decorators.csrf import ensure_csrf_cookie
from backend.models import Ingredient


# Search matching ingredients
@ensure_csrf_cookie
def ingredient(request):
    if request.method == 'GET':
        search_query = request.GET.get('q')
        query = Ingredient.objects

        if search_query is not None:
            query = query.annotate(
                similarity=TrigramSimilarity('name', search_query)
            ).filter(similarity__gt=0.2).order_by('-similarity')

        ingredients = [ingredient for ingredient in query.values()][:5]

        return JsonResponse(ingredients, status=200, safe=False)

    return HttpResponseNotAllowed(["GET"])