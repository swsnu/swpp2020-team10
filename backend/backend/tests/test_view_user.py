import json
from django.test import TestCase, Client
from .data_for_testing import test_user

class UserTestCase(TestCase):
    def test_user_signup(self):
        client = Client()
        response = client.post('/api/user/signup/', json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 201)
