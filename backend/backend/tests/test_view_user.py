import json
from django.test import TestCase, Client
from .data_for_testing import test_review_write as rev, test_user, test_review_give_report, test_user_2
from ..models import User, Recipe, Food, FridgeItem

class UserTestCase(TestCase):
    def setUp(self):
        client = Client()
        response = client.post('/api/user/signup/', json.dumps(test_user), content_type='application/json')
        Food.objects.create(name='food', nutrition={"key":"value"},tag={"key":"value"},unit="1")
        Recipe.objects.create(food_id=1, title='recipe_1', content='content', rating=0, count_ratings=0,
                              ingredients={"key":"value"},cooking_time=120,tag={"key":"value"},serving=1)

    def test_user_signup(self):
        client = Client()
        response = client.put('/api/user/signup/', json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_user_signin(self):
        client = Client()
        response = client.get('/api/user/signout/')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/user/signin/',json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/user/signout/')
        self.assertEqual(response.status_code, 405)
        response = client.get('/api/user/signout/')
        self.assertEqual(response.status_code, 204)
        response = client.post('/api/user/signin/',json.dumps(test_user_2), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = client.put('/api/user/signin/',json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_user_status(self):
        client = Client()
        response = client.get('/api/user/status/')
        self.assertEqual(response.status_code, 401)
        client.post('/api/user/signin/',json.dumps(test_user), content_type='application/json')
        response = client.get('/api/user/status/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/user/status/')
        self.assertEqual(response.status_code, 405)

    def test_user_profile(self):
        client = Client()
        response = client.get('/api/user/profile/')
        self.assertEqual(response.status_code, 401)
        client.post('/api/user/signin/',json.dumps(test_user), content_type='application/json')
        response = client.get('/api/user/profile/')
        self.assertEqual(response.status_code, 200)
        response = client.put('/api/user/profile/',json.dumps({"password":"pw"}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/user/profile/')
        self.assertEqual(response.status_code, 405)

    def test_notification(self):
        client = Client()
        response = client.get('/api/user/1/notification/')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/user/signin/',json.dumps(test_user), content_type='application/json')
        # Setup : write 1 review, 1 comment
        # make Fridgeitem.
        FridgeItem.objects.create(user_id=1, food_id=1)
        rid = json.loads(client.post('/api/recipe/1/review/', json.dumps(rev),
                                     content_type='applications/json').content)['id']
        client.post(f'/api/review/{rid}/comment/', json.dumps(rev), content_type='applications/json')
        response = client.get(f'/api/user/1/notification/')
        self.assertEqual(response.status_code, 200)
        response = client.delete(f'/api/user/1/notification/')
        self.assertEqual(response.status_code, 405)