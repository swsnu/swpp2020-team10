import json
from django.test import TestCase, Client
from .data_for_testing import test_review_write as rev, test_user, test_review_give_report, test_user_2
from ..models import User, Recipe, Food, FridgeItem, Review

class UserTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username=test_user['username'], password=test_user['password'])
        client = Client()
        response = client.post('/api/user/signup/', json.dumps(test_user), content_type='application/json')
        self.food = Food.objects.create(name='food')
        self.second_user = User.objects.create_user(username="some-other-user", password='password')
        self.recipe = Recipe.objects.create(food=self.food, title="plz kill me")
        self.review = Review.objects.create(recipe=self.recipe, user=self.user, title="title", content="content")
        self.revid = self.review.id
        self.fridgeItem = FridgeItem.objects.create(user=self.user, food=self.food)
        self.second_item = FridgeItem.objects.create(user=self.second_user, food=self.food)
        self.item_id = self.fridgeItem.id
        self.user_id = self.user.id

    def test_user_signup(self):
        client = Client()
        response = client.post('/api/user/signup/', json.dumps(test_user_2), content_type='application/json')
        self.assertEqual(response.status_code, 201)
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
        response = client.post(f'/api/review/{self.revid}/comment/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 201)
        FridgeItem.objects.create(user=self.user, food=self.food)
        rid = json.loads(client.post(f'/api/recipe/{self.recipe.id}/review/', json.dumps(rev),
                                     content_type='applications/json').content)['id']
        client.post(f'/api/review/{rid}/comment/', json.dumps(rev), content_type='applications/json')
        response = client.get(f'/api/user/{self.user_id}/notification/')
        self.assertEqual(response.status_code, 200)
        response = client.delete(f'/api/user/{self.user_id}/notification/')
        self.assertEqual(response.status_code, 405)