import json
from django.test import TestCase, Client
from .data_for_testing import test_food_data_1, test_fridge_item_1, test_user, test_post_fridge_item

class FoodTestCase(TestCase):
    fixtures = ['test_db.json',]
    
    def test_manage_food(self):
        client = Client()
        response = client.get('/api/food/')
        self.assertEqual(response.status_code, 200)

    def test_manage_fridge_get(self):
        client = Client()
        response = client.get('/api/fridge/1/user/')
        self.assertEqual(response.status_code, 200)

    def test_manage_fridge_login(self):
        client = Client()
        client.post('/api/user/signup/', json.dumps(test_user), content_type='applications/json')
        response = client.post('/api/user/signin/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.post('/api/fridge/1/user/', json.dumps(test_fridge_item_1), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        new_id = response.content['id']
        # POST invalid data: should return 400
        response = client.post('/api/fridge/1/user/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 400)
        # DELETE is invalid action: should return 405
        response = client.delete('/api/fridge/1/user/')
        self.assertEqual(response.status_code, 405)

        # Now modify fridgeItem
        response = client.put('/api/fridge/item/{new_id}/', json.dumps(test_post_fridge_item), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content['quantity'], 150)
        response = client.put('/api/fridge/item/{new_id}/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 400)

        # You cannot post to this url
        response = client.post('/api/fridge/item/{new_id}/', json.dumps(test_post_fridge_item), content_type='applications/json')
        self.assertEqual(response.status_code, 405)
        
        # Delete the new fridgeItem
        response = client.delete('/api/fridge/item/{new_id}/')
        self.assertEqual(response.status_code, 200)


    def test_fridge_by_id_get(self):
        client = Client()
        response = client.get('api/fridge/item/1/')
        self.assertEqual(response.status_code, 200)

    """def test_fridge_by_id_put(self):
        # need to log in first
        client = Client()"""