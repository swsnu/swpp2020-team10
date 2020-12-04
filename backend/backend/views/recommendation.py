import json
from datetime import datetime
from json import JSONDecodeError
from django.forms.models import model_to_dict
from ..models import *
from .util import json_default
from bisect import bisect
from random import random, choice


TOTAL_NUMBER_OF_LABELS = 50
TOTAL_NUMBER_OF_INGS = 1e4
# Very inefficient implementation (Proof of concept)
def recommend_recipe(request):
    request_user_id = request.user.id

    # Create if this is first time
    try:
        pref = Preference.objects.filter(user_id=request_user_id).all().values()[0]
    except IndexError:
        p = Preference(user=request.user)
        p.save()
        print(f"make {p}")
        pref = Preference.objects.filter(user_id=request_user_id).all().values()[0]
    lab_norm, ing_norm = pref['label_norm'], pref['ingredient_norm']

    my_ingredients, my_label_preference, my_ing_preference = dict(), dict(), dict()
    for it in FridgeItem.objects.filter(user_id=request_user_id).all().values():
        my_ingredients[it['name']] = it['quantity']

    # If giant JsonField is better, we will go with that
    # Then load jsons to my_label_preference, my_ing_preference
    for it in LabelPreference.objects.filter(user_id=request_user_id).all().values():
        my_label_preference[it['name']] = it['score']

    for it in IngredientPreference.objects.filter(user_id=request_user_id).all().values():
        my_ing_preference[it['name']] = it['score']

    #print(my_ingredients)
    feasible_list = list()
    for r in Recipe.objects.all().values():
        ing_json = r['ingredients']
        flag = True
        for ing in ing_json.keys():
            if ing not in my_ingredients.keys():
                flag = False
                break
            if ing_json[ing] > my_ingredients[ing]:
                flag = False
                break
        if flag is True:
            #print(f"Recipe {r['id']} is feasible")
            feasible_list.append(r)

    if len(feasible_list) == 0:
        return None

    # For each feasible recipe, compute score
    cdf = []
    sqscs = 0.0
    for recipe in feasible_list:
        # Label score
        LS = 0.0
        for label in recipe['diet_labels']:
            if label not in my_label_preference:
                my_label_preference[label] = 0.0
                lp = LabelPreference(user=request.user, name=label, score=0.0)
                lp.save()
            else:
                LS += (my_label_preference[label]/max(1.0, lab_norm))

        for label in recipe['health_labels']:
            if label not in my_label_preference:
                my_label_preference[label] = 0.0
                lp = LabelPreference(user=request.user, name=label, score=0.0)
                lp.save()
            else:
                LS += (my_label_preference[label]/max(1.0, lab_norm))
        # Ingredient score
        IS = 0.0
        for ing in recipe['ingredients'].keys():
            if ing not in my_ing_preference:
                my_ing_preference[ing] = 0.0
                ip = IngredientPreference(user=request.user, name=ing, score=0.0)
                ip.save()
            else:
                IS += (my_ing_preference[ing]/max(1.0, ing_norm))

        # maybe some math will do the job
        # 1 negative => Out of recommendation seems wrong.
        # Possible fix : exclude only when score <= crit (crit might be -10 or something)
        # Also, give 'small probability' for might-dislikes.
        recipe['score'] = LS + IS
        if recipe['score'] >= 0:
            sqscs += pow(recipe['score'], 2)
    if sqscs == 0:
        return choice(feasible_list)
    # Probability ~ (Score)^2
    
    for r in feasible_list:
        if r['score'] < 0:
            pr = 0
        else:
            pr = (pow(r['score'], 2) / sqscs)
        if len(cdf) == 0:
            cdf = [pr]
        else:
            cdf.append(cdf[-1] + pr)

    rec_ind = bisect(cdf,random())
    recipe = feasible_list[rec_ind]
    print(my_ing_preference)
    print(my_label_preference)
    return recipe
