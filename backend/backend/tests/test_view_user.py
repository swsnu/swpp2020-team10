import json
from django.test import TestCase, Client
from .data_for_testing import test_review_write as rev, test_user, test_user_2, t_data
from backend.models import User, Recipe, FridgeItem, Review

class UserTestCase(TestCase):
    def setUp(self):
        test_user_3 = {
            "username" : "unit-tester-3",
            "password" : "p3141592",
            "email" : "email@email.com"
        }
        client = Client()
        response = client.post('/api/user/signup/', json.dumps(test_user_3), content_type='application/json')
        self.t_data = t_data()

    def test_user_signup(self):
        client = Client()
        response = client.post('/api/user/signup/', json.dumps(test_user_2), content_type='application/json')
        self.assertEqual(response.status_code, 409)
        response = client.put('/api/user/signup/', json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = client.post('/api/user/signup/', json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 409)

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
        self.assertEqual(response.status_code, 200)
        response = client.put('/api/user/signin/',json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = client.post('/api/user/signin/',json.dumps({'username':'asd','password':'apasd'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)

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
        response = client.post(f'/api/review/{self.t_data.revid}/comment/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 201)
        FridgeItem.objects.create(user=self.t_data.user, ingredient=self.t_data.ingredient)
        rid = json.loads(client.post(f'/api/recipe/{self.t_data.recipe.id}/review/', json.dumps(rev),
                                     content_type='applications/json').content)['id']
        client.post(f'/api/review/{rid}/comment/', json.dumps(rev), content_type='applications/json')
        response = client.get(f'/api/user/{self.t_data.user_id}/notification/')
        self.assertEqual(response.status_code, 200)
        response = client.delete(f'/api/user/{self.t_data.user_id}/notification/')
        self.assertEqual(response.status_code, 405)