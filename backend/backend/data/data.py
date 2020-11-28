# This is how API gives data back!!

# recipe get (recipe/1/)
# (recipe/) gives list of these
recipe_data_1 = {
    "id": 1,
    "food_id": 3,
    "title": "Kimchi",
    "content": "K-food Kimchi recipe blahblah",
    "rating": 3.44,
    "count_ratings": 1,
    "ingredients": {
        "cabbage": "100"
    },
    "cooking_time": 120,
    "diet_labels": [
        "balanced", "high-fiber"
    ],
    "health_labels": [],
    "calories": 500,
    "serving": 1
}

# review get
review_data_1 = {
    "id": 1,
    "recipe_id": 1,
    "user_id": 1,
    "title": "Kimchi review!!!",
    "content": "Kimchi is good modify content",
    "likes": 5,
    "reports": 3
}
review_data_2 = {
    "id": 2,
    "recipe_id": 1,
    "user_id": 1,
    "title": "Review 2",
    "content": "Review 22",
    "likes": 3,
    "reports": 0
}

# comment get
comment_data_1 = {
    "id": 1,
    "review_id": 1,
    "user_id": 1,
    "content": "some bad comment",
    "likes": 0,
    "reports": 0
}
comment_data_2 = {
    "id": 2,
    "review_id": 1,
    "user_id": 1,
    "content": "review test 1",
    "likes": 0,
    "reports": 0
}

# food get (not implemented)
food_data_1 = {
    "id": 1,
    "name": "Chicken",
    "Nutrition" : {
        "Calories" : 1000,
    },
    "tag" : {
        "type" : "food",
    },
    "unit" : "g"
}

#------------------------------------------------------------#

# This is how API should be called

recipe_give_rating = {
    "recipe_id" : 1,
    "rating" : 3
}

review_write = {
    "title": "New review",
    "content": "new content"
}

# comment like / reports runs same way.
review_give_like = {
    "like" : 0,
    "report" : 1
}

comment_write = {
    "content" : "FinalTestComment2"
}
