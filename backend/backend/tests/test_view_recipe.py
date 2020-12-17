import json
from django.test import TestCase, Client
from .data_for_testing import test_recipe_rating as rtest, test_recipe_rating_wrong as rtestf, test_user, t_data


class RecipeTestCase(TestCase):
    def setUp(self):
        self.t_data = t_data()

    def test_recipe_list(self):
        client = Client()
        response = client.get('/api/recipe/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/recipe/')
        self.assertEqual(response.status_code, 405)


    def test_recipe_by_id(self):
        FIRST_RECIPE_URL = f'/api/recipe/{self.t_data.recipe.id}/'
        WRONG_RECIPE_URL = '/api/recipe/999999999/'
        client = Client()
        response = client.put(WRONG_RECIPE_URL, json.dumps(rtest), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/user/signin/', json.dumps(test_user), content_type='applications/json')
        response = client.get(FIRST_RECIPE_URL)
        self.assertEqual(response.status_code, 200)

        # No such recipe
        response = client.get(WRONG_RECIPE_URL)
        self.assertEqual(response.status_code, 404)
        response = client.put(WRONG_RECIPE_URL, json.dumps(rtest), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # PUT rating...
        response = client.put(FIRST_RECIPE_URL, json.dumps(rtest), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(FIRST_RECIPE_URL, json.dumps(rtest), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Wrong JSON
        response = client.put(WRONG_RECIPE_URL, json.dumps(rtestf), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post(FIRST_RECIPE_URL, json.dumps(rtestf), content_type='application/json')
        self.assertEqual(response.status_code, 405)
