import json
from django.test import TestCase, Client
from ..models import *
from .data_for_testing import (test_user,
    test_post_fridge_item_2, t_data)

class FoodTestCase(TestCase):
    def setUp(self):
        self.t_data = t_data()

    def test_manage_fridge_get(self):
        item_id = self.t_data.item_id
        user_id = self.t_data.user_id
        client = Client()
        # not logged in: should get 401 for put
        response = client.put(f'/api/fridge/item/{item_id}/', json.dumps(test_post_fridge_item_2),
                              content_type='application/json')
        self.assertEqual(response.status_code, 401)

        client.login(username=test_user['username'], password=test_user['password'])
        response = client.get(f'/api/fridge/{user_id}/user/')
        self.assertEqual(response.status_code, 200)

        # get from nonexistent fridgeItem: should get 404
        response = client.get(f'/api/fridge/item/{item_id+1182}/')
        self.assertEqual(response.status_code, 404)

    def test_manage_fridge_login(self):
        item_id = self.t_data.item_id
        user_id = self.t_data.user_id
        client = Client()
        client.post('/api/user/signup/', json.dumps(test_user),
            content_type='applications/json')
        response = client.post('/api/user/signin/', json.dumps(test_user),
            content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        user_id = json.loads(response.content)['user_id']
        test_post_fridge_item_1 = {
            "ingredient_id": self.t_data.ingredient.id,
            "name": "fit1",
            "quantity": 100,
            "expiry_date": "2020-4-23",
            "unit" : 'g'
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
        # PUT is invalid action: should return 405
        response = client.put(f'/api/fridge/{user_id}/user/',
            json.dumps(test_post_fridge_item_2), content_type='applications/json')
        self.assertEqual(response.status_code, 405)

        # Now get & modify fridgeItem
        response = client.get(f'/api/fridge/item/{new_id}/')
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/fridge/item/{new_id}/',
            json.dumps(test_post_fridge_item_1), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        test_empty_fridge_item = {
            "ingredient_id": self.t_data.ingredient.id,
            "name": None,
            "expiry_date": None,
            "unit" : None,
            "quantity" : None,
        }
        response = client.put(f'/api/fridge/item/{new_id}/',
            json.dumps(test_empty_fridge_item), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/fridge/item/{new_id}/',
                              json.dumps(test_post_fridge_item_1), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/fridge/item/{self.t_data.second_item.id}/',
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

        # Clear fridgeItems of users
        response = client.delete(f'/api/fridge/{user_id}/user/')
        self.assertEqual(response.status_code, 200)
