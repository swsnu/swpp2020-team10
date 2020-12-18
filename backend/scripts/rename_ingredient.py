import json

keywords = []
rename_dict = {}
r = open('./data/ingredients.csv', 'w')

def process(ingredient_line):
    ingredient_json = json.loads(ingredient_line)

    name = ingredient_json.get('ingredient')
    if name not in rename_dict:
        print("Error")
    new_name = rename_dict[name]
    ingredient_json['ingredient'] = new_name
    r.write(json.dumps(ingredient_json) + '\n')
      
def strip_newline(line):
    return line[:-1]

with open('./data/ingredient_model.csv', 'r') as f:
    lines = f.readlines()
    lines = list(map(strip_newline, lines))

    for line in lines:
        parsed = line.split(', ')
        if len(parsed) < 3:
            rename_dict[parsed[0]] = parsed[0]
        else:
            rename_dict[parsed[0]] = parsed[2]

with open('./data/ingredients_bak.csv', 'r') as f:
    lines = f.readlines()
    lines = list(map(strip_newline, lines))
    for line in lines:
        process(line)

r.close()
