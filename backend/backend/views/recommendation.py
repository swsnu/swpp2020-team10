from json import JSONDecodeError
from bisect import bisect
from random import random, choice
from django.db.models import Q
from ..models import *
from math import exp

TOTAL_NUMBER_OF_LABELS = 50
TOTAL_NUMBER_OF_INGS = 1e4

# Randomly draw recipe if error.
def random_draw(request):
    all_recipes = list(Recipe.objects.all().values())
    random_recipe = choice(all_recipes)
    return random_recipe

def recommend_recipe(request):
    if not request.user.is_authenticated:
        return random_draw(request)
    request_user_id = request.user.id
    rec_ing_list = dict()
    # Create if this is first time
    try:
        pref = Preference.objects.filter(user_id=request_user_id).all().values()[0]
    except IndexError:
        p = Preference(user=request.user)
        p.save()
        #print(f"make {p}")
        pref = Preference.objects.filter(user_id=request_user_id).all().values()[0]

    try:
        lab_norm, ing_norm = pref['label_norm'], pref['ingredient_norm']
        lab_norm = 0
        ing_norm = 0
        fridge_able_flag = False
        my_ingredients, my_label_preference, my_ing_preference = set(), dict(), dict()
        for it in FridgeItem.objects.filter(user_id=request_user_id).all().values():
            my_ingredients.add(it['ingredient_id'])

        for it in LabelPreference.objects.filter(user_id=request_user_id).all().values():
            my_label_preference[it['name']] = it['score']
            lab_norm += it['score']
        for it in IngredientPreference.objects.filter(user_id=request_user_id).all().values():
            my_ing_preference[it['name']] = it['score']
            ing_norm += it['score']

        for it in IngredientIncidence.objects.all().values():
            if it['recipe_id'] in rec_ing_list:
                rec_ing_list[it['recipe_id']].append(it['ingredient_id'])
            else:
                rec_ing_list[it['recipe_id']] = [it['ingredient_id']]

        feasible_list = list(Recipe.objects.all().values())
        sc_rec_ing = dict()
        #print(f"Rec Ing : {rec_ing_list}")
        #print(f"My Ing : {list(my_ingredients)}")
        for r in feasible_list:
            if r['id'] not in rec_ing_list:
                sc_rec_ing[r['id']] = 0
            else:
                r_ing = rec_ing_list[r['id']]
                cnt = 0
                for ing in r_ing:
                    if ing in my_ingredients:
                        cnt += 1
                sc_rec_ing[r['id']] = (cnt / len(r_ing))
        query = Recipe.objects
        try:
            search_setting = request.user.searchsetting
            filter_q = Q()
            filter_q &= Q(diet_labels__contains=search_setting.diet_labels)
            filter_q &= Q(health_labels__contains=search_setting.health_labels)
            if search_setting.calories is not None:
                filter_q &= Q(calories__lte=int(search_setting.calories))
            if search_setting.cooking_time is not None:
                filter_q &= Q(cooking_time__lte=int(search_setting.cooking_time))
            if search_setting.rating is not None:
                filter_q &= Q(rating__gte=float(search_setting.rating))
            if search_setting.fridge_able is not None:
                if search_setting.fridge_able:
                    fridge_able_flag = True
            query = query.filter(filter_q)
            setting_filtered_recipes = list(query.all().values())
            for r in feasible_list:
                if r not in setting_filtered_recipes:
                    feasible_list.remove(r)
        except SearchSetting.DoesNotExist:
            pass
        #print(f"Feasible : {feasible_list}")
        # For each feasible recipe, compute score
        cdf = []
        for recipe in feasible_list:
            # Label score
            LS = 0.0
            for label in recipe['diet_labels']:
                if label not in my_label_preference:
                    my_label_preference[label] = 0.0
                else:
                    LS += (my_label_preference[label]/max(20.0, lab_norm))
            for label in recipe['health_labels']:
                if label not in my_label_preference:
                    my_label_preference[label] = 0.0
                else:
                    LS += (my_label_preference[label]/max(20.0, lab_norm))
            # Ingredient score
            IS = 0.0
            if recipe['id'] in rec_ing_list:
                for ing in rec_ing_list[recipe['id']]:
                    if ing not in my_ing_preference:
                        my_ing_preference[ing] = 0.0
                    else:
                        IS += (my_ing_preference[ing]/max(10.0, ing_norm))

            # maybe some math will do the job
            # 1 negative => Out of recommendation seems wrong.
            # Possible fix : exclude only when score <= crit (crit might be -10 or something)
            # Also, give 'small probability' for might-dislikes.
            # Does 0.1 work?
            if fridge_able_flag:
                recipe['score'] = (0.2 + (LS + IS) * sc_rec_ing[recipe['id']]) / 2.20
            else:
                recipe['score'] = (0.2 + (LS + IS)) / 2.20
            #print(f"score of {recipe['id']} : {recipe['title']} in {request_user_id} perspective : {recipe['score']}")
            #print(f"{recipe['id']} {recipe['title']} : {LS} {IS} {sc_rec_ing[recipe['id']]} = {recipe['score']}")
        #print(feasible_list)
        tpr = 0
        # Probability ~ (Score)^2
        candidate_count = 0
        max_prob = 0
        for r in feasible_list:
            #print(r)
            if r['score'] < 0:
                r['pr'] = 0
            else:
                r['pr'] = 1 / (1 + exp(1/r['score']))
                candidate_count+=1
                max_prob = max(max_prob, r['pr'])
            tpr += r['pr']
        if candidate_count <= 10 or max_prob > 0.4:
            return random_draw(request)
        for r in feasible_list:
            pr = r['pr'] / tpr
            if len(cdf) == 0:
                cdf = [pr]
            else:
                cdf.append(cdf[-1] + pr)
                #print(f"{r['id']} : {r['title']} : {pr}")
        #print(f"Recommendation success")
        chosen_recipes = set()
        rec_ind = bisect(cdf,random())
        chosen_recipes.add(rec_ind)
        return feasible_list[rec_ind]
    except (KeyError, ValueError, IndexError, TypeError, JSONDecodeError):
        return random_draw(request)
