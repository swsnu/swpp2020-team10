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
