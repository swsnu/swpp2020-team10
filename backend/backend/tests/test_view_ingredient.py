import json
from django.test import TestCase, Client

class IngredientTestCase(TestCase):
    def test_ingredient(self):
        client = Client()

        response = client.get('/api/ingredient/')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/ingredient/?q=kimchi')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/ingredient/?q=kimchi', json.dumps('\{\}'), content_type='application/json')
        self.assertEqual(response.status_code, 405)
