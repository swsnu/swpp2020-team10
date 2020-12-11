import json
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from backend.models import Recipe, RecipeProfile

# Auth : Anyone can search and request for recipes

# Fetches all recipes and returns JSON object
# JSON format follows design document - modelscd
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def recipes(request):
    if request.method == "GET":
        recipe_list = json.dumps(list(Recipe.objects.all().values()))
        return HttpResponse(recipe_list, status=200, content_type='application/json')
    return HttpResponseNotAllowed(["GET"])

# GET : Fetches recipe with given ID and returns JSON object
# PUT : Updates Rating of recipe, given {"recipe_id":"1", "rating":"2"} style json.
@csrf_exempt
def recipe_by_id(request, _id):
    if request.method == "GET":
        try:
            recipe = json.dumps(Recipe.objects.filter(id=_id).all().values()[0])
        except IndexError:
            return HttpResponseBadRequest(status=404)
        return HttpResponse(recipe, status=200, content_type="application/json")

    if request.method == "PUT":
        if not request.user.is_authenticated:
            return HttpResponse("You are not logged in\n", status=401)

        req_data = json.loads(request.body.decode())

        try:
            new_rating = float(req_data["rating"])
        except KeyError:
            return HttpResponseBadRequest(status=404)

        try:
            target_object = Recipe.objects.filter(id=_id).all().values()[0]
        except IndexError:
            return HttpResponseBadRequest(status=404)

        old_rating_avg = target_object["rating"]
        old_rating_count = target_object["count_ratings"]
        old_rating_sum = old_rating_avg * old_rating_count

        profile = RecipeProfile.objects.filter(recipe_id=_id, user=request.user)

        # has rated before
        if profile.exists():
            old_rating = profile.get().rating
            profile.update(rating=new_rating)
            new_rating_sum = old_rating_sum - old_rating + new_rating
            new_rating_count = old_rating_count
            new_rating_avg = new_rating_sum / old_rating_count
        else:
            RecipeProfile.objects.create(recipe_id=_id, user=request.user, rating=new_rating)
            new_rating_sum = old_rating_sum + new_rating
            new_rating_count = old_rating_count + 1
            new_rating_avg = new_rating_sum / new_rating_count

        Recipe.objects.filter(id=_id).update(rating=new_rating_avg, count_ratings=new_rating_count)
        return JsonResponse(
            {"rating": new_rating_avg, "count_ratings": new_rating_count},
            status=200,
        )

    return HttpResponseNotAllowed(["GET", "PUT"])
