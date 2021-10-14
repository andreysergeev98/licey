# Generated by Django 3.2.3 on 2021-05-24 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0008_auto_20210524_1751'),
    ]

    operations = [
        migrations.CreateModel(
            name='BigDiscount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pub_date', models.DateField()),
                ('headline', models.CharField(max_length=200)),
                ('banner', models.ImageField(upload_to='images/')),
                ('content', models.TextField()),
            ],
        ),
        migrations.RemoveField(
            model_name='story',
            name='content',
        ),
        migrations.AddField(
            model_name='story',
            name='stories',
            field=models.ImageField(default=0, upload_to='images/'),
            preserve_default=False,
        ),
    ]
