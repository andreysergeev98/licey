# Generated by Django 3.2.3 on 2021-05-24 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0004_story_headline'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='banner',
            field=models.ImageField(upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='story',
            name='stories',
            field=models.ImageField(upload_to='images/'),
        ),
    ]
