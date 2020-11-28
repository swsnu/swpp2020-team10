import json
from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from backend.models import SearchSetting
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
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

@csrf_exempt
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

@csrf_exempt
def signout(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    if request.method == "GET":
        logout(request)
        return HttpResponse(status=204)

    return HttpResponseNotAllowed(["GET"])

@csrf_exempt
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

@csrf_exempt
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
