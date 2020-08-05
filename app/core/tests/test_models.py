from django.test import TestCase
from django.contrib.auth import get_user_model
from core import models
import datetime


def sample_user(email='test@test.com', password='testpass'):
    """Create sample user"""
    return get_user_model().objects.create_user(email, password)


class ModelTests(TestCase):

    def setUp(self):
        self.test_user_email = 'test@test.com'
        self.test_user_pass = 'testpass123'
        self.test_user_name = 'Nemanja'

    def create_user(self):
        user = get_user_model().objects.create_user(
            email=self.test_user_email,
            password=self.test_user_pass,
            name=self.test_user_name
        )
        return user

    def test_create_user_with_email_successfully(self):
        "Test creating a new user with an email is successfull"
        user = self.create_user()

        self.assertEqual(user.email, self.test_user_email)
        self.assertTrue(user.check_password(self.test_user_pass))
        self.assertEqual(user.name, self.test_user_name)

    def test_new_user_email_normalized(self):
        """Test the email for a new user is normalized"""
        email = 'test@TEST.com'
        user = get_user_model().objects.create_user(
            email=email,
            password=self.test_user_pass,
            name=self.test_user_name
        )

        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """Test creating user with no email raises error"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                email=None,
                password=self.test_user_pass,
                name=self.test_user_name,
            )

    def test_create_new_superuser(self):
        """Test creating a new superuser"""
        user = get_user_model().objects.create_superuser(
            email=self.test_user_email,
            password=self.test_user_pass,
            name=self.test_user_name
        )

        self.assertTrue(user.is_superuser)

    def test_create_user_profile(self):
        """Test creating a user profile"""
        user_profile_dict = {
            'date_of_birth': datetime.datetime(1992, 10, 27),
            'region': 'Serbia',
            'bio': 'This is a test user account',
            'user_type': models.UserProfile.UserType.REGULAR,
        }

        user = get_user_model().objects.create_user(
            email=self.test_user_email,
            password=self.test_user_pass,
            name=self.test_user_name
        )

        user_profile = models.UserProfile.objects.create(user_id=user,
                                                         **user_profile_dict)

        self.assertEqual(user_profile.date_of_birth,
                         user_profile_dict['date_of_birth'])
        self.assertEqual(user_profile.region,
                         user_profile_dict['region'])
        self.assertEqual(user_profile.bio, user_profile_dict['bio'])
        self.assertEqual(user_profile.user_type,
                         user_profile_dict['user_type'])

    def test_tag_str(self):
        """Test tag str representation"""
        tag = models.Tag.objects.create(name='book')
        self.assertEqual(str(tag), tag.name)
