from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Tag, Thing

from thing import serializers


class TagViewSet(viewsets.GenericViewSet,
                 mixins.ListModelMixin,
                 mixins.CreateModelMixin):
    """Manage tags in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer

    def get_queryset(self):
        """Return ordered results"""
        return self.queryset.order_by('-name')

    def perform_create(self, serializer):
        """Create a new tag"""
        serializer.save()


class ThingViewSet(viewsets.ModelViewSet):
    """Manage things in the db"""
    serializer_class = serializers.ThingSerializer
    queryset = Thing.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Retrieve things for the authenticated user"""
        return self.queryset.filter(user=self.request.user)
