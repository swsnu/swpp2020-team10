import json
from django.test import TestCase, Client
from backend.models import FridgeItem
from .data_for_testing import (test_user,test_post_fridge_item_1,
    test_post_fridge_item_2, test_empty_fridge_item)

class FoodTestCase(TestCase):
    fixtures = ['test_db.json',]

    def setUp(self):
        FridgeItem.objects.create(user_id=1, food_id=1)

    def test_manage_food(self):
        client = Client()
        response = client.get('/api/food/')
        self.assertEqual(response.status_code, 200)
        # Invalid request to food: should get 405
        response = client.delete('/api/food/')
        self.assertEqual(response.status_code, 405)

    def test_manage_fridge_get(self):
        client = Client()
        response = client.get('/api/fridge/1/user/')
        self.assertEqual(response.status_code, 200)
        # not logged in: should get 401 for put
        response = client.put('/api/fridge/item/1/', json.dumps(test_post_fridge_item_2),
            content_type='applications/json')
        self.assertEqual(response.status_code, 401)
        # get from nonexistent fridgeItem: should get 404
        response = client.get('/api/fridge/item/2/')
        self.assertEqual(response.status_code, 404)

    def test_manage_fridge_login(self):
        client = Client()
        client.post('/api/user/signup/', json.dumps(test_user),
            content_type='applications/json')
        response = client.post('/api/user/signin/', json.dumps(test_user),
            content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        user_id = json.loads(response.content)['user_id']
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
        self.assertEqual(json.loads(response.content)['quantity'], 150)
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/fridge/item/{new_id}/',
            json.dumps(test_post_fridge_item_2), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['quantity'], 100)
        response = client.put(f'/api/fridge/item/{new_id}/',
            json.dumps(test_empty_fridge_item), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['quantity'], 100)
        response = client.put(f'/api/fridge/item/{new_id-1}/',
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
