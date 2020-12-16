import json
import datetime
from json import JSONDecodeError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.forms.models import model_to_dict
from backend.models import FridgeItem

# Users cannot send request to here without authentication
# -> authentication already ensured by frontend, so
# checks for authentication is not needed here
from django.views.decorators.csrf import csrf_exempt


def json_default(value):
    return value.strftime('%Y-%m-%d')

'''
# Fetches all food info and returns JSON object
def manage_food(request):
    if request.method == "GET":
        food_list = json.dumps(list(Food.objects.all().values()))
        return HttpResponse(food_list, status=200, content_type='application/json')
    return HttpResponseNotAllowed(["GET"])
'''
# GET: fetches all fridgeItems with given user id
# POST: creates new fridgeItem on given user id
# DELETE: clears all fridgeItems with given user id
def manage_fridge(request, _id):
    if request.method == "GET":
        fridge_item_list = json.dumps(list(FridgeItem.objects.filter(user_id=_id).all().values()),
            default=json_default)
        return HttpResponse(fridge_item_list, status=200, content_type="application/json")

    if request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            name = req_data['name']
            ingredient_id = req_data['ingredient_id']
            quantity = req_data['quantity']
            unit = req_data['unit']
            expiry_date = req_data['expiry_date']
            image = req_data['image']
        except (KeyError, JSONDecodeError, IndexError) as e:
            print(e)
            return HttpResponse(status=400)
        new_fridge_item = FridgeItem(
            ingredient_id=ingredient_id, user=request.user, quantity=quantity,
            name=name, expiry_date=expiry_date, unit=unit, image=image)
        new_fridge_item.save()
        new_fridge_item_dict = FridgeItem.objects.filter(id=new_fridge_item.id).all().values()[0]
        return HttpResponse(json.dumps(new_fridge_item_dict, default=json_default), status=201)
    
    if request.method == "DELETE":
        FridgeItem.objects.filter(user_id=_id).delete()
        return HttpResponse("FridgeItem Deleted", status=200)
    return HttpResponseNotAllowed(['GET', 'POST', 'DELETE'])

# GET: fetches fridgeItem by id
# PUT: updates fridgeItem by id
# DELETE: deletes fridgeItem by id
@csrf_exempt
def fridge_by_id(request, _id):
    try:
        fridge_item = json.dumps(FridgeItem.objects.filter(id=_id).all().values()[0],
            default=json_default)
    except (IndexError, JSONDecodeError):
        return HttpResponseBadRequest(status=404)
    if request.method == "GET":
        return HttpResponse(fridge_item, status=200, content_type='application/json')
    # PUT / DELETE requires authentication
    fridge_item = json.loads(fridge_item)
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if request.user.id != fridge_item['user_id']:
        return HttpResponse(
            f"Invalid request : author {fridge_item['user_id']} but you are {request.user.id}\n",
            status=403)
    if request.method == "PUT":
        try:
            req_data = json.loads(request.body.decode())
            if req_data['name'] is not None:
                name = req_data['name']
            else: name = fridge_item['name']
            if req_data['quantity'] is not None:
                quantity = req_data['quantity']
            else: quantity = fridge_item['quantity']
            if req_data['unit'] is not None:
                unit = req_data['unit']
            else: unit = fridge_item['unit']
            if req_data['expiry_date'] is not None:
                expiry_date = req_data['expiry_date']
            else: expiry_date =  fridge_item['expiry_date']
            fridge_item['name'] = name
            fridge_item['quantity'] = quantity
            fridge_item['unit'] = unit
            fridge_item['expiry_date'] = expiry_date
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        FridgeItem.objects.filter(id=_id).update(name=name, quantity=quantity,
            expiry_date=expiry_date, unit=unit)
        return HttpResponse(json.dumps(fridge_item, default=json_default), status=200,
            content_type='application/json')
    if request.method == 'DELETE':
        FridgeItem.objects.filter(id=_id).delete()
        return HttpResponse("FridgeItem Deleted", status=200)
    return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])
