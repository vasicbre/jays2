from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Tag

from thing.serializers import TagSerializer


TAGS_URL = reverse('thing:tag-list')


class PublicTagsApiTests(TestCase):
    """Test publicly available tags API"""

    def setUp(self):
        self.client = APIClient()

    def test_login_required(self):
        """Test that login is required for retrieving tags"""
        res = self.client.get(TAGS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTagsApiTests(TestCase):
    """Test the authorized tags API"""

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            'test@test.com',
            'password123',
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_tags(self):
        """Test retrieving tags"""
        Tag.objects.create(name='books')
        Tag.objects.create(name='stuff')

        res = self.client.get(TAGS_URL)

        tags = Tag.objects.all().order_by('-name')
        serializer = TagSerializer(tags, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_tag_successful(self):
        """Test create a new tag"""
        payload = {'name': 'TestTag'}
        self.client.post(TAGS_URL, payload)

        exists = Tag.objects.filter(
            name=payload['name'].lower()
        )
        self.assertTrue(exists)

    def test_create_tag_invalid(self):
        """Test creating a new tag with invalid payload"""
        payload = {'name': ''}
        res = self.client.post(TAGS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tag_with_existing_name(self):
        """Test creating duplicate tag"""
        payload = {'name': 'TestTag'}
        self.client.post(TAGS_URL, payload)
        self.client.post(TAGS_URL, payload)

        tags = Tag.objects.filter(
            name=payload['name'].lower()
        )
        self.assertEqual(tags.count(), 1)
