# Generated by Django 4.0.2 on 2022-02-17 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_recipe_category_choice'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='recipe_image',
            field=models.ImageField(blank=True, null=True, upload_to='media/%Y/%m/%D'),
        ),
    ]
