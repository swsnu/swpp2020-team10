import json
from datetime import datetime
from json import JSONDecodeError
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.forms.models import model_to_dict
from django.views.decorators.csrf import ensure_csrf_cookie

from ..models import Review, ReviewProfile
from .util import json_default
# Fetches review by id
# JSON format follows design document - modelscd
@ensure_csrf_cookie
def review_by_id(request, _id):
    try:
        review = json.dumps(Review.objects.filter(id=_id).all().values()[0],default=json_default)
    except (IndexError, JSONDecodeError):
        return HttpResponseBadRequest(status=404)
    if request.method == 'GET':
        return HttpResponse(review, status=200, content_type='application/json')
    # PUT / DELETE requires authentication.
    # Only writer can PUT/DELETE...
    review = json.loads(review)
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if request.user.id != review['user_id']:
        return HttpResponse(f"Invalid request : author {review['user_id']} but you are {request.user.id}\n", status=403)
    if request.method == 'PUT':
        try:
            req_data = json.loads(request.body.decode())
            title = req_data['title'] if req_data['title'] is not None else review['title']
            image_url = req_data['image_url'] if req_data['image_url'] is not None else review['image_url']
            content = req_data['content'] if req_data['content'] is not None else review['content']
            review['title'] = title
            review['image_url'] = image_url
            review['content'] = content
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        Review.objects.filter(id=_id).update(title=title, content=content, image_url=image_url)
        return HttpResponse(json.dumps(review), status=200, content_type='application/json')

    if request.method == 'DELETE':
        Review.objects.filter(id=_id).delete()
        return HttpResponse("Review Deleted", status=200)
    return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])


# GET : Fetches review with given recipe id
# POST : Creates new review on given recipe
@ensure_csrf_cookie
def recipe_review(request, _id):
    reviews = json.dumps(list(Review.objects.filter(recipe_id=_id).all().values()),default=json_default)
    if request.method == 'GET':
        return HttpResponse(reviews, status=200, content_type='application/json')

    # POST here requires login
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            title = req_data['title']
            image_url = req_data['image_url']
            content = req_data['content']
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        new_review = Review(recipe_id=_id, title=title, image_url=image_url,
                            content=content, user=request.user, time_posted=datetime.now())
        new_review.save()
        new_review_dict = Review.objects.filter(id=new_review.id).values().get()
        return HttpResponse(json.dumps(new_review_dict, default=json_default), status=201)
    return HttpResponseNotAllowed(['GET', 'POST'])


# Give Reaction
# PUT : Updates reaction, given {"like" : 1, "report" : 0} for like, (-1, 0) for dislike,
# (0, 1) for report. Other values shall not be feeded.
def reaction(request, _id):
    # Reaction needs login
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n", status=401)

    if request.method == "PUT":
        try:
            review = Review.objects.filter(id=_id).all().values()[0]
        except IndexError:
            return HttpResponseBadRequest(status=404)

        likes = review["likes"]
        dislikes = review["dislikes"]
        reports = review["reports"]

        req_data = json.loads(request.body.decode())
        new_like = int(req_data["like"])
        new_dislike = int(req_data["dislike"])
        new_report = int(req_data["report"])

        likes += new_like
        dislikes += new_dislike
        reports += new_report

        profile = ReviewProfile.objects.filter(review_id=_id, user=request.user)

        # has reacted before
        if profile.exists():
            old_like = profile.get().likes
            old_dislike = profile.get().dislikes
            old_report = profile.get().reports

            profile.update(likes=new_like, dislikes=new_dislike, reports=new_report)

            likes -= old_like
            dislikes -= old_dislike
            reports -= old_report

        else:
            ReviewProfile.objects.create(
                review_id=_id,
                user=request.user,
                likes=new_like,
                dislikes=new_dislike,
                reports=new_report,
            )

        Review.objects.filter(id=_id).update(likes=likes, dislikes=dislikes, reports=reports)
        return JsonResponse(Review.objects.filter(id=_id).values().get(), status=200)

    return HttpResponseNotAllowed(["PUT"])
