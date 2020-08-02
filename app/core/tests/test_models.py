from django.test import TestCase
from django.contrib.auth import get_user_model

import datetime


class ModelTests(TestCase):

    def setUp(self):
        self.test_user_dict = {
            'name': 'Nemanja',
            'date_of_birth': datetime.datetime(1992, 10, 27),
            'region': 'Serbia',
            'bio': 'This is a test user account',
            'user_type': get_user_model().UserType.REGULAR,
        }
        self.test_user_email = 'test@test.com'
        self.test_user_pass = 'testpass123'

    def create_user(self):
        user = get_user_model().objects.create_user(
            email=self.test_user_email,
            password=self.test_user_pass,
            **self.test_user_dict
        )
        return user

    def test_create_user_with_email_successfully(self):
        "Test creating a new user with an email is successfull"
        user = self.create_user()

        self.assertEqual(user.email, self.test_user_email)
        self.assertTrue(user.check_password(self.test_user_pass))
        self.assertEqual(user.name, self.test_user_dict['name'])
        self.assertEqual(user.date_of_birth,
                         self.test_user_dict['date_of_birth'])
        self.assertEqual(user.region, self.test_user_dict['region'])
        self.assertEqual(user.bio, self.test_user_dict['bio'])
        self.assertEqual(user.user_type, self.test_user_dict['user_type'])

    def test_new_user_email_normalized(self):
        """Test the email for a new user is normalized"""
        email = 'test@TEST.com'
        user = get_user_model().objects.create_user(
            email=email,
            password=self.test_user_pass,
            **self.test_user_dict
        )

        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """Test creating user with no email raises error"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                email=None,
                password=self.test_user_pass,
                **self.test_user_dict
            )

    def test_create_new_superuser(self):
        """Test creating a new superuser"""
        user = get_user_model().objects.create_superuser(
            email=self.test_user_email,
            password=self.test_user_pass,
            **self.test_user_dict
        )

        self.assertTrue(user.is_superuser)
