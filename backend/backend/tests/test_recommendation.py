import json
from django.test import TestCase, Client
from ..models import *
from .data_for_testing import (test_user, test_user_2,
                               test_post_fridge_item_2, t_data)

REC_URL = "/api/recommendation/"
REC_REAC_URL = "/api/recommendation/reaction/"
class RecommendationTestCase(TestCase):
    def setUp(self):
        self.t_data = t_data()
    def test_recommendation_user1(self):
        client = Client()
        response = client.delete(REC_URL)
        self.assertEqual(response.status_code, 405)
        response = client.get(REC_URL)
        self.assertEqual(response.status_code, 200)
        response = client.post('/api/user/signin/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.get(REC_URL)
        self.assertEqual(response.status_code, 200)

    def test_recommendation_user2(self):
        client = Client()
        client.post('/api/user/signin/', json.dumps(test_user_2), content_type='applications/json')
        response = client.get(REC_URL)
        self.assertEqual(response.status_code, 200)

    def test_recommendation_reaction(self):
        client = Client()
        reaction_1 = {
            "recipe_id" : self.t_data.r1.id,
            "reaction" : 1
        }
        reaction_2 = {
            "recipe_id" : self.t_data.r4.id,
            "reaction" : -1
        }
        response = client.post(REC_REAC_URL, json.dumps(reaction_2), content_type='applications/json')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/user/signin/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.post(REC_REAC_URL, json.dumps(reaction_1), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.post(REC_REAC_URL, json.dumps(reaction_2), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(REC_REAC_URL, json.dumps(reaction_2), content_type='applications/json')
        self.assertEqual(response.status_code, 405)