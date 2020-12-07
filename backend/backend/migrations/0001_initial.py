# Generated by Django 3.1.2 on 2020-12-06 14:33

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=80)),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=80)),
                ('ingredient_lines', django.contrib.postgres.fields.ArrayField(base_field=models.TextField(blank=True, default=''), blank=True, default=list, size=None)),
                ('content', models.TextField(default='')),
                ('rating', models.FloatField(default=0.0)),
                ('count_ratings', models.IntegerField(default=0)),
                ('diet_labels', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=15), blank=True, default=list, size=None)),
                ('health_labels', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=20), blank=True, default=list, size=None)),
                ('calories', models.IntegerField(default=0)),
                ('cooking_time', models.IntegerField(default=0)),
                ('serving', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='SearchSetting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('diet_labels', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=15), blank=True, default=list, size=None)),
                ('health_labels', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=20), blank=True, default=list, size=None)),
                ('calories', models.IntegerField(default=0)),
                ('cooking_time', models.IntegerField(default=0)),
                ('rating', models.FloatField(default=0.0)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author_name', models.CharField(blank=True, default='', max_length=80, null=True)),
                ('title', models.CharField(max_length=80)),
                ('content', models.TextField(default='')),
                ('likes', models.IntegerField(default=0)),
                ('dislikes', models.IntegerField(default=0)),
                ('reports', models.IntegerField(default=0)),
                ('time_posted', models.DateTimeField(auto_now_add=True, null=True)),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='review_recipe_id', to='backend.recipe')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='review_user_id', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='IngredientIncidence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=0)),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ingredientincidence_ingrdient', to='backend.ingredient')),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ingredientincidence_recipe_id', to='backend.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='FridgeItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=80)),
                ('quantity', models.IntegerField(default=0)),
                ('unit', models.CharField(blank=True, default='', max_length=10)),
                ('expiry_date', models.DateTimeField(auto_now_add=True)),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fridgeitem_ingrdient', to='backend.ingredient')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fridgeitem_user_id', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author_name', models.CharField(blank=True, default='', max_length=80, null=True)),
                ('content', models.TextField(default='')),
                ('likes', models.IntegerField(default=0)),
                ('dislikes', models.IntegerField(default=0)),
                ('reports', models.IntegerField(default=0)),
                ('time_posted', models.DateTimeField(auto_now_add=True, null=True)),
                ('review', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_review_id', to='backend.review')),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='comment_user_id', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
