import json
from django.test import TestCase, Client
from .data_for_testing import test_comment_write as rev, test_user, test_review_give_report
from ..models import *

class CommentTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username=test_user['username'], password=test_user['password'])
        self.food = Food.objects.create(name='food_name')
        self.recipe = Recipe.objects.create(food=self.food, title="plz kill me")
        self.review = Review.objects.create(recipe=self.recipe, user=self.user, title="title", content="content")
        self.revid = self.review.id

    def test_comment_nologin(self):
        second_test_user = User.objects.create_user(username="some-other-user", password='password')
        some_comment = Comment.objects.create(review=self.review, user=second_test_user, content="adsasdasd")
        client = Client()
        response = client.get(f'/api/review/{self.revid}/comment/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/comment/999999/')
        self.assertEqual(response.status_code, 404)
        response = client.get(f'/api/comment/{some_comment.id}/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/comment/1/reaction/')
        self.assertEqual(response.status_code, 401)
        # No login errors
        response = client.put(f'/api/comment/{some_comment.id}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/review/1/comment/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 401)

    def test_comment_login(self):
        second_test_user = User.objects.create_user(username="some-other-user", password='password')
        client = Client()
        response = client.post('/api/user/signin/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 200)

        second_comment = Comment.objects.create(review=self.review, user=second_test_user, content="adsasdasd")
        response = client.post(f'/api/review/{self.revid}/comment/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 201)

        response = client.post(f'/api/review/{self.revid}/comment/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 201)
        wid = json.loads(response.content)['id']
        response = client.post(f'/api/review/{self.revid}/comment/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 400)
        response = client.put(f'/api/review/{self.revid}/comment/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 405)

        response = client.put(f'/api/comment/{wid}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/comment/{wid}/', json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # You can't modify other's review
        response = client.put(f'/api/comment/{second_comment.id}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 403)

        # There is no patch
        response = client.patch(f'/api/comment/{wid}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 405)

        # Delete
        response = client.delete(f'/api/comment/{wid}/')
        self.assertEqual(response.status_code, 200)

        # Rating
        response = client.get('/api/comment/999999999/reaction/')
        self.assertEqual(response.status_code, 404)
        response = client.put(f'/api/comment/{second_comment.id}/reaction/', json.dumps(test_review_give_report),
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.post(f'/api/comment/{second_comment.id}/reaction/', json.dumps(test_review_give_report),
                               content_type='application/json')
        self.assertEqual(response.status_code, 405)
