import json
from django.test import TestCase, Client
from .data_for_testing import test_review_write as rev, test_user, test_review_give_report
class ReviewTestCase(TestCase):
    fixtures = ['test_db.json',]
    def test_review_nologin(self):
        client = Client()
        response = client.get('/api/recipe/1/review/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/review/999999/')
        self.assertEqual(response.status_code, 404)
        response = client.get('/api/review/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/review/1/reaction/')
        self.assertEqual(response.status_code, 401)
        # No login errors
        response = client.put('/api/review/1/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = client.post('/api/recipe/1/review/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 401)


    def test_review_login(self):
        client = Client()
        client.post('/api/user/signup/', json.dumps(test_user), content_type='applications/json')
        response = client.post('/api/user/signin/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 200)
        response = client.get('/api/recipe/1/review/')
        self.assertEqual(response.status_code, 200)
        response = client.post('/api/recipe/1/review/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 201)
        wid = json.loads(response.content)['id']
        response = client.post('/api/recipe/1/review/', json.dumps(test_user), content_type='applications/json')
        self.assertEqual(response.status_code, 400)
        response = client.put('/api/recipe/1/review/', json.dumps(rev), content_type='applications/json')
        self.assertEqual(response.status_code, 405)

        response = client.put(f'/api/review/{wid}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.put(f'/api/review/{wid}/', json.dumps(test_user), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # You can't modify other's review
        response = client.put('/api/review/1/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 403)

        # There is no patch
        response = client.patch(f'/api/review/{wid}/', json.dumps(rev), content_type='application/json')
        self.assertEqual(response.status_code, 405)

        # Delete
        response = client.delete(f'/api/review/{wid}/')
        self.assertEqual(response.status_code, 200)

        # Rating
        response = client.get('/api/review/999999999/reaction/')
        self.assertEqual(response.status_code, 404)
        response = client.put('/api/review/1/reaction/', json.dumps(test_review_give_report),
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = client.post('/api/review/1/reaction/', json.dumps(test_review_give_report),
                               content_type='application/json')
        self.assertEqual(response.status_code, 405)
