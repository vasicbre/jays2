from django.urls import path, include
from rest_framework.routers import DefaultRouter

from thing import views


router = DefaultRouter()
router.register('tags', views.TagViewSet)

app_name = 'thing'

urlpatterns = [
    path('', include(router.urls))
]
