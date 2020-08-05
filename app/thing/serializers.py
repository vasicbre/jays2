from rest_framework import serializers

from core.models import Tag, Thing


class TagSerializer(serializers.ModelSerializer):
    """Serializer for tag objects"""

    class Meta:
        model = Tag
        fields = ('id', 'name')
        read_only_fields = ('id',)


class ThingSerializer(serializers.ModelSerializer):
    """Serializer for thing objects"""

    tags = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all()
    )

    class Meta:
        model = Thing
        fields = ('id', 'title', 'tags', 'description')
        read_only_fields = ('id',)
