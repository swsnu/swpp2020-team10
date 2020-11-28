import json
from django.test import TestCase, Client
from ..models import *
from .data_for_testing import (test_user,
    test_post_fridge_item_2, test_empty_fridge_item)

class FoodTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username=test_user['username'], password=test_user['password'])
        self.second_user = User.objects.create_user(username="some-other-user", password='password')
        self.food = Food.objects.create(name='food_name')
        self.recipe = Recipe.objects.create(food=self.food, title="plz kill me")
        self.review = Review.objects.create(recipe=self.recipe, user=self.user, title="title", content="content")
        self.revid = self.review.id
        self.fridgeItem = FridgeItem.objects.create(user=self.user, food=self.food)
        self.second_item = FridgeItem.objects.create(user=self.second_user, food=self.food)
        self.item_id = self.fridgeItem.id
        self.user_id = self.user.id

    def test_manage_food(self):
        client = Client()
        response = client.get('/api/food/')
        self.assertEqual(response.status_code, 200)
        # Invalid request to food: should get 405
        response = client.delete('/api/food/')
        self.assertEqual(response.status_code, 405)

    def test_manage_fridge_get(self):
        client = Client()

        # not logged in: should get 401 for put
        response = client.put(f'/api/fridge/item/{self.item_id}/', json.dumps(test_post_fridge_item_2),
                              content_type='application/json')
        self.assertEqual(response.status_code, 401)

        client.login(username=test_user['username'], password=test_user['password'])
        response = client.get(f'/api/fridge/{self.user_id}/user/')
        self.assertEqual(response.status_code, 200)

        # get from nonexistent fridgeItem: should get 404
        response = client.get(f'/api/fridge/item/{self.item_id+1182}/')
        self.assertEqual(response.status_code, 404)

    def test_manage_fridge_login(self):
        client = Client()
        client.post('/api/user/signup/', json.dumps(test_user),
            content_type='applications/json')
        response = client.post('/api/user/signin/', json.dumps(test_user),
            content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        user_id = json.loads(response.content)['user_id']
        test_post_fridge_item_1 = {
            "user_id": self.user_id,
            "food_id": self.food.id,
            "name": "baechu",
            "quantity": 100,
            "expiry_date": 2020/4/23,
            "nutrition_facts": {
                "calories": "100",
                "sodium": "50",
            }
        }
        response = client.post(f'/api/fridge/{user_id}/user/', json.dumps(test_post_fridge_item_1),
            content_type='application/json')
        self.assertEqual(response.status_code, 201)
        new_id = json.loads(response.content)['id']
        response = client.get(f'/api/fridge/{user_id}/user/')
        self.assertEqual(response.status_code, 200)
        # POST invalid data: should return 400
        response = client.post(f'/api/fridge/{user_id}/user/', json.dumps(test_user),
            content_type='applications/json')
        self.assertEqual(response.status_code, 400)
        # DELETE is invalid action: should return 405
        response = client.delete(f'/api/fridge/{user_id}/user/')
        self.assertEqual(response.status_code, 405)

        # Now get & modify fridgeItem
        response = client.get(f'/api/fridge/item/{new_id}/')
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/fridge/item/{new_id}/',
            json.dumps(test_post_fridge_item_2), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['quantity'], 100)
        response = client.put(f'/api/fridge/item/{new_id}/',
            json.dumps(test_empty_fridge_item), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['quantity'], 100)
        response = client.put(f'/api/fridge/item/{self.second_item.id}/',
            json.dumps(test_post_fridge_item_2), content_type='applications/json')
        self.assertEqual(response.status_code, 403)
        response = client.put(f'/api/fridge/item/{new_id}/', json.dumps(test_user),
            content_type='applications/json')
        self.assertEqual(response.status_code, 400)

        # You cannot post to this url
        response = client.post(f'/api/fridge/item/{new_id}/',
            json.dumps(test_post_fridge_item_2), content_type='applications/json')
        self.assertEqual(response.status_code, 405)

        # Delete the new fridgeItem
        response = client.delete(f'/api/fridge/item/{new_id}/')
        self.assertEqual(response.status_code, 200)
