import json
from json import JSONDecodeError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.forms.models import model_to_dict
from backend.models import Food, FridgeItem

# Users cannot send request to here without authentication
# -> authentication already ensured by frontend, so
# checks for authentication is not needed here

# Fetches all food info and returns JSON object
def manage_food(request):
    if request.method == "GET":
        food_list = json.dumps(list(Food.objects.all().values()))
        return HttpResponse(food_list, status=200, content_type='application/json')
    return HttpResponseNotAllowed(["GET"])

# GET: fetches all fridgeItems with given user id
# POST: creates new fridgeItem on given user id
def manage_fridge(request, _id):
    if request.method == "GET":
        fridge_item_list = json.dumps(list(FridgeItem.objects.filter(user_id=_id).all().values()))
        return HttpResponse(fridge_item_list, status=200, content_type="application/json")

    if request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            name = req_data['name']
            quantity = req_data['quantity']
            food_id = req_data['food']
            expiry_date = req_data['expiry_date']
            nutrition_facts = req_data['nutrition_facts']
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        new_fridge_item = FridgeItem(food_type=food_id, user=request.user, quantity=quantity, name=name,
            expiry_date=expiry_date, nutrition_facts=nutrition_facts)
        new_fridge_item.save()
        new_fridge_item_dict = model_to_dict(new_fridge_item)
        return HttpResponse(json.dumps(new_fridge_item_dict), status=201)
    return HttpResponseNotAllowed(['GET', 'POST'])

# GET: fetches fridgeItem by id
# PUT: updates fridgeItem by id
# DELETE: deletes fridgeItem by id
def fridge_by_id(request, _id):
    try:
        fridge_item = json.dumps(FridgeItem.objects.filter(id=_id).all().values()[0])
    except (IndexError, JSONDecodeError):
        return HttpResponseBadRequest(status=404)
    if request.method == "GET":
        return HttpResponse(fridge_item, status=200, content_type='application/json')
    if request.method == "PUT":
        fridge_item = json.loads(fridge_item)
        try:
            req_data = json.loads(request.body.decode())
            name = req_data['name'] if req_data['name'] is not None else fridge_item['name']
            quantity = req_data['quantity'] if req_data['quantity'] is not None else fridge_item['quantity']
            expiry_date = req_data['expiry_date'] if req_data['expiry_date'] is not None else fridge_item['expiry_date']
            nutrition_facts = req_data['nutrition_facts'] if req_data['nutrition_facts'] is not None else fridge_item['nutrition_facts']
            fridge_item['name'] = name
            fridge_item['quantity'] = quantity
            fridge_item['expiry_date'] = expiry_date
            fridge_item['nutrition_facts'] = nutrition_facts
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        FridgeItem.objects.filter(id=_id).update(name=name, quantity=quantity, expiry_date=expiry_date, nutrition_facts=nutrition_facts)
        return HttpResponse(json.dumps(fridge_item), status=200, content_type='application/json')
    if request.method == 'DELETE':
        FridgeItem.objects.filter(id=_id).delete()
        return HttpResponse("FridgeItem Deleted", status=200)
    return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])
