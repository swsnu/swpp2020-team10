from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from .recommendation import *


def recommendation(request):
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if not request.method == 'GET':
        return HttpResponseNotAllowed(['GET'])
    result = recommend_recipe(request)
    return JsonResponse(result, safe=False)

def recommendation_react(request):
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if not request.method == 'POST':
        return HttpResponseNotAllowed(['POST'])
    request_user_id = request.user.id
    json_request = json.loads(request.body.decode())
    recipe_id = json_request['recipe_id']
    reaction = int(json_request['reaction'])
    pref = Preference.objects.filter(user_id=request_user_id).all().values()[0]
    lab_norm, ing_norm = pref['label_norm'], pref['ingredient_norm']
    my_label_preference, my_ing_preference = dict(), dict()
    for it in LabelPreference.objects.filter(user_id=request_user_id).all().values():
        my_label_preference[it['name']] = it['score']
    for it in IngredientPreference.objects.filter(user_id=request_user_id).all().values():
        my_ing_preference[it['name']] = it['score']
    target_recipe = Recipe.objects.filter(id=recipe_id).all().values()[0]
    # Label preference update

    for label in target_recipe['diet_labels']:
        my_label_preference[label] += reaction
        lab_norm += my_label_preference[label] * 2 * reaction - 1
        LabelPreference.objects.filter(user_id=request_user_id, name=label).update(score=my_label_preference[label])

    for label in target_recipe['health_labels']:
        my_label_preference[label] += reaction
        lab_norm += my_label_preference[label] * 2 * reaction - 1
        LabelPreference.objects.filter(user_id=request_user_id, name=label).update(score=my_label_preference[label])

    for ing in target_recipe['ingredients']:
        my_ing_preference[ing] += reaction
        ing_norm += my_ing_preference[ing] * 2 * reaction - 1
        IngredientPreference.objects.filter(user_id=request_user_id, name=ing) \
            .update(score=my_ing_preference[ing])

    Preference.objects.filter(user_id=request_user_id) \
        .update(label_norm=lab_norm, ingredient_norm=ing_norm)
    print("Preference updated")
    print(my_label_preference)
    print(my_ing_preference)
    print(lab_norm, ing_norm)
    return HttpResponse("Updated preferences as you reacted")
