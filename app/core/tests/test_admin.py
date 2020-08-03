from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse

import datetime


class AdminSiteTests(TestCase):

    def setUp(self):
        # TODO: Move user creation to common file.
        self.test_user_dict = {
            'name': 'Nemanja',
            'date_of_birth': datetime.datetime(1992, 10, 27),
            'region': 'Serbia',
            'bio': 'This is a test user account',
            'user_type': get_user_model().UserType.REGULAR,
        }

        self.test_user_email = 'test@test.com'
        self.test_user_pass = 'testpass123'

        self.client = Client()
        self.admin_user = get_user_model().objects.create_superuser(
            email=self.test_user_email,
            password=self.test_user_pass,
            **self.test_user_dict
        )
        self.client.force_login(self.admin_user)
        self.user = get_user_model().objects.create_user(
            email='regularuser@test.com',
            password=self.test_user_pass,
            **self.test_user_dict
        )

    def test_users_listed(self):
        """Test that users are listed on user page"""
        url = reverse('admin:core_user_changelist')
        res = self.client.get(url)

        self.assertContains(res, self.user.name)
        self.assertContains(res, self.user.email)

    def test_user_change_page(self):
        """Test that user edit page works"""
        # url = /admin/core/user/<user_id>
        url = reverse('admin:core_user_change', args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)

    def test_create_user_page(self):
        """Test that create user page works"""
        url = reverse('admin:core_user_add')
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)
