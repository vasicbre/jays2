import tempfile
import os

from PIL import Image

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Thing, Tag

from thing.serializers import ThingSerializer, ThingDetailSerializer


THINGS_URL = reverse('thing:thing-list')


def image_upload_url(thing_id):
    """Return url from thing image upload"""
    return reverse('thing:thing-upload-image', args=[thing_id])


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
        sample_thing(user=self.user, **{'title': 'Title2'})
        sample_thing(user=self.user)

        res = self.client.get(THINGS_URL)

        things = Thing.objects.all().order_by('-id')
        serializer = ThingSerializer(things, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)
        self.assertEqual(serializer.data, res.data)

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

    def test_create_basic_thing(self):
        """Test creating thing"""
        payload = {
            'title': 'Book1',
            'description': 'Awesome book 1'
        }

        res = self.client.post(THINGS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        thing = Thing.objects.get(id=res.data['id'])
        for key in payload.keys():
            self.assertEqual(payload[key], getattr(thing, key))

    def test_create_thing_with_tags(self):
        """Test creating a thing with tags"""
        tag1 = sample_tag('book')
        tag2 = sample_tag('etf')

        payload = {
            'title': 'Book1',
            'description': 'Awesome book 1',
            'tags': [tag1.id, tag2.id],
        }
        res = self.client.post(THINGS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        thing = Thing.objects.get(id=res.data['id'])
        tags = thing.tags.all()
        self.assertEqual(tags.count(), 2)
        self.assertIn(tag1, tags)
        self.assertIn(tag2, tags)

    def test_partial_update_thing(self):
        """Test updating a thing with patch"""
        thing = sample_thing(user=self.user)
        thing.tags.add(sample_tag())

        new_tag = sample_tag(name='etf')

        payload = {
            'title': 'Book1',
            'tags': [new_tag.id],
        }

        url = detail_thing_url(thing.id)
        res = self.client.patch(url, payload)

        thing.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(thing.title, payload['title'])
        tags = thing.tags.all()
        self.assertEqual(len(tags), 1)
        self.assertIn(new_tag, tags)

    def test_full_update_thing(self):
        """Test updating a thing with put"""
        thing = sample_thing(user=self.user)
        thing.tags.add(sample_tag())

        payload = {
            'title': 'Book2',
            'description': 'asd'
        }

        url = detail_thing_url(thing.id)
        self.client.put(url, payload)

        thing.refresh_from_db()
        self.assertEqual(thing.title, payload['title'])
        tags = thing.tags.all()
        self.assertEqual(len(tags), 0)


class ThingImageUploadTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'test@test.com',
            'testpass'
        )
        self.client.force_authenticate(self.user)
        self.thing = sample_thing(user=self.user)

    def tearDown(self):
        self.thing.image.delete()

    def test_upload_image_to_thing(self):
        """Test uploading an image to thing"""
        url = image_upload_url(self.thing.id)
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            res = self.client.post(url, {'image': ntf}, format='multipart')

        self.thing.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('image', res.data)
        self.assertTrue(os.path.exists(self.thing.image.path))

    def test_upload_image_bad_request(self):
        """Test uploading an invalid image"""
        url = image_upload_url(self.thing.id)
        res = self.client.post(url, {'image': 'notimage'}, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
