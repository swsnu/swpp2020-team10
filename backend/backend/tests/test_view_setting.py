import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from backend.models import SearchSetting
from .data_for_testing import test_user, test_search_setting

class SettingTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(username=test_user['username'], password=test_user['password'], email=test_user['email'])
        user = User.objects.get(username=test_user['username'])
        SearchSetting.objects.create(user=user)
        
    def test_setting_nologin(self):
        client = Client()
        
        response = client.get('/api/user/setting/')
        self.assertEqual(response.status_code, 401)

        response = client.put('/api/user/setting/', json.dumps(test_search_setting), content_type='applications/json')
        self.assertEqual(response.status_code, 401)

        response = client.get('/api/user/setting/')
        self.assertEqual(response.status_code, 401)
    
    def test_setting_login(self):
        client = Client()
        client.login(username=test_user['username'], password=test_user['password'])

        response = client.get('/api/user/setting/')
        self.assertEqual(response.status_code, 200)

        response = client.put('/api/user/setting/', json.dumps(test_search_setting), content_type='applications/json')
        self.assertEqual(response.status_code, 201)

        response = client.get('/api/user/setting/')
        self.assertEqual(response.status_code, 200)

        response = client.post('/api/user/setting/', json.dumps(test_search_setting), content_type='applications/json')
        self.assertEqual(response.status_code, 405)