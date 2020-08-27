from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Tag, Thing
from thing import serializers

from django.http import JsonResponse


def hello(request):
    return JsonResponse({'response_text': 'hello world!!!'})


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
        existing = bool(
            int(self.request.query_params.get('existing', 0))
        )
        queryset = self.queryset
        if existing:
            queryset = queryset.filter(thing__isnull=False)

        return queryset.order_by('-name').distinct()

    def perform_create(self, serializer):
        """Create a new tag"""
        serializer.save()


class ThingViewSet(viewsets.ModelViewSet):
    """Manage things in the db"""
    serializer_class = serializers.ThingSerializer
    queryset = Thing.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def _params_to_ints(self, qs):
        """Convert a list of string IDs to a list of integers"""
        return [int(str_id) for str_id in qs.split(',')]

    def get_queryset(self):
        """Retrieve things for the authenticated user"""
        tags = self.request.query_params.get('tags')
        queryset = self.queryset
        if tags:
            tag_ids = self._params_to_ints(tags)
            queryset = queryset.filter(tags__id__in=tag_ids)

        return queryset.filter(user=self.request.user)

    def get_serializer_class(self):
        """Return appropriate serializer class"""
        if self.action == 'retrieve':
            return serializers.ThingDetailSerializer
        elif self.action == 'upload_image':
            return serializers.ThingImageSerializer

        return serializers.ThingSerializer

    def perform_create(self, serializer):
        """Create a new thing"""
        serializer.save(user=self.request.user)

    # @action(methods=['POST'], detail=True, url_path='upload-image')
    # def upload_image(self, request, pk=None):
    #     """Upload an image to a recipe"""
    #     thing = self.get_object()
    #     serializer = self.get_serializer(
    #         thing,
    #         data=request.data
    #     )

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(
    #             serializer.data,
    #             status=status.HTTP_200_OK
    #         )

    #     return Response(
    #         serializer.errors,
    #         status=status.HTTP_400_BAD_REQUEST
    #     )
