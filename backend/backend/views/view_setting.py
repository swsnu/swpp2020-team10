import json
from json import JSONDecodeError
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.forms.models import model_to_dict
from backend.models import SearchSetting
from django.views.decorators.csrf import csrf_exempt

# Fetches setting by user id
@csrf_exempt
def setting(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    if request.method == "GET":
        search_setting = request.user.searchsetting
        response_data = {
            "fridge_able": search_setting.fridge_able,
            "diet_labels": search_setting.diet_labels,
            "health_labels": search_setting.health_labels,
            "calories": search_setting.calories,
            "cooking_time": search_setting.cooking_time,
            "rating": search_setting.rating
        }
        return JsonResponse(response_data, status=200)

    if request.method == "PUT":
        request_data = json.loads(request.body.decode())
        search_setting = request.user.searchsetting

        search_setting.fridge_able = True if request_data["fridge_able"] == "true" else False
        search_setting.diet_labels = request_data["diet_labels"]
        search_setting.health_labels = request_data["health_labels"]
        search_setting.calories = request_data["calories"]
        search_setting.cooking_time = request_data["cooking_time"]
        search_setting.rating = request_data["rating"]

        search_setting.save()

        return HttpResponse(status=201)

    return HttpResponseNotAllowed(["GET", "PUT"])