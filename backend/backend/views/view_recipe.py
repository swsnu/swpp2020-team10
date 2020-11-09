import json
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from backend.models import Recipe

# Auth : Anyone can search and request for recipes

# Fetches all recipes and returns JSON object
# JSON format follows design document - modelscd
def recipes(request):
    if request.method == "GET":
        recipe_list = json.dumps(list(Recipe.objects.all().values()))
        return HttpResponse(recipe_list, status=200, content_type='application/json')
    return HttpResponseNotAllowed(["GET"])

# GET : Fetches recipe with given ID and returns JSON object
# PUT : Updates Rating of recipe, given {"recipe_id":"1", "rating":"2"} style json.
def recipe_by_id(request, _id):
    if request.method == 'GET':
        try:
            recipe = json.dumps(Recipe.objects.filter(id=_id).all().values()[0])
        except IndexError:
            return HttpResponseBadRequest(status=404)
        return HttpResponse(recipe, status=200, content_type='application/json')
    if request.method == 'PUT':
        req_data = json.loads(request.body.decode())
        try:
            rating = float(req_data['rating'])
        except KeyError:
            return HttpResponseBadRequest(status=404)
        try:
            target_object = Recipe.objects.filter(id=_id).all().values()[0]
        except IndexError:
            return HttpResponseBadRequest(status=404)
        # Using current rating and # of ratings, compute new rating
        current_rating = target_object['rating']
        current_rating_count = target_object['count_ratings']
        current_total = current_rating * current_rating_count + rating
        current_rating_count += 1
        current_rating = current_total / current_rating_count
        Recipe.objects.filter(id=_id).update(rating=current_rating, count_ratings=current_rating_count)
        return HttpResponse(f"Recipe rating for {target_object['title']} "
                            f"is updated sucessfully to {current_rating}", status=200)
    return HttpResponseNotAllowed(["GET", "PUT"])
