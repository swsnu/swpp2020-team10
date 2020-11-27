import datetime, json
def json_default(value):
    return value.strftime('%Y-%m-%d')
