import json
from json import JSONDecodeError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from backend.models import Comment

# Fetches comment by id
# JSON format follows design document - modelscd
def comment_by_id(request, _id):
    try:
        comment = json.dumps(Comment.objects.filter(id=_id).all().values()[0])
    except IndexError:
        return HttpResponseBadRequest(status=404)
    if request.method == 'GET':
        return HttpResponse(comment, status=200, content_type='application/json')
    # PUT / DELETE requires authentication
    comment = json.loads(comment)
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if request.user.id != comment['user_id']:
        return HttpResponse(f"Invalid request : author {comment['author_id']} but you are {request.user.id}\n", status=403)
    if request.method == 'PUT':
        comment = json.loads(comment)
        try:
            req_data = json.loads(request.body.decode())
            content = req_data['content'] if req_data['content'] is not None else comment['content']
            comment['content'] = content
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        Comment.objects.filter(id=_id).update(content=content)
        return HttpResponse(json.dumps(comment), status=200, content_type='application/json')

    if request.method == 'DELETE':
        Comment.objects.filter(id=_id).delete()
        return HttpResponse("Comment Deleted", status=200)
    return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])


# GET : Fetches comment with given review id
# PUT : Creates new comment on given review
def review_comment(request, _id):
    try:
        comments = json.dumps(list(Comment.objects.filter(review_id=_id).all().values()))
    except JSONDecodeError:
        return HttpResponse(status=404)
    if request.method == 'GET':
        return HttpResponse(comments, status=200, content_type='application/json')
    # POST requires login
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            content = req_data['content']
        except (KeyError, JSONDecodeError, IndexError):
            return HttpResponse(status=400)
        new_comment = Comment(review_id=_id, content=content, user=request.user)
        new_comment.save()
        return HttpResponse(json.dumps(new_comment), status=200)
    return HttpResponseNotAllowed(['GET', 'POST'])


# Give Reaction
# PUT : Updates reaction, given {"like" : 1, "report" : 0} for like, (-1, 0) for dislike,
# (0, 1) for report. Other values shall not be feeded.
def reaction(request, _id):
    # Reaction needs login
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    try:
        comment = json.dumps(Comment.objects.filter(id=_id).all().values()[0])
    except IndexError:
        return HttpResponseBadRequest(status=404)
    comment = json.loads(comment)
    cur_like = comment['likes']
    cur_report = comment['reports']
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
        Comment.objects.filter(id=_id).update(likes=cur_like, reports=cur_report)
        comment = json.dumps(Comment.objects.filter(id=_id).all().values()[0])
        return HttpResponse(comment, status=200, content_type='application/json')

    return HttpResponseNotAllowed(["PUT"])
