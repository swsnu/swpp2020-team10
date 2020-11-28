test_search_setting = {
    "diet_labels": ['balanced', 'high-fiber'],
    "health_labels": ['alcohol-free', 'immuno-supportive', 'celery-free', 'crustacean-free'],
    "calories": 800,
    "cooking_time": 5
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
    "cooking_time": 120,
    "tag": {
        "difficulty": "hard"
    },
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
    "password" : "p3141592",
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
    "content": "new content"
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
