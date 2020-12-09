'''
insert ingredient model instances from csv file
input: ingredient_model.csv

insert recipe model instances and ingredients from csv file
input: ingredient_lines.csv, ingredients.json
'''

import os, django, json
from backend.models import Ingredient, IngredientIncidence, Recipe

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def strip_newline(line):
    return line[:-1]

def run():
    ingredient_set = set()      # set of ingredient name
    ingredient_line_list = []   # list of ingredient lines
    ingredient_model_list = []  # list of nlp ingredient models
    step_dict = {}              # recipe title -> recipe steps(content)
    
    with open('./scripts/data/ingredient_lines.csv', 'r') as open_file:
        lines = open_file.readlines()
        ingredient_line_list = list(map(strip_newline, lines))

    with open('./scripts/data/ingredients.csv', 'r') as open_file:
        lines = open_file.readlines()
        ingredient_model_list = list(map(strip_newline, lines))

    with open('./scripts/data/steps.csv', 'r') as open_file:
        lines = open_file.readlines()
        for line in lines:
            line_json = json.loads(line)
            title = line_json.get('title')
            steps = line_json.get('steps')
            step_dict[title] = steps

    with open('./scripts/data/recipes.csv', 'r') as open_file:
        lines = open_file.readlines()
        recipes = list(map(strip_newline, lines))
        recipe_jsons = list(map(json.loads, recipes))

    for recipe in recipe_jsons:
        ingredient_instances = []
        ## insert ingredients
        ingredients = recipe.get('ingredients')
        for ing in ingredients:
            text = ing.get('text')
            index = ingredient_line_list.index(text)
            ing_model = json.loads(ingredient_model_list[index])
            name = ing_model.get('ingredient')

            if name not in ingredient_set:
                image = ing.get('image')
                ing_item = Ingredient(name=name, image=image)
                ing_item.save()
                ingredient_set.add(name)
                ingredient_instances.append(ing_item)
            else:
                ing_item = Ingredient.objects.get(name=name)
                ingredient_instances.append(ing_item)

        title = recipe.get('label')
        ingredient_lines = recipe.get('ingredientLines')
        content = step_dict[title]
        image = recipe.get('img')
        diet_labels = recipe.get('dietLabels')
        health_labels = recipe.get('healthLabels')
        calories = int(recipe.get('calories'))
        cooking_time = int(recipe.get('totalTime'))
        serving = int(recipe.get('yield'))

        recipe = Recipe(title=title, ingredient_lines=ingredient_lines, content=content,
                        image=image, diet_labels=diet_labels, health_labels=health_labels,
                        calories=calories, cooking_time=cooking_time, serving=serving)
        recipe.save()

        for ing in ingredient_instances:
            IngredientIncidence.objects.create(ingredient=ing, recipe=recipe)
