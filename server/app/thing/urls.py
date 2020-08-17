from django.urls import path, include
from rest_framework.routers import DefaultRouter

from thing import views


router = DefaultRouter()
router.register('tags', views.TagViewSet)
router.register('things', views.ThingViewSet)

app_name = 'thing'

urlpatterns = [
    path('', include(router.urls)),
    path('hello/', views.hello, name='hello'),
]
