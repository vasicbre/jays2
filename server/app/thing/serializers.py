from rest_framework import serializers

from core.models import Tag, Thing

import logging


# Get an instance of a logger
logger = logging.getLogger(__name__)


class TagSerializer(serializers.ModelSerializer):
    """Serializer for tag objects"""

    class Meta:
        model = Tag
        fields = ('id', 'name')
        read_only_fields = ('id',)
        extra_kwargs = {
            'name': {'validators': []},
        }


class ThingSerializer(serializers.ModelSerializer):
    """Serializer for thing objects"""

    tags = TagSerializer(many=True)

    class Meta:
        model = Thing
        fields = ('id', 'title', 'tags', 'description', 'image')
        read_only_fields = ('id',)

    def create(self, validated_data):
        tag_data = validated_data.pop('tags')
        thing = Thing.objects.create(**validated_data)
        for tag in tag_data:
            tag_obj = Tag.objects.filter(name=tag['name']).first()
            if not tag_obj:
                tag_obj = Tag.objects.create(**tag)
            thing.tags.add(tag_obj)
        return thing


class ThingDetailSerializer(ThingSerializer):
    """Serialize a thing detail"""
    tags = TagSerializer(many=True, read_only=True)


class ThingImageSerializer(serializers.ModelSerializer):
    """Serializer for uploading images to things"""

    class Meta:
        model = Thing
        fields = ('id', 'image')
        read_only_fields = ('id',)
