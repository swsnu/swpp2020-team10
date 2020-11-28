import datetime
import json

from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from backend.models import SearchSetting
from django.views.decorators.csrf import csrf_exempt
from ..models import FridgeItem, Review, Comment, Recipe

def signup(request):
    if request.method == "POST":
        request_data = json.loads(request.body.decode())
        username = request_data["username"]
        password = request_data["password"]
        email = request_data["email"]

        # username already exists
        if User.objects.filter(username=username).exists():
            return HttpResponse(status=409)

        new_user = User.objects.create_user(username=username, password=password, email=email)
        new_user.save()
        new_setting = SearchSetting(user=new_user)
        new_setting.save()
        
        return HttpResponse(status=201)

    return HttpResponseNotAllowed(["POST"])

def signin(request):
    if request.method == "POST":
        request_data = json.loads(request.body.decode())
        username = request_data["username"]
        password = request_data["password"]

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            response_data = {
                "user_id": user.id,
                "username": user.username,
            }
            return JsonResponse(response_data, status=200)

        # invalid credentials
        return HttpResponse(status=401)

    return HttpResponseNotAllowed(["POST"])

def signout(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    if request.method == "GET":
        logout(request)
        return HttpResponse(status=204)

    return HttpResponseNotAllowed(["GET"])

def status(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        response_data = {
            "user_id": request.user.id,
            "username": request.user.username,
        }
        return JsonResponse(response_data, status=200)

    return HttpResponseNotAllowed(["GET"])


def profile(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    if request.method == "GET":
        response_data = {
            "username": request.user.username,
            "email": request.user.email,
        }
        return JsonResponse(response_data, status=200)

    if request.method == "PUT":
        request_data = json.loads(request.body.decode())
        password = request_data["password"]

        request.user.set_password(password)
        request.user.save()
        update_session_auth_hash(request, request.user)

        return HttpResponse(status=200)

    return HttpResponseNotAllowed(["GET", "PUT"])

THRESHOLD_ITEM_DAYS    = 2.00
THRESHOLD_COMMENT_DAYS = 1.00
# Notification : Fridge item expiry date 24h, past 24h comment on your review
def notification(request, _id):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        noti = {
            "recent_comments" : [],
            "near_expired_items" : [],
        }
        my_fridge_items = list(FridgeItem.objects.filter(user_id=_id).all().values())
        my_review_comments = list(Comment.objects.filter(review__user_id=_id).all().values())
        now = datetime.datetime.now(datetime.timezone.utc)
        for item in my_fridge_items:
            seconds_left = (item['expiry_date']-now ).total_seconds()
            days_left = seconds_left / 86400
            if days_left < THRESHOLD_ITEM_DAYS :
                noti['near_expired_items'].append({
                    'name' : item['name'],
                    'quantity' : item['quantity'],
                    'left_days' : int(days_left)
                })
        for cm in my_review_comments:
            seconds_elapsed = (now - cm['time_posted']).total_seconds()
            days_elapsed = seconds_elapsed / 86400
            if days_elapsed < THRESHOLD_COMMENT_DAYS:
                on_review = Review.objects.filter(id=cm['review_id']).all().values()[0]
                noti['recent_comments'].append({
                    'comment_author' : cm['author_name'],
                    'review_id' : cm['review_id'],
                    'review_title' : on_review['title'],
                    'review_recipe' : Recipe.objects.filter(id=on_review['recipe_id']).all().values()[0]['title']
                })

        return JsonResponse(noti, status=200)
    return HttpResponseNotAllowed(["GET"])