# Generated by Django 3.0.9 on 2020-08-25 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_auto_20200825_1631'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='user_type',
            field=models.IntegerField(choices=[(1, 'Regular'), (2, 'Business'), (3, 'Internal')], default=1),
        ),
    ]
