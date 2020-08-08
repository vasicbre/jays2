from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Thing, Tag

from thing.serializers import ThingSerializer, ThingDetailSerializer


THINGS_URL = reverse('thing:thing-list')


def detail_thing_url(thing_id):
    """Return thing detail url"""
    return reverse('thing:thing-detail', args=[thing_id])


def sample_tag(name='book'):
    """Create and return sample tag"""
    return Tag.objects.create(name)


def sample_thing(user, **params):
    """Create and return a sample thing"""
    defaults = {
        'title': 'Hobbit',
        'description': 'Awesome book'
    }
    defaults.update(params)

    return Thing.objects.create(user=user, **defaults)


class PublicThingApiTests(TestCase):
    """Test unauthenticated thing API access"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Tets that authentication is required"""
        res = self.client.get(THINGS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateThingApiTests(TestCase):
    """Test authenticated thing API access"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email='test@test.com',
            password='testpass'
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_things(self):
        """Test retrieving a list of things"""
        sample_thing(user=self.user)
        sample_thing(user=self.user, **{'title': 'Title2'})

        res = self.client.get(THINGS_URL)

        things = Thing.objects.all()
        serializer = ThingSerializer(things, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_things_limited_to_user(self):
        """Test retrieving things for user"""
        user2 = get_user_model().objects.create_user(
            email='user2@test.com',
            password='testpass'
        )
        sample_thing(user=user2)
        sample_thing(user=self.user)

        res = self.client.get(THINGS_URL)

        things = Thing.objects.filter(user=self.user)
        serializer = ThingSerializer(things, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data, serializer.data)

    def test_view_thing_detail(self):
        """Test viewing a thing detail"""
        thing = sample_thing(user=self.user)
        thing.tags.add(sample_tag())

        url = detail_thing_url(thing.id)
        res = self.client.get(url)

        serializer = ThingDetailSerializer(thing)
        self.assertEqual(res.data, serializer.data)
