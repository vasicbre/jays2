import uuid
import os

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
    PermissionsMixin
from django.conf import settings
from django.utils.timezone import now


def thing_image_file_path(instance, filename):
    """Generate file path for new thing image"""
    # ext = filename.split('.')[-1]
    # filename = f'{uuid.uuid4()}.{ext}'

    # return os.path.join('uploads/thing/', filename)
    filename_base, filename_ext = os.path.splitext(filename)
    return 'posts/%s/%s' % (
        now().strftime("%Y%m%d"),
        instance.id
    )


class UserManager(BaseUserManager):

    def create_user(self, email, password, **kwargs):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self.db)
        user_profile = UserProfile(user=user)
        user_profile.save(using=self.db)
        return user

    def create_superuser(self, email, password, **kwargs):
        """Creates and saves a new super user"""
        user = self.create_user(email, password, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self.db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()
    USERNAME_FIELD = 'email'


class UserProfile(models.Model):
    """User profile details"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE)
    date_of_birth = models.DateField(null=True)
    region = models.CharField(null=True, max_length=255)
    bio = models.TextField(null=True, max_length=1000, default="")
    reputation = models.IntegerField(default=0)
    phone = models.CharField(max_length=15, null=True)
    # TODO: add location and profile pic

    class UserType(models.IntegerChoices):
        REGULAR = 1
        BUSINESS = 2
        INTERNAL = 3

    user_type = models.IntegerField(
        choices=UserType.choices,
        default=UserType.REGULAR)


class TagManager(models.Manager):

    def create(self, name, **kwargs):
        tag, _ = self.get_or_create(name=name.lower())
        return tag


class Tag(models.Model):
    """Tag of the thing"""
    name = models.CharField(max_length=30, unique=True)

    objects = TagManager()

    def __str__(self):
        return self.name


class Thing(models.Model):
    """Things for donating"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=30)
    tags = models.ManyToManyField('Tag')
    description = models.TextField(max_length=500)
    image = models.ImageField(null=True, upload_to=thing_image_file_path)

    def __str__(self):
        return self.title


class Photo(models.Model):
    uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100)
    photo = models.FileField()
