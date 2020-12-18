import json
from django.test import TestCase, Client
from .data_for_testing import test_review_write as rev, test_user, test_review_give_report, t_data
from ..models import *

class ReviewTestCase(TestCase):
    def setUp(self):
        self.t_data = t_data()

    def test_review_nologin(self):
        client = Client()
        response = client.get('/api/recipe/1/review/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/review/999999/')
        self.assertEqual(response.status_code, 404)
        response = client.get(f'/api/review/{self.t_data.review.id}/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/review/1/reaction/')
        self.assertEqual(response.status_code, 401)
        # No login errors
        response = client.put(f'/api/review/{self.t_data.review.id}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = client.post(f'/api/recipe/{self.t_data.recipe.id}/review/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 401)


    def test_review_login(self):
        second_test_user = self.t_data.second_user
        some_review = Review.objects.create(recipe=self.t_data.recipe, user=second_test_user, title="title", content="adsasdasd")

        client = Client()
        client.post('/api/user/signup/', json.dumps(test_user), content_type='applications/json')
        response = client.post('/api/user/signin/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/recipe/1/review/')
        self.assertEqual(response.status_code, 200)
        response = client.post('/api/recipe/1/review/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 201)
        wid = json.loads(response.content)['id']
        response = client.post('/api/recipe/1/review/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 400)
        response = client.put('/api/recipe/1/review/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 405)

        response = client.put(f'/api/review/{wid}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/review/{wid}/', json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # You can't modify other's review
        response = client.put(f'/api/review/{some_review.id}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 403)

        # There is no patch
        response = client.patch(f'/api/review/{wid}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 405)

        # Delete
        response = client.delete(f'/api/review/{wid}/')
        self.assertEqual(response.status_code, 200)

        # Rating

        response = client.put('/api/review/999999999999/reaction/', json.dumps(test_review_give_report),
                              content_type='application/json')
        self.assertEqual(response.status_code, 404)
        response = client.put(f'/api/review/{self.t_data.review.id}/reaction/', json.dumps(test_review_give_report),
                              content_type='application/json')
        response = client.put(f'/api/review/{self.t_data.review.id}/reaction/', json.dumps(test_review_give_report),
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.post(f'/api/review/{self.t_data.review.id}/reaction/', json.dumps(test_review_give_report),
                               content_type='application/json')
        self.assertEqual(response.status_code, 405)
