import json
from json import JSONDecodeError
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.views.decorators.csrf import ensure_csrf_cookie

from ..models import Comment, CommentProfile
from .util import json_default
# Fetches comment by id
# JSON format follows design document - modelscd
@ensure_csrf_cookie
def comment_by_id(request, _id):
    try:
        comment = json.dumps(Comment.objects.filter(id=_id).all().values()[0],default=json_default)
    except IndexError:
        return HttpResponseBadRequest(status=404)
    if request.method == 'GET':
        return HttpResponse(comment, status=200, content_type='application/json')
    # PUT / DELETE requires authentication
    comment = json.loads(comment)
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    if request.user.id != comment['user_id']:
        return HttpResponse(f"Invalid request : author {comment['user_id']} but you are {request.user.id}\n", status=403)
    if request.method == 'PUT':
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
@ensure_csrf_cookie
def review_comment(request, _id):
    comments = json.dumps(list(Comment.objects.filter(review_id=_id).all().values()),default=json_default)
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
        new_comment_dict = Comment.objects.filter(id=new_comment.id).values().get()
        return HttpResponse(json.dumps(new_comment_dict,default=json_default), status=201)
    return HttpResponseNotAllowed(['GET', 'POST'])


# Give Reaction
# PUT : Updates reaction, given {"like" : 1, "report" : 0} for like, (-1, 0) for dislike,
# (0, 1) for report. Other values shall not be feeded.
def reaction(request, _id):
    # Reaction needs login
    if not request.user.is_authenticated:
        return HttpResponse("You are not logged in\n",status=401)
    
    if request.method == 'PUT':
        try:
            comment = Comment.objects.filter(id=_id).values()[0]
        except IndexError:
            return HttpResponseBadRequest(status=404)
        
        likes = comment['likes']
        dislikes = comment['dislikes']
        reports = comment['reports']

        req_data = json.loads(request.body.decode())
        new_like = int(req_data['like'])
        new_dislike = int(req_data['dislike'])
        new_report = int(req_data['report'])
        
        likes += new_like
        dislikes += new_dislike
        reports += new_report

        profile = CommentProfile.objects.filter(comment_id=_id, user=request.user)
        
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
            CommentProfile.objects.create(
                comment_id=_id,
                user=request.user,
                likes=new_like,
                dislikes=new_dislike,
                reports=new_report,
            )
        
        Comment.objects.filter(id=_id).update(likes=likes, dislikes=dislikes, reports=reports)
        return JsonResponse(Comment.objects.filter(id=_id).values().get(), status=200)

    return HttpResponseNotAllowed(["PUT"])
