import json
from django.test import TestCase, Client
from .data_for_testing import test_recipe_rating as rtest, test_recipe_rating_wrong as rtestf, test_user
from ..models import *


class RecipeTestCase(TestCase):
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

    def test_recipe_list(self):
        client = Client()
        response = client.get('/api/recipe/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/api/recipe/')
        self.assertEqual(response.status_code, 405)


    def test_recipe_by_id(self):
        FIRST_RECIPE_URL = f'/api/recipe/{self.recipe.id}/'
        WRONG_RECIPE_URL = '/api/recipe/999999999/'
        client = Client()
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

        # Wrong JSON
        response = client.put(WRONG_RECIPE_URL, json.dumps(rtestf), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post(FIRST_RECIPE_URL, json.dumps(rtestf), content_type='application/json')
        self.assertEqual(response.status_code, 405)
