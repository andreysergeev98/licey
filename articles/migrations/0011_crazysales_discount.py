# Generated by Django 3.2.3 on 2021-05-25 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0010_crazysales'),
    ]

    operations = [
        migrations.AddField(
            model_name='crazysales',
            name='discount',
            field=models.CharField(default=0, max_length=200),
            preserve_default=False,
        ),
    ]
