from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
    PermissionsMixin


class UserManager(BaseUserManager):

    def create_user(self, email, password, **kwargs):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self.db)
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
    date_of_birth = models.DateField()
    region = models.CharField(max_length=255)
    bio = models.TextField(max_length=1000, default="")
    reputation = models.IntegerField(default=0)
    is_staff = models.BooleanField(default=False)
    # TODO: add location and profile pic

    class UserType(models.IntegerChoices):
        REGULAR = 1
        BUSINESS = 2
        INTERNAL = 3

    user_type = models.IntegerField(choices=UserType.choices)

    objects = UserManager()

    USERNAME_FIELD = 'email'
