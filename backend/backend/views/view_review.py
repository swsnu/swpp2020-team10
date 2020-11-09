import json
from json import JSONDecodeError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from backend.models import Review

# Fetches review by id
# JSON format follows design document - modelscd
def review_by_id(request, _id):
    try:
        review = json.dumps(Review.objects.filter(id=_id).all().values()[0])
    except IndexError:
        return HttpResponseBadRequest(status=404)
    if request.method == 'GET':
        return HttpResponse(review, status=200, content_type='application/json')
    # PUT / DELETE requires authentication.
    # Only writer can PUT/DELETE...
    review = json.loads(review)
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if request.user.id != review['user_id']:
        return HttpResponse(f"Invalid request : author {review['author_id']} but you are {request.user.id}\n", status=403)
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
    try:
        reviews = json.dumps(list(Review.objects.filter(recipe_id=_id).all().values()))
    except JSONDecodeError:
        return HttpResponse(status=404)
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
        new_review = Review(recipe_id=_id, title=title, content=content, user=request.user)
        new_review.save()
        return HttpResponse(json.dumps(new_review), status=200)
    return HttpResponseNotAllowed(['GET', 'POST'])


# Give Reaction
# PUT : Updates reaction, given {"like" : 1, "report" : 0} for like, (-1, 0) for dislike,
# (0, 1) for report. Other values shall not be feeded.
def reaction(request, _id):
    # Reaction needs login
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    try:
        review = json.dumps(Review.objects.filter(id=_id).all().values()[0])
    except IndexError:
        return HttpResponseBadRequest(status=404)
    review = json.loads(review)
    cur_like = review['likes']
    cur_report = review['reports']
    if request.method == 'PUT':
        req_data = json.loads(request.body.decode())
        try:
            req_like = int(req_data['like'])
            req_report = int(req_data['report'])
        except (TypeError, ValueError, JSONDecodeError):
            return HttpResponseBadRequest("Cannot feed non-numeric request")

        if req_like != 0 and req_report != 0:
            return HttpResponseBadRequest("Cannot feed both reaction at once")
        cur_like += req_like
        cur_report += req_report
        Review.objects.filter(id=_id).update(likes=cur_like, reports=cur_report)
        review = json.dumps(Review.objects.filter(id=_id).all().values()[0])
        return HttpResponse(review, status=200, content_type='application/json')

    return HttpResponseNotAllowed(["PUT"])
