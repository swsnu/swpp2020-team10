import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from backend.models import SearchSetting

class SearchTestCase(TestCase):
    def test_search_nologin(self):
        client = Client()

        response = client.get('/api/search/?from=0&to=10')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/search/?q=kimchi&from=0&to=10')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/search/?q=kimchi&time=30&calorie=800&rating=4.0&from=10&to=20')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/search/?q=kimchi&from=0&to=10&sort=time')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/search/?q=kimchi&from=0&to=10&sort=calorie')
        self.assertEqual(response.status_code, 200)

        response = client.get('/api/search/?q=kimchi&from=0&to=10&sort=rating')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/search/?q=kimchi', json.dumps('\{\}'), content_type='application/json')
        self.assertEqual(response.status_code, 405)

