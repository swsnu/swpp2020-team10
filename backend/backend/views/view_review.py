import json
from datetime import datetime
from json import JSONDecodeError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.forms.models import model_to_dict
from ..models import Review, ReviewProfile
from .util import json_default
# Fetches review by id
# JSON format follows design document - modelscd
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
            content = req_data['content'] if req_data['content'] is not None else review['content']
            review['title'] = title
            review['content'] = content
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        Review.objects.filter(id=_id).update(title=title, content=content)
        return HttpResponse(json.dumps(review), status=200, content_type='application/json')

    if request.method == 'DELETE':
        Review.objects.filter(id=_id).delete()
        return HttpResponse("Review Deleted", status=200)
    return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])


# GET : Fetches review with given recipe id
# POST : Creates new review on given recipe
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
            content = req_data['content']
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        new_review = Review(recipe_id=_id, title=title, content=content, user=request.user, time_posted=datetime.now())
        new_review.save()
        new_review_dict = model_to_dict(new_review)
        return HttpResponse(json.dumps(new_review_dict, default=json_default), status=201)
    return HttpResponseNotAllowed(['GET', 'POST'])


# Give Reaction
# PUT : Updates reaction, given {"like" : 1, "report" : 0} for like, (-1, 0) for dislike,
# (0, 1) for report. Other values shall not be feeded.
def reaction(request, _id):
    # Reaction needs login
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    try:
        review = json.dumps(Review.objects.filter(id=_id).all().values()[0],default=json_default)
    except IndexError:
        return HttpResponseBadRequest(status=404)
    # User cannot react twice to same review
    profile = ReviewProfile.objects.filter(review_id=_id, user_id=request.user.id).all()
    if len(profile) != 0:
        return HttpResponse("You already reacted to this review.\n", status=403)
    review = json.loads(review)
    cur_like = review['likes']
    cur_dislike = review['dislikes']
    cur_report = review['reports']
    if request.method == 'PUT':
        req_data = json.loads(request.body.decode())
        req_like = int(req_data['like'])
        req_dislike = int(req_data['dislike'])
        req_report = int(req_data['report'])
        cur_like += req_like
        cur_dislike += req_dislike
        cur_report += req_report
        new_profile = ReviewProfile(review_id=_id, user=request.user)
        new_profile.save()
        Review.objects.filter(id=_id).update(likes=cur_like, dislikes=cur_dislike, reports=cur_report)
        review = json.dumps(Review.objects.filter(id=_id).all().values()[0],default=json_default)
        return HttpResponse(review, status=200, content_type='application/json')

    return HttpResponseNotAllowed(["PUT"])
