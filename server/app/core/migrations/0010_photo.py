# Generated by Django 3.0.9 on 2020-08-19 19:01

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_thing_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(max_length=100)),
                ('photo', models.FileField(upload_to='')),
            ],
        ),
    ]
