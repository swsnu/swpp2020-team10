from ..models import *

test_search_setting = {
    "diet_labels": ['balanced', 'high-fiber'],
    "health_labels": ['alcohol-free', 'immuno-supportive', 'celery-free', 'crustacean-free'],
    "calories": 800,
    "cooking_time": 5,
    "rating": 3
}
test_recipe_data_1 = {
    "id": 1,
    "food_id": 3,
    "title": "Kimchi",
    "content": "K-food Kimchi recipe",
    "rating": 5,
    "count_ratings": 1,
    "ingredients": {
        "cabbage": "100"
    },
    "diet_labels": [],
    "health_labels": [],
    "calories": 300,
    "cooking_time": 120,
    "serving": 1
}
test_recipe_rating = {
    "recipe_id" : 1,
    "rating" : 3
}
test_recipe_rating_wrong = {
    "score" : 1
}
test_user = {
    "username" : "unit-tester",
    "password" : "unit-tester-password",
    "email" : "unit-tester-email@snu.ac.kr"
}
test_user_2 = {
    "username" : "unit-tester-2",
    "password" : "p3141592",
    "email" : "email@email.com"
}

test_recipe_give_rating = {
    "recipe_id" : 1,
    "rating" : 3
}
test_review_write = {
    "title": "New review",
    "content": "new content",
    "image_url": ""
}
# comment like / reports runs same way.
test_review_give_report = {
    "like" : 0,
    'dislike' : 0,
    "report" : 1
}
test_comment_write = {
    "content" : "FinalTestComment2"
}
# food sample data(subject to change after acquiring food DB)
test_food_data_1 = {
    "id": 1,
    "name": "Cabbage",
    "nutrition": {
        "calories": "30",
        "sodium": "100"
    },
    "tag": {
        "veggie": "yes"
    },
    "unit": "g"
}
# FridgeItem sample data
test_fridge_item_1 = {
    "id": 1,
    "user_id": 1,
    "food_id": 1,
    "name": "baechu",
    "quantity": 100,
    "expiry_date": 2020/4/23,
    "nutrition_facts": {
        "calories": "100",
        "sodium": "50",
    }
}
test_post_fridge_item_1 = {
    "food_id": 1,
    "name": "yangbaechu",
    "quantity": 150,
    "expiry_date": "2020-04-25",
    "nutrition_facts": {
        "calories": "80",
        "sodium": "40",
    }
}
test_post_fridge_item_2 = {
    "food_id": 1,
    "name": "baechu",
    "quantity": 100,
    "expiry_date": "2020-04-25",
    "nutrition_facts": {
        "calories": "100",
        "sodium": "50",
    }
}
test_empty_fridge_item = {
    "food_id": None,
    "name": None,
    "quantity": None,
    "expiry_date": None,
    "nutrition_facts": None,
}

class t_data:
    def __init__(self):
        self.user = User.objects.create_user(username=test_user['username'], password=test_user['password'])
        self.user2 = User.objects.create_user(username=test_user_2['username'], password=test_user_2['password'])
        self.second_user = User.objects.create_user(username="some-other-user", password='password')
        self.ingredient = Ingredient.objects.create(name='name')
        self.i2 = Ingredient.objects.create(name='ing1')
        self.i3 = Ingredient.objects.create(name='name3')
        self.i5 = Ingredient.objects.create(name='ing5')
        self.recipe = Recipe.objects.create(title="plz kill me")
        self.review = Review.objects.create(recipe=self.recipe, user=self.user, title="title", content="content")
        self.revid = self.review.id
        self.fridgeItem = FridgeItem.objects.create(user=self.user, ingredient=self.ingredient)
        self.fridgeItem2 = FridgeItem.objects.create(user=self.user, ingredient=self.i2)
        self.second_item = FridgeItem.objects.create(user=self.second_user, ingredient=self.ingredient)
        self.item_id = self.fridgeItem.id
        self.user_id = self.user.id
        self.r1 = Recipe.objects.create(title="r1", diet_labels=["label1", "label2"], health_labels=["hlabel1", "hlabel2"])
        self.r2 = Recipe.objects.create(title="r2")
        self.r3 = Recipe.objects.create(title="r3")
        self.r4 = Recipe.objects.create(title="r4")
        self.r5 = Recipe.objects.create(title="r5")
        self.lpref = LabelPreference.objects.create(user=self.user, name="label1", score=1.2)
        self.lpref22 = LabelPreference.objects.create(user=self.user, name="hlabel1", score=1.3)
        self.ipref = IngredientPreference.objects.create(user=self.user, name="ing1", score=1.2)
        self.ipref22 = IngredientPreference.objects.create(user=self.user, name="ing5", score=1.2)
        self.inginc = IngredientIncidence.objects.create(recipe=self.recipe, ingredient=self.ingredient)
        self.inginc2 = IngredientIncidence.objects.create(recipe=self.r1, ingredient=self.ingredient)
        self.inginc256 = IngredientIncidence.objects.create(recipe=self.r2, ingredient=self.i2)
        self.inginc25 = IngredientIncidence.objects.create(recipe=self.r4, ingredient=self.i5)
        self.inginc23 = IngredientIncidence.objects.create(recipe=self.r2, ingredient=self.i3)
        self.inginc3 = IngredientIncidence.objects.create(recipe=self.r3, ingredient=self.i2)
        self.inginc4 = IngredientIncidence.objects.create(recipe=self.r4, ingredient=self.i2)
        self.pref = Preference.objects.create(user=self.user)