import json
from django.contrib.auth.models import User
from django.test import TestCase, Client
from backend.models import Recipe
from .data_for_testing import test_recipe_rating as rtest, test_recipe_rating_wrong as rtestf
class RecipeTestCase(TestCase):
    fixtures = ['test_db.json',]
    def test_article_list(self):
        client = Client()
        response = client.get('/api/recipe/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/recipe/')
        self.assertEqual(response.status_code, 405)


    def test_article_by_id(self):
        client = Client()
        response = client.get('/api/recipe/1/')
        self.assertEqual(response.status_code, 200)

        # No such recipe
        response = client.get('/api/recipe/999999999/')
        self.assertEqual(response.status_code, 404)
        response = client.put('/api/recipe/999999999/', json.dumps(rtest), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # PUT rating...
        response = client.put('/api/recipe/1/', json.dumps(rtest), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Wrong JSON
        response = client.put('/api/recipe/999999999/', json.dumps(rtestf), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/api/recipe/1/', json.dumps(rtestf), content_type='application/json')
        self.assertEqual(response.status_code, 405)


